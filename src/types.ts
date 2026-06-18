export interface CareerProfile {
  age: string;
  years: string;
  field: string;
  strengths: string;
  idea: string;
  target: string;
}

export interface ProposalDraft {
  businessName: string;
  summary: string;
  founderStrengths: string;
  productService: string;
  targetCustomers: string;
  uniqueValueProposition: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  rationale: string;
  suggestedOptions: string[];
}

export interface InterviewAnswer {
  id: number;
  question: string;
  answer: string;
}

export interface RadarMetric {
  subject: string;
  value: number;
  description: string;
}

export interface MarketEvaluation {
  generalScore: number;
  radarMetrics: RadarMetric[];
  radarFeedback: string;
}

export interface CostItem {
  category: string;
  amount: number; // in 만원 (10,000 KRW)
  description: string;
}

export interface CostProjection {
  totalCostExcludingCapital: number;
  items: CostItem[];
  costFeedback: string;
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  howToBeat: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  threatAssessment: string;
}

export interface RoadmapStage {
  phase: string;
  title: string;
  timeline: string;
  coreGoal: string;
  indicator: string;
}

export interface SuccessStory {
  companyName: string;
  founderName: string;
  ageAtLaunch: string;
  field: string;
  summary: string;
  keySuccessFactor: string;
  sourceUrl?: string;
}

export interface FirstReport {
  title: string;
  executiveSummary: string;
  marketEvaluation: MarketEvaluation;
  costProjection: CostProjection;
  competitorAnalysis: CompetitorAnalysis;
  roadmap: RoadmapStage[];
  financialStrategy: string;
  riskAssessment: string;
  successStories?: SuccessStory[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
