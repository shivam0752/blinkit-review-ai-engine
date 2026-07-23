import pandas as pd
import json
import os

def main():
    csv_path = 'public/final-data/classified_reviews.csv'
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found in current directory.")
        return

    print("Loading classified_reviews.csv...")
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} rows.")

    def enrich_row(row):
        text = str(row['text']).lower()
        
        # Parse existing or default to empty list
        try:
            category_tags = json.loads(row['category_tags']) if not pd.isna(row['category_tags']) and str(row['category_tags']).strip() != '' else []
        except:
            category_tags = []
            
        try:
            barrier_themes = json.loads(row['barrier_themes']) if not pd.isna(row['barrier_themes']) and str(row['barrier_themes']).strip() != '' else []
        except:
            barrier_themes = []
            
        try:
            discovery_q_ids = json.loads(row['discovery_q_ids']) if not pd.isna(row['discovery_q_ids']) and str(row['discovery_q_ids']).strip() != '' else []
        except:
            discovery_q_ids = []

        sentiment = str(row['sentiment'])
        confidence = float(row['confidence']) if not pd.isna(row['confidence']) else 0.5

        # Check if tags or QIDs are empty, or if confidence is default low (0.5)
        if len(category_tags) == 0 or len(barrier_themes) == 0 or len(discovery_q_ids) == 0 or sentiment == 'neutral' or confidence == 0.5:
            # 1. Determine Sentiment
            has_positive = any(w in text for w in ['easy', 'good', 'fast', 'love', 'discovered', 'excellent', 'amazing', 'happy', 'best', 'superb', 'fresh', 'speedy', 'nice', 'great'])
            has_negative = any(w in text for w in ['bad', 'forgot', 'worst', 'refund', 'confusing', 'poor', 'frustrated', 'late', 'loot', 'surcharge', 'fee', 'charge', 'charging', 'bekaar', 'bakwas', 'scam', 'failed', 'cheat', 'spoiled', 'defective', 'expired', 'stale'])
            
            if has_positive and has_negative:
                row_sentiment = 'mixed'
            elif has_negative:
                row_sentiment = 'negative'
            elif has_positive:
                row_sentiment = 'positive'
            else:
                row_sentiment = sentiment if sentiment != 'nan' and sentiment != '' else 'neutral'
                
            row['sentiment'] = row_sentiment
            
            # 2. Enrich Category Tags
            new_tags = set(category_tags)
            if any(w in text for w in ['refund', 'money', 'price', 'cost', 'cheap', 'expensive', 'fee', 'charge', 'surcharge', 'paying', 'pay', 'cash', 'cod', 'coupon', 'discount']):
                new_tags.add('pricing')
            if any(w in text for w in ['delivery', 'late', 'forgot', 'delay', 'rider', 'boy', 'hours', 'minutes', 'speed', 'instant', 'delivered']):
                new_tags.add('delivery')
            if any(w in text for w in ['search', 'find', 'app', 'layout', 'confusing', 'ui', 'ux', 'cart', 'freeze', 'hang', 'login']):
                new_tags.add('ux')
            if any(w in text for w in ['stale', 'spoil', 'fresh', 'expired', 'authenticity', 'fake', 'counterfeit', 'quality', 'bad', 'worst', 'poor', 'loose', 'defective', 'used']):
                new_tags.add('quality')
                new_tags.add('trust')
            if any(w in text for w in ['snack', 'grocery', 'vegetable', 'brand', 'milk', 'coriander', 'chips', 'ramen', 'beauty', 'makeup']):
                new_tags.add('variety')
            if any(w in text for w in ['daily', 'habit', 'always', 'normally', 'routine', 'morning', 'every day', 'repeatedly']):
                new_tags.add('habit')
                
            if len(new_tags) == 0:
                new_tags.add('ux') if row_sentiment == 'neutral' else new_tags.add('trust')
                
            row['category_tags'] = json.dumps(list(new_tags))

            # 3. Enrich Barrier Themes
            new_barriers = set(barrier_themes)
            if 'quality' in new_tags:
                new_barriers.add('quality_uncertainty')
            if 'trust' in new_tags:
                new_barriers.add('return_policy_fear')
            if 'pricing' in new_tags:
                new_barriers.add('price_friction')
            if 'delivery' in new_tags:
                new_barriers.add('delivery_friction')
            if any(w in text for w in ['support', 'bot', 'chat', 'samiya', 'executive', 'closed', 'ghosted', 'replied']):
                new_barriers.add('support_friction')
            if any(w in text for w in ['cheat', 'fraud', 'scam', 'theft', 'missing', 'failed']):
                new_barriers.add('past_bad_experience')
                
            if len(new_barriers) == 0:
                new_barriers.add('quality_uncertainty')
                
            row['barrier_themes'] = json.dumps(list(new_barriers))

            # 4. Enrich Discovery Q IDs
            new_qids = set(discovery_q_ids)
            if any(w in text for w in ['again', 'always', 'daily', 'habit', 'normally', 'repeat', 'routine']):
                new_qids.add(1)
                new_qids.add(4)
            if any(w in text for w in ['defective', 'return', 'replace', 'scam', 'fraud', 'fake', 'counterfeit', 'policy', 'cod', 'proof']):
                new_qids.add(2)
                new_qids.add(5)
            if any(w in text for w in ['discovered', 'try', 'experiment', 'first time', 'find', 'social', 'reel', 'reddit']):
                new_qids.add(3)
            if any(w in text for w in ['worst', 'bad', 'poor', 'spoil', 'stale', 'expired', 'support', 'bot', 'ghosted', 'closed', 'missing']):
                new_qids.add(6)
            if any(w in text for w in ['ramen', 'hostel', 'student', 'bachelor', 'explore']):
                new_qids.add(7)
            if any(w in text for w in ['surcharge', 'fee', 'charge', 'threshold', 'minimum', 'free delivery', 'summary', 'checkout', 'pay later']):
                new_qids.add(8)

            if len(new_qids) == 0:
                if row_sentiment == 'negative':
                    new_qids.add(6)
                elif row_sentiment == 'positive':
                    new_qids.add(1)
                else:
                    new_qids.add(8)
                    
            row['discovery_q_ids'] = json.dumps(list(new_qids))
            row['confidence'] = 0.8
            
        return row

    df = df.apply(enrich_row, axis=1)

    print("Saving enriched classified_reviews.csv...")
    df.to_csv(csv_path, index=False)
    print("Enrichment completed successfully!")

if __name__ == '__main__':
    main()
