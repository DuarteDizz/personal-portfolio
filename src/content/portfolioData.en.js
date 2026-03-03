// ============================================
// PORTFOLIO CONTENT (EN) - SINGLE SOURCE OF TRUTH
// ============================================

export const brand = {
  navbarIcon: "public/Dataverse Logo.png",
  favicon: "https://i.imgur.com/OaZbUGJ.png",
  logoText: "D",
};

export const profile = {
  name: "Diego Duarte",
  title: "Applied Data Scientist",
  tagline: "Building Data & AI solutions and products, so the future fits into the present.",
  photoUrl: "https://i.imgur.com/CE4b10B.png",
  email: "duartediego.ds@gmail.com",
  location: "Belo Horizonte, MG",
  resumeUrl: "#",
  status: "Open to opportunities",
  bio: "I am a Data Scientist with ~3 years of experience developing end-to-end Data and AI products, from data ingestion and processing to modeling, validation, and delivering business impact, connecting Python, SQL, Machine Learning, and Generative AI (LLMs, RAG, and agents/multi-agent systems).",
  social: {
    github: "https://github.com/DuarteDizz",
    linkedin: "https://www.linkedin.com/in/diegohslduarte/",
    kaggle: "https://kaggle.com"
  }
};

export const hero = {
  terminal: {
    title: "diego@portfolio.py",
    codeLineTemplate: "print(\"Hello World! My name is {{name}}.\")",
    typingSpeedMs: 50
  },
  ctas: [
    { label: "View Projects", page: "Projects", variant: "primary" },
    { label: "Download Resume", url: "#", variant: "secondary", external: true }
  ],
  signature: {
    beforeLocation: "Based in",
    afterLocation: "Available for roles in",
    roles: "Data / Analytics / AI",
    locationSeparator: ".",
    rolesSuffix: "."
  },
};

export const skillCategories = [
  "Programming",
  "Databases",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "Visualization & BI",
  "Cloud & MLOps"
];

export const skillsData = [
  {
    name: "Python",
    category: "Programming",
    level: "Advanced",
    icon: "code",
    description: "Core language for data analysis, machine learning, automation, and backend-oriented applications.",
    highlights: ["Pandas", "NumPy", "SciPy", "BeautifulSoup"],
    relatedProjectIds: ["customer-churn", "demand-forecasting"]
  },
  {
    name: "SQL",
    category: "Programming",
    level: "Advanced",
    icon: "database",
    description: "Query language for data extraction, transformation, analysis, and relational database operations.",
    highlights: ["Complex Queries", "Joins & CTEs", "PostgreSQL", "BigQuery"],
    relatedProjectIds: []
  },
  {
    name: "Cypher",
    category: "Programming",
    level: "Intermediate",
    icon: "code",
    description: "Query language for graph databases, focused on traversing and analyzing relationships in connected data.",
    highlights: ["Neo4j", "Pattern Matching", "Graph Queries"],
    relatedProjectIds: []
  },

  {
    name: "PostgreSQL",
    category: "Databases",
    level: "Advanced",
    icon: "database",
    description: "Relational database for storing, managing, and querying structured data efficiently.",
    highlights: ["Relational Modeling", "Query Optimization", "Indexes"],
    relatedProjectIds: []
  },
  {
    name: "Neo4j",
    category: "Databases",
    level: "Intermediate",
    icon: "zap",
    description: "Graph database for modeling, querying, and analyzing highly connected data and complex relationships.",
    highlights: ["Cypher", "Knowledge Graphs", "GraphRAG", "Text2Cypher"],
    relatedProjectIds: []
  },

  {
    name: "Scikit-learn",
    category: "Machine Learning",
    level: "Advanced",
    icon: "brain",
    description: "Machine learning library for building, training, and evaluating classical predictive models.",
    highlights: ["Regression", "Classification", "Clustering", "Dimensionality Reduction"],
    relatedProjectIds: []
  },
  {
    name: "XGBoost",
    category: "Machine Learning",
    level: "Advanced",
    icon: "brain",
    description: "Gradient boosting framework designed for high-performance predictive modeling on tabular data.",
    highlights: ["Boosting", "Hyperparameter Tuning", "Feature Importance"],
    relatedProjectIds: []
  },

  {
    name: "TensorFlow",
    category: "Deep Learning",
    level: "Advanced",
    icon: "brain",
    description: "Deep learning framework for building, training, and deploying neural network models.",
    highlights: ["Keras API", "ANNs", "Model Training", "Model Serving"],
    relatedProjectIds: []
  },
  {
    name: "Physics-informed Neural Networks",
    category: "Deep Learning",
    level: "Intermediate",
    icon: "brain",
    description: "Neural networks that incorporate physical laws and differential constraints into the learning process.",
    highlights: ["Scientific ML", "Differential Equations", "Physics Constraints"],
    relatedProjectIds: []
  },

  {
    name: "Large Language Models (LLMs)",
    category: "Generative AI",
    level: "Advanced",
    icon: "sparkles",
    description: "Foundation models used for text generation, reasoning, question answering, and language-based applications.",
    highlights: ["Prompt Engineering", "LangChain", "Transformers", "Strands"],
    relatedProjectIds: ["news-topic-modeling"]
  },
  {
    name: "Retrieval Augmented Generation (RAG)",
    category: "Generative AI",
    level: "Advanced",
    icon: "sparkles",
    description: "Architecture that enhances LLM responses by retrieving relevant external context before generation.",
    highlights: ["Context Retrieval", "Vector Search", "GraphRAG"],
    relatedProjectIds: []
  },
  {
    name: "Agentic AI",
    category: "Generative AI",
    level: "Intermediate",
    icon: "sparkles",
    description: "AI systems designed to plan, reason, and execute tasks autonomously through tool use and orchestration.",
    highlights: ["AI Agents", "Multi-Agent Systems", "Strands"],
    relatedProjectIds: []
  },

  {
    name: "Power BI",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "bar-chart",
    description: "Business intelligence platform for building dashboards, interactive reports, and data-driven insights.",
    highlights: ["DAX", "Power Query", "Data Modeling"],
    relatedProjectIds: []
  },
  {
    name: "Plotly",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "line-chart",
    description: "Interactive visualization library for dashboards, exploratory analysis, and dynamic charts.",
    highlights: ["Interactive Charts", "Plotly Express", "Dash"],
    relatedProjectIds: []
  },
  {
    name: "Streamlit",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "layout",
    description: "Framework for rapidly building interactive data apps, prototypes, and ML demos in Python.",
    highlights: ["Data Apps", "Custom Components", "Caching"],
    relatedProjectIds: ["news-topic-modeling"]
  },
  {
    name: "Matplotlib",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "bar-chart",
    description: "Python library for creating highly customizable static charts and analytical visualizations.",
    highlights: ["Custom Plots", "Subplots", "Publication-quality Charts"],
    relatedProjectIds: []
  },

  {
    name: "Docker",
    category: "Cloud & MLOps",
    level: "Advanced",
    icon: "box",
    description: "Containerization platform for building reproducible development, analytics, and ML environments.",
    highlights: ["Docker Compose", "Multi-stage Builds", "Environment Reproducibility"],
    relatedProjectIds: ["customer-churn"]
  }
];

export const aboutBlocks = [
  {
    title: "At a Glance",
    icon: "user",
    bullets: [
      "~3 years building Data and AI products and solutions",
      "Connecting data ingestion, analysis, modeling, and validation",
      "Passionate about using technology to transform business and people lives"
    ]
  },
  {
    title: "What I Do",
    icon: "briefcase",
    bullets: [
      "Turn complex data into useful insights",
      "Build intelligent systems to support decision making and digital transformation",
      "Use AI based applications to solve complex problems and bring business innovation",
      "Implement solutions following Data Science best practices"
    ]
  },
  {
    title: "How I Work",
    icon: "settings",
    bullets: [
      "Data-driven decision making",
      "Collaborative approach with cross-functional teams",
      "Focus on business impact, not just accuracy metrics",
      "Continuous learning and knowledge sharing",
      "Inovation centered mindset"
    ]
  },
  {
    title: "Values & Principles",
    icon: "heart",
    bullets: [
      "From the big picture to the details",
      "Reproducibility and documentation",
      "Ethical AI and responsible data usage",
      "Continuous improvement and iteration",
      "Teaching and mentoring others"
    ]
  }
];

export const projects = [
  {
    id: "customer-churn",
    title: "Customer Churn Prediction",
    shortDescription: "ML system predicting customer churn with explainable AI insights using SHAP values for a telecom company.",
    impactStatement: "Reduced customer churn by 23% through proactive retention campaigns",
    problem: "A major telecom provider was losing $2M annually due to unexpected customer churn. The existing rule-based system had low accuracy and couldn't identify at-risk customers early enough for intervention.",
    approach: "Built an end-to-end ML pipeline using XGBoost with careful feature engineering from customer behavior data. Implemented SHAP for model interpretability, allowing the business team to understand why each customer was flagged. Created a real-time scoring API and integrated with the CRM for automated alerts.",
    results: "The model achieved 0.89 AUC-ROC on holdout data. More importantly, the retention team was able to intervene with 78% of flagged customers before they churned, resulting in $460K quarterly savings.",
    metrics: [
      { label: "AUC-ROC", value: "0.89" },
      { label: "Churn Reduction", value: "23%" },
      { label: "Quarterly Savings", value: "$460K" },
      { label: "Precision@10%", value: "0.72" }
    ],
    techStack: ["Python", "XGBoost", "SHAP", "FastAPI", "PostgreSQL", "Docker", "Airflow"],
    tags: ["Classification", "Explainable AI", "Production ML"],
    links: { github: "https://github.com", blog: "#" },
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
    ],
    whatIdImprove: "Would add survival analysis for time-to-churn predictions. Also exploring transformer-based approaches for sequential customer behavior modeling.",
    reproducibility: "Clone the repo, run `docker-compose up` to start the environment. Sample data included. See README for full setup instructions.",
    featured: true,
    caseStudy: true
  }
];

export const experience = [
  {
    title: "Data Scientist",
    company: "Peers Consulting + Technology",
    location: "Belo Horizonte, MG",
    period: "2024 - 2026",
    description: "Built end-to-end Data and AI solutions as part of the Data & AI team, combining large-scale data processing, experimentation, modeling, and business delivery for enterprise clients.",
    highlights: [
      "Developed and improved a hybrid recommendation system (graphs + advanced statistical methods) for Grupo Boticário’s Suggested Order 2.0, increasing recommendation adoption from 22% to 72%.",
      "Contributed to an estimated BRL 15M GMV stockout reduction by transforming transactional data into actionable monthly recommendations and opportunity signals.",
      "Extracted, cleaned, and consolidated 100M+ rows across multiple tables and domains using BigQuery, Python, and SQL, enabling reliable analytics and decision-making.",
      "Performed model experimentation, training, validation, and evaluation in Python, applying metrics such as precision, recall, F1-score, and backtesting before delivery.",
      "Developed LLM + RAG solutions to optimize internal processes and support decision-making through information retrieval and synthesis.",
      "Modeled Knowledge Graphs in Neo4j/Cypher from unstructured sources and enabled Text2Cypher and GraphRAG workflows for consultant allocation decisions.",
      "Worked on multi-agent systems to automate proposal generation workflows, reducing rework and improving team efficiency.",
      "Improved an AI pipeline focused on PowerPoint translation, increasing translation consistency while preserving formatting and structure."
    ],
    type: "work"
  },
  {
    title: "Chemical Engineering & Data Science Intern",
    company: "CSN Mineração",
    location: "Congonhas, MG",
    period: "2023 - 2024",
    description: "Built analytics and automation solutions to improve operational visibility, streamline workflows, and support data-driven decision-making in mining operations.",
    highlights: [
      "Designed and implemented ETL pipelines in Python and Power BI (Power Query/M), delivering analytical insights that optimized mining operations.",
      "Conducted exploratory data analysis and quantitative investigations to identify process bottlenecks and improvement opportunities.",
      "Worked directly with stakeholders to present projects, analyses, results, and recommendations.",
      "Led a Lean Six Sigma Yellow Belt digital transformation initiative using DMAIC and root cause analysis, accelerating dashboard adoption and strengthening a data-driven culture.",
      "Built a ticket management application in Power Apps integrated with Power Automate, improving workflow efficiency and strengthening data governance.",
      "Achieved 3rd place overall (Kaizen category) in an internal continuous improvement event with an RPA project that automated certificate issuance and approval, increasing end-to-end throughput by more than 10x.",
      "Processed large heterogeneous datasets to support a predictive model for tailings filtration rate, addressing a critical operational bottleneck in the mining process."
    ],
    type: "work"
  },
  {
    title: "B.Sc. in Chemical Engineering",
    company: "Federal University of São João del Rei (UFSJ)",
    location: "Ouro Branco, MG",
    period: "2020 - 2024",
    description: "",
    highlights: [
      "Final thesis scored 95/100: Physics-Informed Neural Networks (PINNs) as an alternative to classical computational simulation methods.",
      "Conducted undergraduate research on a hybrid Python-based solution combining machine learning and optimization for Gibbs free energy minimization.",
      "Worked as a Python developer and mentor on academic projects, including tutoring, workshops, and support for programming adoption.",
      "Developed strong foundations in quantitative methods, statistics, process analysis, and scientific modeling.",
      "Graduated with a GPA of 8.12/10."
    ],
    type: "education"
  }
];

export const blogPosts = [
  {
    id: "1",
    title: "Building Production-Ready ML Pipelines: Lessons Learned",
    excerpt: "Key insights from deploying dozens of ML models to production, covering common pitfalls and best practices for reliable ML systems.",
    date: "2024-01-15",
    readingTime: "8 min read",
    tags: ["MLOps", "Production ML", "Best Practices"],
    slug: "production-ml-pipelines",
    content: `# Building Production-Ready ML Pipelines

After deploying dozens of ML models to production, I've learned that the model is often the easy part. Here are my key lessons.

## 1. Data Quality is Everything

Your model is only as good as your data. Before training:

\`\`\`python
def validate_data(df):
    # Check for missing values
    assert df.isnull().sum().sum() == 0, "Missing values found"

    # Check for duplicates
    assert df.duplicated().sum() == 0, "Duplicates found"

    # Validate ranges
    assert df['age'].between(0, 120).all(), "Invalid age values"
\`\`\`

## 2. Monitor Everything

Once deployed, track:
- Input data drift
- Prediction distribution
- Model performance metrics
- Latency and throughput

## 3. Plan for Failure

ML systems fail in subtle ways. Always have:
- Fallback predictions
- Alerting on anomalies
- Easy rollback mechanisms`
  }
];

export const currentlyExploring = [
  "LLMs & Prompt Engineering",
  "RAG Systems",
  "MLOps at Scale",
  "Causal Inference",
  "Graph Neural Networks",
  "Time Series Transformers",
  "Vector Databases",
  "Model Optimization"
];

export const projectTags = [
  "NLP",
  "Classification",
  "Time Series",
  "Forecasting",
  "Recommenders",
  "Deep Learning",
  "Explainable AI",
  "Production ML",
  "MLOps",
  "Streaming",
  "Anomaly Detection",
  "Statistics",
  "EDA",
  "Real-time",
  "Platform"
];
