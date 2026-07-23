import sys
import json
import argparse
from datetime import datetime, timedelta, timezone
import urllib.parse

# Force stdout to use UTF-8 to prevent encoding errors on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def scrape_play_store(limit=100, lookback_date=None):
    try:
        from google_play_scraper import Sort, reviews as play_reviews
        collected = []
        continuation_token = None
        # Fetch batches of reviews
        batch, continuation_token = play_reviews(
            'com.grofers.customerapp',
            lang='en', country='in', sort=Sort.NEWEST,
            count=limit, continuation_token=continuation_token
        )
        if batch:
            for r in batch:
                dt = r["at"] if isinstance(r["at"], datetime) else datetime.fromisoformat(str(r["at"]))
                # Check if it is within lookback date
                if lookback_date and dt.replace(tzinfo=timezone.utc) < lookback_date:
                    continue
                collected.append({
                    "source": "play_store",
                    "text": r["content"],
                    "rating": float(r["score"]),
                    "date": dt.isoformat(),
                    "author": r["userName"],
                    "url": "https://play.google.com/store/apps/details?id=com.grofers.customerapp"
                })
        return collected
    except Exception as e:
        sys.stderr.write(f"Play Store scrape failed: {e}\n")
        return []

def scrape_app_store(limit=100, lookback_date=None):
    try:
        import requests
        from dateutil import parser as dateparser
        APP_STORE_ID = 960335206
        collected = []
        for page in range(1, 4):
            url = f"https://itunes.apple.com/in/rss/customerreviews/page={page}/id={APP_STORE_ID}/sortby=mostrecent/json"
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            if resp.status_code != 200:
                break
            data = resp.json()
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                break
            for e in entries:
                if "im:rating" not in e or "content" not in e:
                    continue
                try:
                    dt = dateparser.parse(e["updated"]["label"])
                except Exception:
                    dt = None
                if lookback_date and dt and dt.replace(tzinfo=timezone.utc) < lookback_date:
                    continue
                collected.append({
                    "source": "app_store",
                    "text": e["content"]["label"],
                    "rating": float(e["im:rating"]["label"]),
                    "date": dt.isoformat() if dt else "",
                    "author": e.get("author", {}).get("name", {}).get("label", "unknown"),
                    "url": f"https://apps.apple.com/in/app/id{APP_STORE_ID}"
                })
                if len(collected) >= limit:
                    return collected
        return collected
    except Exception as e:
        sys.stderr.write(f"App Store scrape failed: {e}\n")
        return []

def scrape_forums(lookback_date=None):
    # Pull newest entries from extracted_social_media.csv and filter by date.
    try:
        import pandas as pd
        import os
        import numpy as np
        
        csv_path = "project/public/final-data/extracted_social_media.csv"
        if not os.path.exists(csv_path):
            csv_path = "public/final-data/extracted_social_media.csv"
        if not os.path.exists(csv_path):
            csv_path = "../public/final-data/extracted_social_media.csv"
            
        if not os.path.exists(csv_path):
            sys.stderr.write(f"Forums source file not found.\n")
            return []
            
        df = pd.read_csv(csv_path)
        collected = []
        for _, row in df.iterrows():
            dt_str = row.get("date")
            try:
                from dateutil import parser as dateparser
                dt = dateparser.parse(str(dt_str))
            except Exception:
                dt = None
                
            if lookback_date and dt and dt.replace(tzinfo=timezone.utc) < lookback_date:
                continue
                
            rating_val = row.get("rating")
            rating = float(rating_val) if pd.notna(rating_val) else None
            
            collected.append({
                "source": str(row.get("source", "reddit")),
                "text": str(row.get("text", "")),
                "rating": rating,
                "date": dt.isoformat() if dt else str(dt_str),
                "author": str(row.get("author", "unknown")),
                "url": str(row.get("url", ""))
            })
        return collected
    except Exception as e:
        sys.stderr.write(f"Forums extraction failed: {e}\n")
        return []

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sources', type=str, default='play_store,app_store,reddit,twitter')
    parser.add_argument('--months', type=int, default=3)
    args = parser.parse_args()

    sources = [s.strip() for s in args.sources.split(',')]
    lookback_days = args.months * 30
    lookback_date = datetime.now(timezone.utc) - timedelta(days=lookback_days)

    results = []

    if 'play_store' in sources:
        results.extend(scrape_play_store(limit=150, lookback_date=lookback_date))
    if 'app_store' in sources:
        results.extend(scrape_app_store(limit=150, lookback_date=lookback_date))
    if 'reddit' in sources or 'twitter' in sources or 'forums' in sources:
        results.extend(scrape_forums(lookback_date=lookback_date))

    # Print out results as a single JSON array
    print(json.dumps(results, ensure_ascii=False))

if __name__ == '__main__':
    main()
