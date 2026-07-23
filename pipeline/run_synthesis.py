import os
import time
import json
import random
import re
import pandas as pd
from tqdm import tqdm
from google import genai
from google.genai import types

# Load API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                if line.strip().startswith("GEMINI_API_KEY="):
                    GEMINI_API_KEY = line.strip().split("=", 1)[1].strip()

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is required to run classification and synthesis.")

client = genai.Client(api_key=GEMINI_API_KEY)

DISCOVERY_QUESTIONS = {
    1: "Why do users repeatedly buy from the same categories?",
    2: "What prevents users from exploring new categories?",
    3: "How do users discover products today?",
    4: "What role do habits play in shopping behavior?",
    5: "What information do users need before trying a new category?",
    6: "What frustrations emerge repeatedly? (only frustrations tied to repeat-buying, discovery, or category behavior - NOT generic app/service complaints)",
    7: "Which user segments are more likely to experiment?",
    8: "What unmet needs emerge consistently across discussions?",
}

def call_gemini_with_retry(model_name, system_prompt, prompt, max_retries=6, delay=10.0):
    """Calls Gemini with rate limit recovery and fallback API support."""
    for attempt in range(max_retries):
        try:
            time.sleep(delay)
            # Try interactions first as in notebook
            try:
                interaction = client.interactions.create(
                    model=model_name,
                    system_instruction=system_prompt,
                    input=prompt
                )
                if interaction and hasattr(interaction, 'output_text') and interaction.output_text:
                    return interaction.output_text
            except AttributeError:
                # Standard fallback
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                    ),
                )
                if response and response.text:
                    return response.text
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "Quota" in err_str:
                wait_time = delay * (2 ** attempt) + random.uniform(0.5, 1.5)
                print(f"Rate limited. Waiting {wait_time:.1f}s (Attempt {attempt+1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                print(f"API call error: {e}")
                time.sleep(2)
    return None

def extract_json(response_text):
    clean_text = response_text.strip()
    if clean_text.startswith("```"):
        clean_text = re.sub(r"^```(?:json)?\s*\n?", "", clean_text)
        clean_text = re.sub(r"\n?\s*```$", "", clean_text)
    return clean_text.strip()

def main():
    csv_path = 'public/final-data/classified_reviews.csv'
    synthesis_checkpoint_path = "pipeline/synthesis_checkpoint.json"
    output_csv_path = 'public/final-data/synthesized_insights.csv'

    print("Loading classified reviews...")
    df_reviews = pd.read_csv(csv_path)
    enriched_reviews = df_reviews.to_dict('records')
    print(f"Loaded {len(enriched_reviews)} enriched reviews.")

    print("\nSynthesizing insights for the 8 Core Questions using Gemini...")

    SYNTHESIS_SYSTEM_PROMPT = """You are a senior product strategist at Blinkit. Your task is to synthesize customer reviews into actionable insights.
Respond with a JSON object with this exact structure:
{
  "summary": "<thematic summary paragraph>",
  "key_themes": [
    {
      "title": "<theme title>",
      "description": "<1-sentence description>",
      "frequency": <count>
    }
  ],
  "representative_quotes": [
    {
      "text": "<verbatim quote>",
      "review_id": <id>,
      "source": "<source>"
    }
  ],
  "confidence": <0.0-1.0>,
  "limitations": "<any limitations/caveats, 1-2 sentences>"
}
Return ONLY the JSON object. Do not wrap in markdown fences or add explanatory text."""

    synthesized_insights = []

    if os.path.exists(synthesis_checkpoint_path):
        try:
            with open(synthesis_checkpoint_path, "r", encoding="utf-8") as f:
                synthesized_insights = json.load(f)
            print(f"Loaded {len(synthesized_insights)} existing insights from checkpoint.")
        except Exception as e:
            print(f"Failed to load synthesis checkpoint: {e}. Starting fresh.")

    already_synthesized_qids = {s["question_id"] for s in synthesized_insights if isinstance(s, dict) and "question_id" in s}

    for q_id, q_text in DISCOVERY_QUESTIONS.items():
        if q_id in already_synthesized_qids:
            continue

        print(f"Synthesizing Q{q_id}: {q_text}")
        relevant_reviews = []
        for r in enriched_reviews:
            try:
                q_ids_raw = r["discovery_q_ids"]
                if pd.isna(q_ids_raw) or str(q_ids_raw).strip() == '':
                    q_ids = []
                else:
                    q_ids = json.loads(q_ids_raw) if isinstance(q_ids_raw, str) else list(q_ids_raw)
                
                if q_id in q_ids:
                    relevant_reviews.append(r)
            except Exception as ex:
                continue

        if not relevant_reviews:
            fallback_pool = enriched_reviews
            sample_size = min(15, len(fallback_pool))
            relevant_reviews = random.sample(fallback_pool, sample_size) if sample_size > 0 else []
            print(f"  Q{q_id} had no directly-tagged reviews - using random sample of {len(relevant_reviews)} fallback.")

        review_entries = []
        for r in relevant_reviews[:30]:
            rating_str = f" {int(r['rating'])} stars" if not pd.isna(r['rating']) else ""
            text_excerpt = str(r["text"])[:1500]
            # Replace non-ascii quotes or stars
            text_excerpt = text_excerpt.encode('ascii', 'ignore').decode('ascii')
            review_entries.append(f'[ID:{r["id"]}] ({r["source"]}{rating_str} | {r["sentiment"]})\n"{text_excerpt}"')
        reviews_block = "\n\n".join(review_entries)

        prompt = f"""Synthesize classified customer reviews into a comprehensive insight for this discovery question.

QUESTION Q{q_id}: "{q_text}"

RELEVANT REVIEWS:
{reviews_block}"""

        response_text = call_gemini_with_retry('gemini-3.1-flash-lite', SYNTHESIS_SYSTEM_PROMPT, prompt, delay=1.0)
        if response_text:
            clean_text = extract_json(response_text)
            try:
                parsed = json.loads(clean_text)
                parsed["question_id"] = q_id
                parsed["question_text"] = q_text
                synthesized_insights.append(parsed)
                # Save checkpoint immediately
                with open(synthesis_checkpoint_path, "w", encoding="utf-8") as f:
                    json.dump(synthesized_insights, f, indent=2)
            except Exception as e:
                print(f"Failed to parse synthesis JSON for Q{q_id}: {e}")
        else:
            print(f"Synthesis for Q{q_id} failed.")
            break

    df_insights = pd.DataFrame(synthesized_insights)
    df_insights.to_csv(output_csv_path, index=False)
    print(f"Synthesis finished! Saved to '{output_csv_path}'.")

if __name__ == '__main__':
    main()
