# 🛍️ Blinkit Review AI Engine: From Raw Customer Voice to Growth Insights

Customer feedback is noisy, chaotic, and scattered across the web. For a high-speed quick-commerce service like **Blinkit**, understanding *why* users adopt or resist new shopping categories is critical for growth. 

This repository houses the **Blinkit Review AI Engine**—an end-to-end data pipeline and interactive growth dashboard that turns unstructured, multi-channel customer conversations into structured, actionable product hypotheses.

Here is the story of how a single piece of feedback journeys from a customer's keyboard to our strategic product map.

---

## 📖 The Narrative: A Feedback Journey in 5 Acts

```
[Act 1: The Gathering] (Apify, Play Store, & Web Ingestion)
         │
         ▼
[Act 2: The Purge] (Pandas Deduplication & Filtering)
         │
         ▼
[Act 3: The Brain] (Gemini LLM Batch Classification)
         │
         ▼
[Act 4: The Checkpoint] (Human-in-the-Loop PM Audit)
         │
         ▼
[Act 5: The Reveal] (Interactive React Dashboard)
```

### 🎬 Act 1: The Gathering (Multi-Channel Ingestion)
The journey begins wherever our users are speaking. Customer feedback is ingested from multiple channels:
* **The App Stores:** App Store RSS feeds and the Google Play Store reviews capture direct post-purchase ratings.
* **The Social Web:** We deploy **Apify actors** to scrape Twitter/X and Reddit, pulling organic conversations, rants, and recommendations about Blinkit.
* **The Forums:** Google Search results are scraped via SerpAPI to extract community discussions.
* *Artifact:* `pipeline/twitter_reddit_extractor.py` handles the social retrieval.

### 🧹 Act 2: The Purge (Pandas Cleansing)
Raw feedback is messy—filled with spam, duplicate reviews, and short one-word messages (e.g., "Good", "Bad") that contain no product context.
* We feed the raw data into a **Pandas pipeline** to deduplicate identical texts.
* We discard reviews under 3 words.
* We handle missing attributes (ratings, dates) and standardize the schemas.
* *Result:* The raw noise is compressed into a clean, unified dataset.

### 🧠 Act 3: The Brain (Gemini LLM Batch Processing)
Now, we categorize. The cleaned reviews are pushed in 100-record batches to the **Gemini 2.0 / 3.1 Flash API**. 
* Gemini reads English, Hindi, and Hinglish (Latin-script mix) and translates the core meaning.
* It classifies the reviews across **8 strategic PM Discovery Questions** (e.g., *Why do users buy repeatedly? What prevents them from trying new categories?*).
* It assigns taxonomy tags (pricing, delivery, quality, variety) and maps obstacles to barrier themes (trust deficits, price sensitivity).
* *Artifact:* `pipeline/script.ipynb` manages the batch API prompts and exponential backoff retry logic.

### 🛡️ Act 4: The Checkpoint (Human-in-the-loop PM Audit)
To ensure the LLM doesn't hallucinate or misinterpret colloquial Indian terms, the pipeline stops at a **Quality Check Checkpoint**. 
* Product Managers review a random validation sample of 40 reviews.
* They audit the sentiment and tags, confirming agreement or overriding the AI's classification.
* Once the validation metrics cross our quality gates, the pipeline synthesizes and structures the findings.

### 📊 Act 5: The Reveal (The Growth Dashboard)
The processed data is ingested by our **React + Vite Dashboard**.
* **Hypothesis Grid:** PMs click through the 8 strategic questions to see synthesized summaries, top themes, and the exact user quotes backing them up.
* **Segment Analysis:** Displays consumer archetypes (e.g. *Daily Essentials Stockers*, *Emergency Utility Buyers*) built from their shopping habits, items ordered, and primary influencers.
* **Visual distribution:** Chart.js graphs map the sentiment shares, category tags, and feedback sources.
* **AI Sandbox Simulator:** An interactive sandbox chat simulator where developers and PMs can type custom reviews and see how the ingestion and LLM classification stages process them in real-time.

---

## 📁 Repository Structure

```
├── api/                   # Vercel Serverless proxy for Gemini API calls
├── public/                # Static assets and final processed CSV datasets
├── src/                   # React app codebase
│   ├── components/        # Extracted components (flowchart, sandbox chat, user segments, charts)
│   │   ├── ArchitectureDiagram.jsx # Streamlined data flow ribbon
│   │   ├── SandboxChat.jsx         # Interactive review classifier simulator
│   │   ├── UserSegments.jsx        # Consumer segments mapping
│   │   ├── MetricsOverview.jsx     # Distribution charts
│   │   └── HypothesisGrid.jsx      # Hypothesis discovery questions layout
│   └── App.jsx            # Main app entrypoint and state management
├── pipeline/              # Data engineering & classification scripts
│   ├── script.ipynb       # Jupyter Notebook detailing cleaning & classification pipeline
│   └── twitter_reddit_extractor.py # Twitter/Reddit scraper after getting data via Apify
├── package.json           # Project dependencies
└── vite.config.js         # Vite configuration & serverless API simulation proxy
```

---

## ⚡ Getting Started

### 1. Running the Data Pipeline
To inspect or rerun the scraping and classification logic:
1. Open the notebook at [pipeline/script.ipynb](file:///d:/antigravity/projects/fin%20project%20nextleap/project/pipeline/script.ipynb).
2. Configure your `GEMINI_API_KEY` and run the pipeline cells to output `classified_reviews.csv` and `synthesized_insights.csv` into the `public/final-data` folder.

### 2. Running the Dashboard Locally
To start the React frontend:
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Configure your `.env` file:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard in your browser (typically `http://localhost:5173`).
