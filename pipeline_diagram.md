# 🛠️ Blinkit Growth Discovery Engine: AI Pipeline Workflow
**Mermaid Flowchart of the Multi-Channel Data Extraction, Classification, Audit & Visualization Pipeline**

Below is the structured flowchart outlining the end-to-end data processing stream of the Blinkit growth discovery engine:

```mermaid
graph TD
    %% Styling Configuration
    classDef source fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef cleaning fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef llm fill:#3b0764,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
    classDef audit fill:#7c2d12,stroke:#fb923c,stroke-width:2px,color:#f8fafc;
    classDef output fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;

    %% Data Extraction / Sources
    subgraph Data_Extraction [1. Data Extraction & Scrapers]
        PlayStore["Play Store reviews Scraper<br/>(Google Play Scraper API)"]:::source
        AppStore["App Store RSS Feeds Scraper<br/>(XML RSS Scraper)"]:::source
        RedditScraper["Reddit Forums Extractor<br/>(Apify Scraper Actor)"]:::source
        TwitterScraper["Twitter/X Search Scraper<br/>(Apify Scraper Actor)"]:::source
    end

    %% Ingestion & Pre-processing
    subgraph Data_Cleansing [2. Ingestion & Pre-processing]
        Deduplication["Deduplication & Null Check<br/>(Pandas DataFrame filter)"]:::cleaning
        Cleansing["Length Cleansing<br/>(Remove short reviews < 3 words)"]:::cleaning
        Translation["Hinglish Translation Loop<br/>(Standardize emotional slang: bakwas, loot)"]:::cleaning
    end

    %% LLM Classification
    subgraph LLM_Engine [3. Gemini LLM Classification Engine]
        SystemPrompt["System Prompt Rules & Setup<br/>(JSON output schema instruction)"]:::llm
        BatchRouter["Batch Prompt Router<br/>(100-review chunks to maximize RPM)"]:::llm
        TaxonomyTagging["Taxonomy Mapping<br/>(Sentiment & Category Dept tagging)"]:::llm
        QuestionRouting["Discovery Q&A Routing<br/>(Map to Hypotheses Q1–Q8)"]:::llm
    end

    %% Human Quality Audit
    subgraph Validation_Audit [4. PM Quality Verification & Audit]
        ValidationSample["Validation Sample Dataset<br/>(validation_audit_sample.csv)"]:::audit
        DoubleBlindAudit["PM Quality Audit Workbench<br/>(Human-in-the-Loop review)"]:::audit
        AgreementMetric["Agreement & Override Tracker<br/>(Calculate AI precision target > 95%)"]:::audit
    end

    %% Visualization & Delivery
    subgraph Insights_Dashboard [5. Growth Dashboard & Reporting]
        DashboardCharts["Interactive Metrics & Charts<br/>(Chart.js + Sentiment distributions)"]:::output
        HypothesisGrid["Hypothesis Discovery Grid<br/>(Synthesized Q1–Q8 results)"]:::output
        SegmentOpportunity["Segment & Opportunity Maps<br/>(Growth levers + Nudges)"]:::output
        PDFExport["Executive PDF Print Engine<br/>(React Portal + media print CSS)"]:::output
    end

    %% Pipeline Connections
    PlayStore & AppStore & RedditScraper & TwitterScraper --> Deduplication
    Deduplication --> Cleansing
    Cleansing --> Translation
    Translation --> BatchRouter
    SystemPrompt --> BatchRouter
    BatchRouter --> TaxonomyTagging
    TaxonomyTagging --> QuestionRouting
    QuestionRouting --> ValidationSample
    ValidationSample --> DoubleBlindAudit
    DoubleBlindAudit --> AgreementMetric
    AgreementMetric -- "Audited Adjustments" --> DashboardCharts & HypothesisGrid & SegmentOpportunity
    DashboardCharts & HypothesisGrid & SegmentOpportunity --> PDFExport
```
