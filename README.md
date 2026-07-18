# Blinkit Category Adoption - Growth Insights Dashboard & Data Pipeline

This repository contains the complete end-to-end code for extracting, cleaning, classifying, and visualizing customer reviews across Google Play, App Store, Reddit, and Twitter/X to identify growth levers and adoption barriers for new categories on **Blinkit**.

---

## 🏗️ Architecture & Data Flow

The project is structured into a two-part system: an offline **Data Engineering & LLM Pipeline** and an interactive **Growth Insights React Dashboard**.

```
[Apify Scrapers (Reddit/Twitter)] 
[Google Play Scraper & RSS Feeds] ➔ Ingestion & Cleaning (Pandas) ➔ Gemini 3.1 Flash Lite API ➔ React & Chart.js Dashboard
```

1. **Ingestion & Data Extraction:** Reviews are collected from Google Play, App Store RSS feed, and search results via Python. Custom Apify actors scrape Reddit and Twitter/X data.
2. **Text Cleansing:** Deduplicates reviews, drops null fields, and filters out noise (reviews under 3 words) using a Pandas pipeline.
3. **LLM Classification:** Batch prompts Gemini 3.1 Flash Lite (in 100-record chunks) to identify sentiment, taxonomy tags, adoption barriers, and map reviews to 8 primary research questions.
4. **Quality Check Verification:** Employs a human-in-the-loop checkpoint workbench to audit and override AI classifications.
5. **Dashboard Visualization:** Renders interactive distribution charts, hypothesis grids, and a live raw feedback explorer.

---

## 📁 Repository Structure

```
├── api/                   # Vercel Serverless proxy for Gemini API calls
├── public/                # Static assets and final processed CSV datasets
├── src/                   # React app codebase
│   ├── components/        # Extracted components (flowchart, chat sandbox, segments, charts)
│   └── App.jsx            # Main app entrypoint and state management
├── pipeline/              # Data engineering & classification scripts
│   ├── script.ipynb       # Jupyter Notebook detailing cleaning & classification pipeline
│   └── twitter_reddit_extractor.py # Twitter/Reddit social scraper after getting the data through apify
├── package.json           # Project dependencies
└── vite.config.js         # Vite configuration & serverless API simulation proxy
```

---

## ⚡ Getting Started

### 1. Running the Data Pipeline
To inspect or rerun the scraping and classification logic:
1. Open the notebook at [pipeline/script.ipynb](file:///d:/antigravity/projects/fin%20project%20nextleap/project/pipeline/script.ipynb) in Google Colab or a local Jupyter server.
2. Provide your `GEMINI_API_KEY` and optional social tokens in the environment secrets.
3. Execute the cells to extract the fresh datasets and save `classified_reviews.csv` and `synthesized_insights.csv`.

### 2. Running the Dashboard Locally
To start the React frontend:
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables. Rename process variables or create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard in your browser (typically `http://localhost:5173`).

---

## 🛠️ Technology Stack
* **Frontend:** React, Vite, Chart.js, Lucide Icons
* **Serverless Backend:** Node.js, Express (Vercel Serverless Functions proxy)
* **Data Processing:** Python, Pandas, BeautifulSoup, Jupyter Notebooks
* **LLM Engine:** Gemini 2.0 / 3.1 Flash API (Google AI SDK)
* **Scraping Infrastructure:** Apify (Reddit & Twitter Actors), Google Play Scraper
