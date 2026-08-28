export type AgentId = 'technical' | 'culture' | 'hiring_manager' | 'skeptic';

export type HiringStance = 'Strong Hire' | 'Hire' | 'Leaning No Hire' | 'Reject';

export interface AgentProfile {
  id: AgentId;
  name: string;
  roleTitle: string;
  domain: string;
  avatarBg: string;
  accentColor: string;
  borderColor: string;
  speechPitch: number;
  speechRate: number;
  mission: string;
}

export interface CandidateProfileData {
  candidateName: string;
  targetRole: string;
  experienceYears: number;
  resumeText: string;
  transcriptText: string;
  extractedFacts: {
    verifiedSkills: string[];
    claimedAchievements: string[];
    workHistory: string[];
    directQuotes: string[];
  };
}

export interface IndependentOpinion {
  agentId: AgentId;
  stance: HiringStance;
  confidenceScore: number; // 0-100%
  summary: string;
  keyPoints: Array<{
    point: string;
    citedQuote: string;
    sentiment: 'positive' | 'concerning' | 'neutral';
  }>;
}

export type DebateResponseType = 'challenge' | 'agreement' | 'clarification' | 'opinion_shift';

export interface DebateTurn {
  id: string;
  speakerId: AgentId;
  targetAgentId?: AgentId;
  responseType: DebateResponseType;
  speech: string;
  revisedStance?: HiringStance;
  revisedConfidence?: number;
  stanceShiftReason?: string;
}

export interface UnresolvedDisagreement {
  topic: string;
  agentAPerspective: { agentId: AgentId; point: string };
  agentBPerspective: { agentId: AgentId; point: string };
  impactOnDecision: string;
}

export interface FinalConsensusReport {
  candidateName: string;
  targetRole: string;
  finalRecommendation: HiringStance;
  overallConfidence: number; // 0-100%
  decisionRationale: string;
  evidenceWeightingExplanation: string; // Explains why simple averaging was not used
  dimensionScores: {
    technicalCompetence: { score: number; maxScore: number; weight: number };
    culturalIntegrity: { score: number; maxScore: number; weight: number };
    businessImpactROI: { score: number; maxScore: number; weight: number };
    riskFactorInverse: { score: number; maxScore: number; weight: number };
  };
  keyStrengths: Array<{ title: string; detail: string; supportingQuote: string }>;
  criticalConcerns: Array<{ title: string; detail: string; supportingQuote: string; severity: 'low' | 'medium' | 'high' }>;
  unresolvedDisagreements: UnresolvedDisagreement[];
  individualAgentFinalVotes: Record<AgentId, {
    initialStance: HiringStance;
    finalStance: HiringStance;
    finalVerdict: string;
    changedMind: boolean;
  }>;
}

export type AppMode = 'pipeline' | 'live_panel';
export type PipelineStep = 'profile' | 'independent_review' | 'debate' | 'final_report';
