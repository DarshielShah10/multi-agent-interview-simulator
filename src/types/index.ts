export type InterviewerId = 'alex' | 'sarah' | 'devon';

export type InterviewerMood = 'neutral' | 'impressed' | 'skeptical' | 'probing' | 'satisfied';

export interface InterviewerProfile {
  id: InterviewerId;
  name: string;
  title: string;
  companyRole: string;
  avatarBg: string;
  accentColor: string;
  borderColor: string;
  primaryFocus: string;
  bio: string;
  speechPitch: number;
  speechRate: number;
}

export type MessageSpeaker = InterviewerId | 'candidate' | 'system';

export interface ChatMessage {
  id: string;
  speaker: MessageSpeaker;
  text: string;
  timestamp: string;
  interviewerId?: InterviewerId;
  questionTopic?: string;
  audioDuration?: number;
}

export type BackchannelFlag = 'weakness' | 'strength' | 'handoff' | 'probing' | 'observation';

export interface BackchannelNote {
  id: string;
  agentId: InterviewerId;
  targetAgentId?: InterviewerId;
  timestamp: string;
  thought: string;
  flag: BackchannelFlag;
  triggerPhrase?: string;
}

export type HiringStance = 'Strong Hire' | 'Hire' | 'Leaning No Hire' | 'Reject';

export interface CommitteeTurn {
  id: string;
  agentId: InterviewerId;
  round: number;
  stance: HiringStance;
  speech: string;
  confidence: number;
  highlightCriterion: string;
}

export interface RubricDimension {
  name: string;
  score: number; // 1 to 10
  maxScore: number;
  feedback: string;
}

export interface CandidateEvaluation {
  candidateName: string;
  targetRole: string;
  overallScore: number; // 1-100
  hiringDecision: HiringStance;
  consensusSummary: string;
  dimensions: {
    systemDesign: RubricDimension;
    technicalDepth: RubricDimension;
    communicationSTAR: RubricDimension;
    pragmatismEdgeCases: RubricDimension;
  };
  keyStrengths: string[];
  growthAreas: string[];
  interviewerVotes: Record<InterviewerId, {
    stance: HiringStance;
    verdict: string;
  }>;
}

export interface InterviewConfig {
  candidateName: string;
  targetRole: string;
  jobLevel: 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Lead / Director';
  companyContext: string;
  useDemoMode: boolean;
  geminiApiKey: string;
}

export type InterviewPhase = 'setup' | 'interview' | 'committee' | 'scorecard';
