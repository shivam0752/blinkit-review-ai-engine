# ⚡ Blinkit Category Adoption - Growth Insights Dashboard & AI Pipeline

This repository contains the complete end-to-end code for extracting, cleaning, classifying, validating, and visualizing customer reviews across Google Play, App Store, Reddit, and Twitter/X. It exposes growth levers, recurring friction points, and category-switching barriers to drive cross-category trial and adoption for **Blinkit**.

---

## 🏗️ System Architecture & Data Flow

The project is structured as a unified system linking an offline **Data Engineering & LLM Pipeline** with an interactive **Growth Insights React Dashboard**:

```
[Play Store Scrapers] 
[App Store RSS Feeds] ➔ Ingestion & Cleansing ➔ Gemini LLM Engine ➔ PM Quality Audit ➔ React Growth Dashboard
[Apify Reddit/X Scrapers]
```

1. **Ingestion & Data Extraction:** Reviews are collected from Play Store RSS feeds and search results via Python. Custom Apify actors scrape Reddit and Twitter/X discussions.
2. **Cleansing & Translation:** Filters out sub-3-word noise, deduplicates reviews, and translates Hinglish/Hindi feedback (e.g. *bakwas support*, *loot* -> negative sentiment weight) to normalize emotional weight.
3. **LLM Taxonomy Classification:** Batch processes reviews using the Gemini API to map sentiment, tag sector taxonomy (Delivery, UX, Variety, Pricing, Trust, Habit), and route reviews to the 8 growth discovery hypotheses.
4. **PM Quality Audit Workbench:** Integrates a human-in-the-loop double-blind workbench to review AI outputs and override classifications, achieving 95%+ precision.
5. **Dashboard Visualization:** Renders metrics, hypothesis grids, user segments, opportunity grids, and the raw feedback explorer.

---

## 💡 Key Core Features Added

### 1. Unified Strategic Insights Engine
* **Ranked Barrier Themes**: Scrollable theme panels ranking customer friction by frequency.
* **Segment Opportunity Mapping**: Mapped strategic user segments (Daily Essentials Stocker, Gourmet Trial Enthusiast) to actionable product nudges.
* **Deep-Dive Friction Layers**: Covers localized Hinglish sentiment nuances (15% of complaints), category-specific blockers (Electronics DOA policies, Beauty counterfeit anxiety, Gourmet specifications deficit), and packaging/handling fee backlash.

### 2. High-Fidelity PDF Executive Report Export
* Prints a beautifully formatted, multi-page executive summary report directly from the top dashboard header.
* Uses React Portals (`createPortal`) to separate the print DOM target from the screen layout, enabling high-fidelity print rendering while automatically omitting interactive screen widgets and the Raw Feedback Explorer.

### 3. Real-Time AI Classification Sandbox (Playground)
* A dedicated tab for processing single reviews with long, multi-sentence suggestions testing Hinglish translation, beauty counterfeits, and packaging surcharge friction.
* Features a side-by-side **AI Decision Framework** visualizer explaining:
  * Translation & Cleansing Rules
  * Taxonomy Mapping Logic
  * Hypothesis Routing Trees
  * Under-the-hood System Prompt configuration

### 4. Top 5 Barrier & Adoption Themes (by Volume/Intensity)
Based on synthesis of the customer feedback corpus:
1. **Operational Reliability (15 mentions)**: Consistent delivery timelines and reliable stock availability build strong habitual trust, anchoring users into recurring shopping loops.
2. **Pricing & Fee Transparency (12 mentions)**: High friction and backlash surrounding compulsory packaging charges and handling fee surcharges (₹2-₹5 per order), which deter users from exploring higher-margin categories.
3. **Time-Critical Utility (12 mentions)**: Emergency utility demands (last-minute guest preparation, late-night necessities, morning rush staples) drive the highest instant conversions.
4. **Authenticity & Accuracy (9 mentions)**: Critical trust gate. Users express anxiety regarding counterfeit personal care products and expired premium gourmet foods, demanding expiry dates on product pages.
5. **Quality Control & Fulfillment (9 mentions)**: Frustrations with incorrect substitutions, missing items in orders, and stale perishables, which act as a direct barrier to category adoption.

---

## 📁 Repository Structure

```
├── api/                   # Vercel Serverless proxy for Gemini API calls
├── public/                # Static assets and final processed CSV datasets
├── src/                   # React app codebase
│   ├── components/        # UI components (flowcharts, sandbox, segments, charts)
│   │   ├── StrategicInsights.jsx # Unified insights block & printable PDF portal report
│   │   ├── SandboxChat.jsx       # AI Classification Playground & Decision Framework
│   │   ├── ArchitectureDiagram.jsx # Visual pipeline sequence diagram
│   │   └── MetricsOverview.jsx   # Top metrics cards and charts
│   └── App.jsx            # Main app entrypoint, navigation, and state management
├── pipeline/              # Data engineering & classification scripts
│   ├── script.ipynb       # Jupyter Notebook detailing cleaning & classification pipeline
│   └── twitter_reddit_extractor.py # Twitter/Reddit social scraper script
├── package.json           # Project dependencies
└── vite.config.js         # Vite configuration & serverless API simulation proxy
```

---

## ⚡ Getting Started

### 1. Running the Frontend Dashboard Locally
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables. Create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard in your browser (typically `http://localhost:5173`).

### 2. Running the Data Pipeline Notebook
1. Open the notebook at `pipeline/script.ipynb` in Google Colab or a local Jupyter server.
2. Provide your `GEMINI_API_KEY` and execute the cells to clean, process, and compile the final datasets.

---

## 🛠️ Technology Stack
* **Frontend:** React, Vite, Chart.js, Lucide Icons
* **Serverless Backend:** Node.js, Express (Vercel Serverless Functions proxy)
* **Data Processing:** Python, Pandas, BeautifulSoup, Jupyter Notebooks
* **LLM Engine:** Gemini 3.5 / Flash API
* **Scraping Infrastructure:** Apify (Reddit & Twitter Actors), Google Play Scraper
