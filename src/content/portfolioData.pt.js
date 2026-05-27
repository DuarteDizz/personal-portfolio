// ============================================
// PORTFOLIO CONTENT (PT-BR) - SINGLE SOURCE OF TRUTH
// ============================================

export const brand = {
  navbarIconLight: `${import.meta.env.BASE_URL}portfolio-logo-dark.png`,
  navbarIconDark: `${import.meta.env.BASE_URL}portfolio-logo-light.png`,
  favicon: `${import.meta.env.BASE_URL}portfolio-logo-dark.png`,
  logoText: "D",
};

export const profile = {
  name: "Diego Duarte",
  title: "Cientista de Dados Aplicado",
  tagline: "Construindo soluções e produtos de Dados e IA para que o futuro caiba no presente.",
  photoUrl: "https://i.imgur.com/CE4b10B.png",
  email: "duartediego.ds@gmail.com",
  location: "Belo Horizonte, MG",
  resumeUrl: "https://drive.google.com/uc?export=download&id=1i9wFEUe790MXcALV9XRv94qW98AmVqrC",
  status: "Aberto a oportunidades",
  bio:
    "Sou um Cientista de Dados com ~3 anos de experiência desenvolvendo produtos de Dados e IA ponta a ponta, da ingestão e tratamento de dados à modelagem, validação e entrega de impacto para o negócio, conectando Python, SQL, Machine Learning e IA Generativa (LLMs, RAG e agentes/sistemas multiagentes).",
  social: {
    github: "https://github.com/DuarteDizz",
    linkedin: "https://www.linkedin.com/in/diegohslduarte/",
    kaggle: "https://kaggle.com"
  }
};

export const hero = {
  terminal: {
    title: "diego@portfolio.py",
    codeLineTemplate: "print(\"Olá, mundo! Meu nome é {{name}}.\")",
    typingSpeedMs: 50
  },
  ctas: [
    { label: "Ver Projetos", page: "Projects", variant: "primary" },
    { label: "Baixar Currículo", url: profile.resumeUrl, variant: "secondary", external: true }
  ],
  signature: {
    beforeLocation: "Baseado em",
    afterLocation: "Disponível para vagas em",
    roles: "Dados / Analytics / IA",
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
    description: "Linguagem central para análise de dados, machine learning, automação e aplicações orientadas a backend.",
    highlights: ["Pandas", "NumPy", "SciPy", "BeautifulSoup"],
    relatedProjectIds: ["customer-churn", "demand-forecasting"]
  },
  {
    name: "SQL",
    category: "Programming",
    level: "Advanced",
    icon: "database",
    description: "Linguagem de consulta para extração, transformação, análise de dados e operações em bancos relacionais.",
    highlights: ["Consultas Complexas", "Joins & CTEs", "PostgreSQL", "BigQuery"],
    relatedProjectIds: []
  },
  {
    name: "Cypher",
    category: "Programming",
    level: "Intermediate",
    icon: "code",
    description: "Linguagem de consulta para bancos de dados em grafos, focada em percorrer e analisar relações em dados conectados.",
    highlights: ["Neo4j", "Pattern Matching", "Consultas em Grafos"],
    relatedProjectIds: []
  },

  {
    name: "PostgreSQL",
    category: "Databases",
    level: "Advanced",
    icon: "database",
    description: "Banco de dados relacional para armazenar, gerenciar e consultar dados estruturados com eficiência.",
    highlights: ["Modelagem Relacional", "Otimização de Consultas", "Índices"],
    relatedProjectIds: []
  },
  {
    name: "Neo4j",
    category: "Databases",
    level: "Intermediate",
    icon: "zap",
    description: "Banco de dados em grafos para modelar, consultar e analisar dados altamente conectados e relações complexas.",
    highlights: ["Cypher", "Knowledge Graphs", "GraphRAG", "Text2Cypher"],
    relatedProjectIds: []
  },

  {
    name: "Scikit-learn",
    category: "Machine Learning",
    level: "Advanced",
    icon: "brain",
    description: "Biblioteca de machine learning para construir, treinar e avaliar modelos preditivos clássicos.",
    highlights: ["Regressão", "Classificação", "Clustering", "Redução de Dimensionalidade"],
    relatedProjectIds: []
  },
  {
    name: "XGBoost",
    category: "Machine Learning",
    level: "Advanced",
    icon: "brain",
    description: "Framework de gradient boosting projetado para modelagem preditiva de alta performance em dados tabulares.",
    highlights: ["Boosting", "Otimização de Hiperparâmetros", "Importância de Features"],
    relatedProjectIds: []
  },

  {
    name: "TensorFlow",
    category: "Deep Learning",
    level: "Advanced",
    icon: "brain",
    description: "Framework de deep learning para construir, treinar e implantar modelos de redes neurais.",
    highlights: ["Keras API", "ANNs", "Treinamento de Modelos", "Model Serving"],
    relatedProjectIds: []
  },
  {
    name: "Physics-informed Neural Networks",
    category: "Deep Learning",
    level: "Intermediate",
    icon: "brain",
    description: "Redes neurais que incorporam leis físicas e restrições diferenciais ao processo de aprendizado.",
    highlights: ["Scientific ML", "Equações Diferenciais", "Restrições Físicas"],
    relatedProjectIds: []
  },

  {
    name: "Large Language Models (LLMs)",
    category: "Generative AI",
    level: "Advanced",
    icon: "sparkles",
    description: "Modelos fundacionais usados para geração de texto, raciocínio, respostas a perguntas e aplicações baseadas em linguagem.",
    highlights: ["Prompt Engineering", "LangChain", "Transformers", "Strands"],
    relatedProjectIds: ["news-topic-modeling"]
  },
  {
    name: "Retrieval Augmented Generation (RAG)",
    category: "Generative AI",
    level: "Advanced",
    icon: "sparkles",
    description: "Arquitetura que aprimora as respostas de LLMs ao recuperar contexto externo relevante antes da geração.",
    highlights: ["Recuperação de Contexto", "Busca Vetorial", "GraphRAG"],
    relatedProjectIds: []
  },
  {
    name: "Agentic AI",
    category: "Generative AI",
    level: "Intermediate",
    icon: "sparkles",
    description: "Sistemas de IA projetados para planejar, raciocinar e executar tarefas de forma autônoma por meio de uso de ferramentas e orquestração.",
    highlights: ["AI Agents", "Sistemas Multiagentes", "Strands"],
    relatedProjectIds: []
  },

  {
    name: "Power BI",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "bar-chart",
    description: "Plataforma de business intelligence para construir dashboards, relatórios interativos e insights orientados por dados.",
    highlights: ["DAX", "Power Query", "Modelagem de Dados"],
    relatedProjectIds: []
  },
  {
    name: "Plotly",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "line-chart",
    description: "Biblioteca de visualização interativa para dashboards, análise exploratória e gráficos dinâmicos.",
    highlights: ["Gráficos Interativos", "Plotly Express", "Dash"],
    relatedProjectIds: []
  },
  {
    name: "Streamlit",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "layout",
    description: "Framework para criar rapidamente aplicações interativas de dados, protótipos e demos de ML em Python.",
    highlights: ["Data Apps", "Componentes Customizados", "Caching"],
    relatedProjectIds: ["news-topic-modeling"]
  },
  {
    name: "Matplotlib",
    category: "Visualization & BI",
    level: "Advanced",
    icon: "bar-chart",
    description: "Biblioteca Python para criar gráficos estáticos altamente customizáveis e visualizações analíticas.",
    highlights: ["Gráficos Customizados", "Subplots", "Gráficos com Qualidade de Publicação"],
    relatedProjectIds: []
  },

  {
    name: "Docker",
    category: "Cloud & MLOps",
    level: "Advanced",
    icon: "box",
    description: "Plataforma de containerização para construir ambientes reproduzíveis de desenvolvimento, analytics e machine learning.",
    highlights: ["Docker Compose", "Builds Multi-stage", "Reprodutibilidade de Ambientes"],
    relatedProjectIds: ["customer-churn"]
  }
];

export const aboutBlocks = [
  {
    title: "Visão Geral",
    icon: "user",
    bullets: [
      "~3 anos construindo produtos e soluções de Dados e IA",
      "Conectando ingestão de dados, análise, modelagem e validação",
      "Apaixonado por usar tecnologia para transformar negócios e a vida das pessoas"
    ]
  },
  {
    title: "O que eu faço",
    icon: "briefcase",
    bullets: [
      "Transformo dados complexos em insights úteis",
      "Construo sistemas inteligentes para apoiar a tomada de decisão e a transformação digital",
      "Uso aplicações baseadas em IA para resolver problemas complexos e gerar inovação de negócio",
      "Implemento soluções seguindo boas práticas de Data Science"
    ]
  },
  {
    title: "Como eu trabalho",
    icon: "settings",
    bullets: [
      "Tomada de decisão orientada por dados",
      "Abordagem colaborativa com times multidisciplinares",
      "Foco em impacto de negócio, não apenas em métricas de acurácia",
      "Aprendizado contínuo e compartilhamento de conhecimento",
      "Mentalidade centrada em inovação"
    ]
  },
  {
    title: "Valores & Princípios",
    icon: "heart",
    bullets: [
      "Do macro ao micro",
      "Reprodutibilidade e documentação",
      "IA ética e uso responsável de dados",
      "Melhoria contínua e iteração",
      "Ensinar e mentorar outras pessoas"
    ]
  }
];

export const projects = [
  {
  id: "movie-knowledge-graph-explorer",
  title: "Explorador de Knowledge Graph de Filmes com IA",
  shortDescription: "Aplicação de IA ponta a ponta que permite aos usuários consultar um Knowledge Graph de filmes em linguagem natural, convertendo perguntas em queries Cypher seguras e validadas no Neo4j.",
  impactStatement: "Desenvolvi uma aplicação de dados com IA orientada a uso real, combinando orquestração de LLMs, banco de dados em grafo e uma interface intuitiva para viabilizar exploração de dados e recomendações de forma acessível e confiável.",
  problem: "A exploração de bases de dados de filmes e entretenimento normalmente exige conhecimento técnico sobre linguagens de consulta e sobre a estrutura do banco, o que cria fricção para usuários não técnicos. O objetivo foi construir uma aplicação acessível, capaz de traduzir perguntas em linguagem natural em consultas confiáveis em grafo, preservando segurança, transparência e controle sobre o acesso ao banco de dados.",
  approach: "Foi construída uma solução ponta a ponta que realiza o tratamento e a estruturação dos metadados brutos de filmes em um Knowledge Graph no Neo4j, modelando títulos, pessoas, gêneros e vínculos de relacionamento. Também foi implementado um fluxo multiestágio orientado por LLM para interpretar a intenção do usuário, gerar Cypher, validar as queries antes da execução e retornar respostas legíveis. Toda a experiência foi disponibilizada em uma aplicação Streamlit com setup em Docker e configuração baseada em variáveis de ambiente, garantindo reprodutibilidade e facilidade de manutenção.",
  results: "O projeto resultou em uma aplicação de portfólio totalmente funcional, demonstrando na prática competências em engenharia de IA, modelagem de dados em grafo e construção de produtos de dados. A solução indexa 5.239 títulos tratados, processa 76.531 registros de créditos, representa 53.604 pessoas únicas e suporta fluxos de descoberta e recomendação em linguagem natural por meio de um pipeline seguro de Text2Cypher.",
  metrics: [
    { label: "Títulos Indexados", value: "5.2K" },
    { label: "Registros de Créditos Processados", value: "76.5K" },
    { label: "Pessoas Únicas", value: "53.6K" },
    { label: "Gêneros Modelados", value: "19" }
  ],
  techStack: ["Python", "Neo4j", "Strands", "LangChain", "Text2Cypher", "Streamlit", "Pandas", "Docker"],
  tags: ["Aplicações com LLM", "Grafos de Conhecimento", "Engenharia de IA", "Produtos de Dados"],
  links: {
    github: "https://github.com/DuarteDizz/movie-kg-explorer",
    blog: ""
  },
  images: [
    "https://i.ibb.co/8gjZ35kS/imagem-2026-03-04-032632150.png",
    "https://i.ibb.co/ksvfwqzp/imagem-2026-03-04-032110513.png"
  ],
  whatIdImprove: [
  "Expandir o suporte para múltiplos provedores e modelos de LLM, incluindo alternativas open source, ampliando a flexibilidade da arquitetura e reduzindo a dependência de fornecedor.",
  "Aprimorar a busca por similaridade e a qualidade das recomendações com o uso de embeddings gerados a partir das descrições dos conteúdos.",
  "Elevar a transparência da experiência com streaming das respostas e exposição de etapas intermediárias do processamento de forma clara para o usuário.",
  "Evoluir a interface para um modelo centrado em chat, tornando a interação mais natural, fluida e alinhada ao padrão esperado em aplicações conversacionais.",
  "Ampliar a cobertura de testes automatizados para reforçar confiabilidade, manutenibilidade e segurança nas próximas evoluções da solução."
  ],
  reproducibility: "Para reproduzir o projeto, basta clonar o repositório, configurar as variáveis de ambiente com base no arquivo .env.example, conectar as credenciais da OpenAI e do Neo4j, e executar `docker compose up -d --build`. O projeto também pode ser executado localmente para desenvolvimento e testes.",
  featured: true,
  caseStudy: false
  },

  {
  id: "ockham-ml-experimentation-workbench",
  title: "Ockham - Workbench de Experimentação e Ranking de Modelos em ML",
  shortDescription:
    "Aplicação full-stack em React + FastAPI que conduz projetos de Machine Learning tabular do dataset bruto à recomendação defensável de modelo, combinando preprocessing assistido por agentes de IA, experimentação e otimização de hiperparâmetros com Optuna, diagnósticos analíticos e ranking inteligente baseado em evidências.",

  impactStatement:
    "Desenvolvi um workbench local-first de engenharia de ML que transforma a escolha de modelos em um processo rastreável, comparável e tecnicamente justificável, superando leaderboards puramente métricos ao considerar desempenho, simplicidade, estabilidade, explicabilidade, escalabilidade e custo operacional.",
  
  problem:
    "Em projetos reais de machine learning, escolher o melhor modelo raramente significa escolher apenas o maior score. A decisão também envolve estabilidade, complexidade, tempo de treino, custo de inferência, eficiência no uso de variáveis, explicabilidade e aderência ao contexto operacional. Além disso, muitas falhas surgem antes da modelagem, em decisões pouco rastreáveis de tratamento de dados, encoding, imputação, datas, scaling, remoção de features e prevenção de vazamento. O Ockham foi criado para resolver esse problema: transformar um fluxo normalmente disperso em notebooks e scripts isolados em uma experiência de produto clara, auditável e orientada à melhor decisão técnica.",
  
  approach:
    "Construí uma plataforma ponta a ponta com frontend em React, Vite e Tailwind CSS, e backend em FastAPI estruturado por domínios como datasets, preprocessing, modelagem, experimentos, ranking, persistência e provedores de IA. A aplicação permite carregar datasets CSV, inspecionar metadados, gerar profiling determinístico por coluna e construir planos de preprocessing com apoio de agentes especialistas. Esses planos podem ser revisados, editados, validados, pré-visualizados, materializados como novos datasets ou acoplados diretamente aos experimentos. Na etapa de modelagem, o backend executa busca de hiperparâmetros com Optuna e validação cruzada, encapsulando preprocessing e modelo em pipelines scikit-learn para evitar vazamento de dados. Ao final, o usuário compara os resultados por duas lentes complementares: o Score Ranking, orientado à métrica primária, e o Ockham Ranking, orientado à escolha mais defensável a partir de um conjunto estruturado de evidências. A camada de IA, com suporte a Ollama, OpenAI e provedores OpenAI-compatible, atua como apoio à decisão sem ocultar os critérios técnicos utilizados.",

  results:
    "O resultado foi um produto funcional de experimentação em ML tabular, com suporte a classificação e regressão, 17 modelos implementados, pré-processamento assistido por agentes de IA, planos persistidos e editáveis, materialização de datasets transformados, execução paralelizada de modelos, configuração runtime de provedores de LLM, ranking por score, ranking Ockham e painéis diagnósticos para análise comparativa dos resultados. Como projeto de portfólio, o Ockham demonstra domínio de engenharia de ML, integração pragmática de IA, arquitetura modular, preocupação com reprodutibilidade e foco em uma pergunta mais relevante que simplesmente 'qual modelo performou melhor?': Qual modelo é a escolha mais defensável para este problema?",

  metrics: [
    { label: "Modelos Implementados", value: "17" },
    { label: "Tipos de Problema", value: "Classificação e Regressão" },
    { label: "Camadas de Decisão", value: "Score Ranking + Ockham Ranking" },
    { label: "Stack da Aplicação", value: "React + FastAPI" }
  ],

  techStack: [
    "Python",
    "FastAPI",
    "React",
    "Optuna",
    "Scikit Learn",
    "SQLite",
    "LangChain",
    "Strands Agents",
    "Ollama",
    "Docker"
  ],

  tags: [
    "Engenharia de ML",
    "MLOps",
    "LLMs",
    "Avaliação de Modelos",
    "Agentes de IA"
  ],

  links: {
    github: "https://github.com/DuarteDizz/ockham",
    blog: ""
  },

  images: [
    "https://i.ibb.co/dsZ7KXdj/hero-dashboard.png",
    "https://i.ibb.co/GvsC4c4p/diagnostics-panel.png",
    "https://i.ibb.co/wNv4HR8F/experiment-setup.png"
  ],

  whatIdImprove: [
    "Implementar o 'Ockham Lab', um ambiente assistido por IA capaz de recomendar estratégias de modelagem com base nas características do dataset e incorporar novas funcionalidades analíticas ao longo do tempo.",
    "Criar uma camada de recomendação de modelos baseado em características do dataset.",
    "Adicionar camada de IA Explicável (XAI) ao relatório final com SHAP e LIME.",
    "Criar funcionalidade de exportação de modelos utilizando padrão ONNX.",
    "Ampliar o catálogo de capacidades de machine learning, incluindo clustering, séries temporais, seleção automática de features e comparação entre pipelines completos.",
    "Evoluir a persistência local baseada em SQLite e filesystem para uma arquitetura mais robusta com Postgres.",
    "Suportar formatos adicionais de entrada e fluxos de ingestão mais avançados além de arquivos CSV."
  ],

  reproducibility:
     "Clone o repositório, crie o arquivo de ambiente a partir do .env.example, revise as variáveis do backend, frontend e provedores de LLM e execute `docker compose up -d --build` para subir a stack completa com frontend, backend, Ollama e persistência local. Para desenvolvimento local, o backend pode ser iniciado com `uv sync` seguido de `uv run fastapi dev main.py`, enquanto o frontend pode ser executado com `npm install` e `npm run dev`.",
  featured: true,
  caseStudy: false
  }
];

export const experience = [
  {
    title: "Cientista de Dados",
    company: "Peers Consulting + Technology",
    location: "Belo Horizonte, MG",
    period: "2024 - 2026",
    description: "Desenvolvi soluções ponta a ponta de Dados e IA como parte do time de Data & AI, combinando processamento de dados em larga escala, experimentação, modelagem e entrega de valor para clientes enterprise.",
    highlights: [
      "Desenvolvi e evoluí um sistema híbrido de recomendação (grafos + métodos estatísticos avançados) para o Suggested Order 2.0 do Grupo Boticário, aumentando a adoção das recomendações de 22% para 72%.",
      "Contribuí para uma redução estimada de R$ 15 milhões em GMV perdido por ruptura de estoque, transformando dados transacionais em recomendações mensais acionáveis e sinais de oportunidade.",
      "Extraí, limpei e consolidei mais de 100 milhões de linhas em múltiplas tabelas e domínios usando BigQuery, Python e SQL, viabilizando análises confiáveis e melhor tomada de decisão.",
      "Realizei experimentação, treinamento, validação e avaliação de modelos em Python, aplicando métricas como precisão, recall, F1-score e backtesting antes da entrega.",
      "Desenvolvi soluções com LLM + RAG para otimizar processos internos e apoiar a tomada de decisão por meio de recuperação e síntese de informações.",
      "Modelei Knowledge Graphs em Neo4j/Cypher a partir de fontes não estruturadas e habilitei workflows de Text2Cypher e GraphRAG para decisões de alocação de consultores.",
      "Trabalhei em sistemas multiagentes para automatizar fluxos de geração de propostas, reduzindo retrabalho e melhorando a eficiência do time.",
      "Aprimorei um pipeline de IA focado em tradução de apresentações em PowerPoint, aumentando a consistência da tradução e preservando formatação e estrutura."
    ],
    type: "work"
  },
  {
    title: "Estagiário em Engenharia Química & Data Science",
    company: "CSN Mineração",
    location: "Congonhas, MG",
    period: "2023 - 2024",
    description: "Desenvolvi soluções de analytics e automação para melhorar a visibilidade operacional, otimizar fluxos de trabalho e apoiar a tomada de decisão orientada por dados nas operações de mineração.",
    highlights: [
      "Desenhei e implementei pipelines de ETL em Python e Power BI (Power Query/M), entregando insights analíticos que otimizaram operações de mineração.",
      "Conduzi análises exploratórias de dados e investigações quantitativas para identificar gargalos de processo e oportunidades de melhoria.",
      "Atuei diretamente com stakeholders para apresentar projetos, análises, resultados e recomendações.",
      "Liderei uma iniciativa de transformação digital com Lean Six Sigma Yellow Belt usando DMAIC e análise de causa raiz, acelerando a adoção de dashboards e fortalecendo uma cultura orientada por dados.",
      "Desenvolvi uma aplicação de gestão de chamados em Power Apps integrada ao Power Automate, melhorando a eficiência do fluxo e fortalecendo a governança de dados.",
      "Conquistei o 3º lugar geral (categoria Kaizen) em um evento interno de melhoria contínua com um projeto de RPA que automatizou a emissão e aprovação de certificados, aumentando a vazão ponta a ponta em mais de 10x.",
      "Processei grandes volumes de dados heterogêneos para apoiar um modelo preditivo da taxa de filtragem de rejeitos, atacando um gargalo operacional crítico no processo de mineração."
    ],
    type: "work"
  },
  {
    title: "Bacharel em Engenharia Química",
    company: "Universidade Federal de São João del Rei (UFSJ)",
    location: "Ouro Branco, MG",
    period: "2020 - 2024",
    description: "",
    highlights: [
      "TCC com nota 95/100: Redes Neurais Informadas pela Física (PINNs) como alternativa a métodos clássicos de simulação computacional.",
      "Conduzi iniciação científica em uma solução híbrida em Python combinando machine learning e otimização para minimização da energia livre de Gibbs.",
      "Atuei como desenvolvedor e mentor em Python em projetos acadêmicos, incluindo monitorias, workshops e apoio à adoção de programação.",
      "Desenvolvi uma base forte em métodos quantitativos, estatística, análise de processos e modelagem científica.",
      "Concluí a graduação com GPA de 8,12/10."
    ],
    type: "education"
  }
];

export const blogPosts = [
  {
    id: "1",
    title: "Construindo pipelines de ML prontos para produção: lições aprendidas",
    excerpt: "Principais insights de implantar dezenas de modelos de ML em produção, cobrindo armadilhas comuns e boas práticas para sistemas de ML confiáveis.",
    date: "2024-01-15",
    readingTime: "8 min de leitura",
    tags: ["MLOps", "Production ML", "Boas Práticas"],
    slug: "production-ml-pipelines",
    content: `# Construindo pipelines de ML prontos para produção

Depois de implantar dezenas de modelos de ML em produção, aprendi que o modelo muitas vezes é a parte mais fácil. Aqui estão minhas principais lições.

## 1. Qualidade dos dados é tudo

Seu modelo é tão bom quanto os seus dados. Antes de treinar:

\`\`\`python
def validate_data(df):
    # Verifica valores ausentes
    assert df.isnull().sum().sum() == 0, "Valores ausentes encontrados"

    # Verifica duplicados
    assert df.duplicated().sum() == 0, "Duplicados encontrados"

    # Valida intervalos
    assert df['age'].between(0, 120).all(), "Valores de idade inválidos"
\`\`\`

## 2. Monitore tudo

Depois do deploy, acompanhe:
- Drift dos dados de entrada
- Distribuição das predições
- Métricas de performance do modelo
- Latência e throughput

## 3. Planeje para falhas

Sistemas de ML falham de formas sutis. Sempre tenha:
- Predições de fallback
- Alertas para anomalias
- Mecanismos simples de rollback`
  }
];

export const currentlyExploring = [
  "LLMs & Prompt Engineering",
  "Sistemas RAG",
  "MLOps em Escala",
  "Inferência Causal",
  "Redes Neurais em Grafos",
  "Transformers para Séries Temporais",
  "Bancos de Dados Vetoriais",
  "Otimização de Modelos"
];

export const projectTags = [
  "NLP",
  "Classification",
  "Time Series",
  "Forecasting",
  "Recommenders",
  "Deep Learning",
  "IA Explicável",
  "Production ML",
  "MLOps",
  "Streaming",
  "Anomaly Detection",
  "Statistics",
  "EDA",
  "Real-time",
  "Platform"
];
