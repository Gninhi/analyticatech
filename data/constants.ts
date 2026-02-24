
import { Database, BarChart3, Workflow, Search, Activity } from '../lib/icons';
import { NavItem, Service, Solution, Testimonial, Resource, TeamMember, Milestone, CoreValue, TickerMetric, FeaturedCase } from '../types/index';

export const NAV_ITEMS: NavItem[] = [
  { label: { fr: 'Accueil', en: 'Home' }, path: '/', id: '00' },
  { label: { fr: 'Services', en: 'Services' }, path: '/services', id: '01' },
  { label: { fr: 'Solutions', en: 'Solutions' }, path: '/solutions', id: '02' },
  { label: { fr: 'Hub', en: 'Hub' }, path: '/hub', id: '03' },
  { label: { fr: 'Agence', en: 'Agency' }, path: '/about', id: '04' },
  { label: { fr: 'Contact', en: 'Contact' }, path: '/contact', id: '05' },
];

export const FEATURED_CASES: FeaturedCase[] = [
  {
    id: '1',
    sector: { fr: "Finance & Audit", en: "Finance & Audit" },
    iconName: "Briefcase",
    title: { fr: "Due Diligence Automatisée", en: "Automated Due Diligence" },
    description: { fr: "Analyse de 5000+ documents légaux par minute pour identifier les risques.", en: "Analyzing 5000+ legal documents per minute to identify merger risks." },
    result: { fr: "Audit x10 plus rapide", en: "Audit time divided by 10" },
    tags: ["NLP", "Llama 3", "OCR"]
  },
  {
    id: '2',
    sector: { fr: "Industrie 4.0", en: "Industry 4.0" },
    iconName: "Factory",
    title: { fr: "Maintenance Prédictive", en: "Predictive Maintenance" },
    description: { fr: "Modèles ML pour anticiper les pannes machines avant l'arrêt.", en: "ML models to anticipate machine failures before they occur." },
    result: { fr: "-25% de temps d'arrêt", en: "-25% downtime" },
    tags: ["IoT", "Python", "Grafana"]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'business-intelligence',
    title: { fr: 'Augmented Decision Systems', en: 'Augmented Decision Systems' },
    shortDescription: { 
      fr: 'Transformation de vos données brutes en systèmes de pilotage prédictifs.', 
      en: 'Transforming raw data into predictive steering systems.' 
    },
    fullDescription: { 
      fr: "Nous construisons l'architecture décisionnelle qui anticipe vos besoins. Nous transformons votre historique en un moteur de prospective.", 
      en: "We build the decision-making architecture that anticipates your needs. We transform your history into a foresight engine." 
    },
    marketImpact: { 
      fr: "Dans un marché instable, la vitesse de décision est le seul avantage concurrentiel durable.", 
      en: "In an unstable market, decision speed is the only sustainable competitive advantage." 
    },
    roiTimeline: { fr: "ROI en 6 mois moyen.", en: "Average 6-month ROI." },
    technicalComplexity: 'Advanced',
    icon: BarChart3,
    tags: ['Predictive Analytics', 'PowerBI', 'Snowflake', 'Data Modeling'],
    process: [
      { step: { fr: '01. Audit', en: '01. Audit' }, desc: { fr: 'Nettoyage des sources.', en: 'Data cleaning.' } },
      { step: { fr: '02. Engineering', en: '02. Engineering' }, desc: { fr: 'Structuration Cloud.', en: 'Cloud structuring.' } }
    ],
    benefits: [{ fr: 'Accélération x10', en: 'x10 Acceleration' }, { fr: 'Zéro silo', en: 'Zero data silos' }]
  },
  {
    id: 'hyper-automatisation',
    title: { fr: 'Operational Orchestration', en: 'Operational Orchestration' },
    shortDescription: { 
      fr: 'Déploiement d\'agents IA autonomes pour vos processus critiques.', 
      en: 'Deploying autonomous AI agents for your critical processes.' 
    },
    fullDescription: { 
      fr: "Nous déployons des agents cognitifs capables de comprendre et d'agir sur vos outils métier sans supervision humaine.", 
      en: "We deploy cognitive agents capable of understanding and acting on your business tools without human supervision." 
    },
    marketImpact: { 
      fr: "Le coût humain des tâches répétitives est le premier frein à la croissance.", 
      en: "The human cost of repetitive tasks is the primary bottleneck for growth." 
    },
    roiTimeline: { fr: "Réduction des coûts Ops immédiate.", en: "Immediate Ops cost reduction." },
    technicalComplexity: 'Critical',
    icon: Workflow,
    tags: ['Agentic AI', 'n8n', 'Python', 'LLM Orchestration'],
    process: [
      { step: { fr: '01. Mapping', en: '01. Mapping' }, desc: { fr: 'Audit des flux.', en: 'Flow audit.' } },
      { step: { fr: '02. IA Integration', en: '02. AI Integration' }, desc: { fr: 'Modèles de décision.', en: 'Decision models.' } }
    ],
    benefits: [{ fr: 'Disponibilité 24/7', en: '24/7 Availability' }, { fr: 'Zéro erreur', en: 'Zero-error processing' }]
  }
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'data-nexus',
    title: { fr: 'Data Nexus Hub', en: 'Data Nexus Hub' },
    subtitle: { fr: 'Intégration universelle', en: 'Universal Integration' },
    shortDescription: { fr: 'Unifiez vos sources de données en une source unique de vérité.', en: 'Unify your data sources into a single source of truth.' },
    fullDescription: { fr: 'Notre moteur propriétaire permet une synchronisation bidirectionnelle en temps réel.', en: 'Our proprietary engine enables real-time bidirectional synchronization.' },
    icon: Database,
    kpis: [{ label: { fr: 'Efficacité', en: 'Efficiency' }, value: '+45%' }],
    techStack: ['Node.js', 'PostgreSQL', 'Redis'],
    features: [{ title: { fr: 'Live Sync', en: 'Live Sync' }, description: { fr: 'Mise à jour instantanée.', en: 'Instant updates.' } }],
    useCases: [{ fr: 'E-commerce', en: 'E-commerce' }]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Directeur Général',
    role: { fr: 'Cabinet M&A', en: 'M&A Firm' },
    company: 'KNIPPER & PARTENAIRE',
    content: { 
      fr: "L'approche analytique d'Analyticatech a sécurisé nos dossiers complexes.", 
      en: "Analyticatech's analytical approach secured our most complex deals." 
    },
    avatar: 'https://picsum.photos/100/100?random=1'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Jean Rivière',
    role: { fr: 'Architecte Solution', en: 'Solution Architect' },
    spec: 'Cloud & Data Engineering',
    status: 'Online',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  }
];

export const MILESTONES: Milestone[] = [
  {
    id: '1',
    version: 'v1.0',
    year: '2021',
    title: { fr: 'Fondation', en: 'Foundation' },
    desc: { fr: 'Traitement de données non structurées.', en: 'Unstructured data processing.' }
  }
];

export const CORE_VALUES: CoreValue[] = [
  {
    id: '1',
    title: { fr: 'Transparence', en: 'Transparency' },
    desc: { fr: "Propriété intellectuelle client.", en: "Full client intellectual property." },
    icon: Search
  }
];

export const TICKER_METRICS: TickerMetric[] = [
  {
    id: '1',
    label: { fr: 'Requêtes API', en: 'API Requests' },
    baseValue: 8420.5,
    suffix: 'k',
    trend: '+12%',
    color: '#3b82f6',
    icon: Activity,
    graph: "M0 30 Q 20 25 40 30 T 100 15"
  }
];

export const RESOURCES: Resource[] = [
  {
    id: 'wp-sovereign-ai',
    type: 'whitepaper',
    title: { fr: 'IA Souveraine', en: 'Sovereign AI' },
    description: { fr: 'Déployer des LLMs sur infrastructure privée.', en: 'Deploying LLMs on private infrastructure.' },
    category: [{ fr: 'Stratégie', en: 'Strategy' }],
    date: '2024-03-10',
    author: 'Alexandre V.',
    readTime: { fr: '15 min', en: '15 min read' },
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=300',
    isPremium: true
  }
];
