import os
import sys
import glob
import pandas as pd
import numpy as np

# Force stdout to use UTF-8 to prevent encoding errors on Windows terminal when printing emojis
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def extract_latest_datasets():
    # Detect current directory structure
    has_data_dir = os.path.isdir("data")
    prefix = "data/" if has_data_dir else ""
    
    print(f"🔍 Searching for raw scraper datasets (using prefix: '{prefix}')...")
    
    # 1. Find the latest Reddit scraper file
    reddit_pattern = f"{prefix}dataset_reddit-scraper_*.csv"
    reddit_files = glob.glob(reddit_pattern)
    if not reddit_files:
        print(f"⚠️ No Reddit scraper CSV files found matching '{reddit_pattern}'")
        df_reddit_clean = pd.DataFrame(columns=["source", "text", "rating", "date", "author", "url"])
    else:
        latest_reddit = max(reddit_files, key=os.path.getmtime)
        print(f"📊 Found latest Reddit dataset: {latest_reddit}")
        try:
            df_reddit = pd.read_csv(latest_reddit)
            
            # Map Reddit columns
            df_reddit['body'] = df_reddit['body'].fillna('')
            df_reddit['title'] = df_reddit['title'].fillna('')
            
            def combine_text(row):
                title = str(row['title']).strip()
                body = str(row['body']).strip()
                if title and body:
                    return f"{title}\n{body}"
                return title or body

            df_reddit_clean = pd.DataFrame()
            df_reddit_clean['text'] = df_reddit.apply(combine_text, axis=1)
            df_reddit_clean['source'] = 'reddit'
            df_reddit_clean['rating'] = np.nan
            df_reddit_clean['date'] = df_reddit['createdAt']
            df_reddit_clean['author'] = df_reddit['username']
            df_reddit_clean['url'] = df_reddit['url']
            
            print(f"✅ Successfully parsed {len(df_reddit_clean)} Reddit rows.")
        except Exception as e:
            print(f"❌ Error reading/parsing Reddit dataset: {e}")
            df_reddit_clean = pd.DataFrame(columns=["source", "text", "rating", "date", "author", "url"])

    # 2. Find the latest X/Twitter scraper file
    x_pattern = f"{prefix}dataset_x-scraper_*.csv"
    x_files = glob.glob(x_pattern)
    if not x_files:
        print(f"⚠️ No X/Twitter scraper CSV files found matching '{x_pattern}'")
        df_x_clean = pd.DataFrame(columns=["source", "text", "rating", "date", "author", "url"])
    else:
        latest_x = max(x_files, key=os.path.getmtime)
        print(f"📊 Found latest X/Twitter dataset: {latest_x}")
        try:
            df_x = pd.read_csv(latest_x)
            
            # Map X/Twitter columns
            df_x_clean = pd.DataFrame()
            df_x_clean['text'] = df_x['text']
            df_x_clean['source'] = 'twitter'
            df_x_clean['rating'] = np.nan
            df_x_clean['date'] = df_x['date']
            df_x_clean['author'] = df_x['author/username']
            df_x_clean['url'] = df_x['tweet_url']
            
            print(f"✅ Successfully parsed {len(df_x_clean)} X/Twitter rows.")
        except Exception as e:
            print(f"❌ Error reading/parsing X/Twitter dataset: {e}")
            df_x_clean = pd.DataFrame(columns=["source", "text", "rating", "date", "author", "url"])

    # 3. Combine and Clean the Datasets
    print("\n🧹 Combining and cleaning social media datasets...")
    combined_df = pd.concat([df_reddit_clean, df_x_clean], ignore_index=True)
    
    # Remove rows where text is empty or NaN
    n_before = len(combined_df)
    combined_df = combined_df.dropna(subset=['text'])
    combined_df = combined_df[combined_df['text'].str.strip() != '']
    
    # Drop duplicates by text content
    combined_df = combined_df.drop_duplicates(subset=['text'])
    
    # Filter out text under 3 words
    combined_df["word_count"] = combined_df["text"].str.split().str.len()
    combined_df = combined_df[combined_df["word_count"] >= 3].drop(columns=["word_count"])
    n_after = len(combined_df)
    
    print(f"✨ Deduplication, Length & Word Count Filtering: {n_before} raw rows -> {n_after} cleaned rows.")
    
    # Save the standardized output
    output_path = f"{prefix}extracted_social_media.csv"
    combined_df.to_csv(output_path, index=False)
    print(f"💾 Saved standardized dataset to: {output_path}")
    
    # Print status breakdown
    print("\n📊 Extracted Dataset Summary:")
    print(combined_df['source'].value_counts().to_string())
    print("\n🎉 Extractor execution completed successfully!")

if __name__ == "__main__":
    extract_dataset_func = extract_latest_datasets
    extract_dataset_func()
