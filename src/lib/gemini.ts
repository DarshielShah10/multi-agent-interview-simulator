import { 
  AgentId, 
  CandidateProfileData, 
  IndependentOpinion, 
  DebateTurn, 
  FinalConsensusReport 
} from '../types';
import { AGENT_PROFILES } from './agents';

export class GeminiPipelineService {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'gemini-2.0-flash') {
    this.apiKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    this.model = model;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  private async generateJSON<T>(prompt: string, systemInstruction: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody: any = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.6,
        topP: 0.95,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini');
    }
    return JSON.parse(rawText) as T;
  }

  // 1. Candidate Profile Fact Extractor
  public async extractProfileFacts(
    resumeText: string,
    transcriptText: string,
    candidateName: string,
    targetRole: string
  ): Promise<CandidateProfileData['extractedFacts']> {
    const systemInstruction = `You are a Candidate Fact Extraction Agent.
Your job is to read the resume and interview transcript and pull out objective facts and claims into structured lists:
- verifiedSkills: specific technical or leadership tools mentioned in depth
- claimedAchievements: major accomplishments claimed in resume or transcript
- workHistory: companies, years, roles
- directQuotes: 3-5 real, verbatim quotes from the transcript showing key assertions, edge-case explanations, or admissions.

Respond ONLY in valid JSON matching:
{
  "verifiedSkills": ["Skill 1", "Skill 2"],
  "claimedAchievements": ["Claim 1", "Claim 2"],
  "workHistory": ["Role 1", "Role 2"],
  "directQuotes": ["\"Quote 1\"", "\"Quote 2\""]
}`;

    const prompt = `CANDIDATE: ${candidateName}
TARGET ROLE: ${targetRole}

RESUME:
${resumeText}

TRANSCRIPT:
${transcriptText}`;

    return await this.generateJSON<CandidateProfileData['extractedFacts']>(prompt, systemInstruction);
  }

  // 2. Isolated Independent Evaluation for 1 Agent (No cross-agent leakage)
  public async evaluateIndependently(
    agentId: AgentId,
    profile: CandidateProfileData
  ): Promise<IndependentOpinion> {
    const agent = AGENT_PROFILES[agentId];

    const systemInstruction = `You are ${agent.name}, ${agent.roleTitle}.
Your domain is: ${agent.domain}.
Mission: ${agent.mission}

IMPORTANT RULE: You are evaluating this candidate INDEPENDENTLY on your own. You have NOT seen and CANNOT see what other interviewers think.
Every point in your assessment MUST cite a real, verbatim quote or direct fact from the transcript/resume.

Stance options: "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject"

Respond ONLY in valid JSON matching:
{
  "agentId": "${agentId}",
  "stance": "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject",
  "confidenceScore": 85, // number from 0 to 100
  "summary": "2-3 sentence overview of your independent verdict",
  "keyPoints": [
    {
      "point": "Your specific analytical point",
      "citedQuote": "\"Exact verbatim quote from the transcript or resume supporting this point\"",
      "sentiment": "positive" | "concerning" | "neutral"
    }
  ]
}`;

    const prompt = `CANDIDATE PROFILE:
Name: ${profile.candidateName}
Target Role: ${profile.targetRole} (${profile.experienceYears} years experience)

RESUME:
${profile.resumeText}

TRANSCRIPT:
${profile.transcriptText}

Provide your independent, evidence-backed evaluation.`;

    return await this.generateJSON<IndependentOpinion>(prompt, systemInstruction);
  }

  // 3. Multi-Turn Voice-Enabled Debate Step (Direct rebuttals & cross-agent responses)
  public async generateDebateSession(
    profile: CandidateProfileData,
    opinions: Record<AgentId, IndependentOpinion>
  ): Promise<DebateTurn[]> {
    const opinionsSummary = Object.entries(opinions).map(([id, op]) => {
      const agent = AGENT_PROFILES[id as AgentId];
      return `[${agent.name} (${agent.roleTitle})]: Initial Stance = ${op.stance} (Confidence: ${op.confidenceScore}%)
Summary: ${op.summary}
Evidence Cited: ${op.keyPoints.map(k => `${k.point} (Quote: ${k.citedQuote})`).join('; ')}`;
    }).join('\n\n');

    const systemInstruction = `You are orchestrating a live Hiring Committee Debate between 4 AI agents:
1. Dr. Marcus Vance ('technical') - Technical Specialist
2. Elena Rostova ('culture') - HR & Leadership Lead
3. David Sterling ('hiring_manager') - Hiring Manager / ROI & Delivery
4. Rachel Zane ('skeptic') - Contradiction & Red-Flag Auditor

CRITICAL RULE FOR THE DEBATE:
The agents must talk TO EACH OTHER.
- At least one agent MUST directly respond to or challenge another agent's point (e.g. Rachel challenging Marcus on unverified claims, or Marcus defending technical depth).
- At least one agent MUST adjust or evolve their opinion (responseType: 'opinion_shift' or 'agreement') based on the evidence presented by peers.
- Generate 4 realistic, sequential debate turns with direct quotes and arguments.

Respond ONLY in valid JSON matching:
{
  "turns": [
    {
      "id": "deb-1",
      "speakerId": "technical" | "culture" | "hiring_manager" | "skeptic",
      "targetAgentId": "technical" | "culture" | "hiring_manager" | "skeptic",
      "responseType": "challenge" | "agreement" | "clarification" | "opinion_shift",
      "speech": "What the agent says directly to their peer, referencing evidence",
      "revisedStance": "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject",
      "revisedConfidence": 90,
      "stanceShiftReason": "Optional short explanation if the agent changed their mind"
    }
  ]
}`;

    const prompt = `CANDIDATE: ${profile.candidateName} (${profile.targetRole})

INDEPENDENT AGENT OPINIONS PRIOR TO DEBATE:
${opinionsSummary}

Generate the 4-turn debate session.`;

    const res = await this.generateJSON<{ turns: DebateTurn[] }>(prompt, systemInstruction);
    return res.turns;
  }

  // 4. Final Reasoned Decision & Comprehensive Report (Non-simple averaging)
  public async generateFinalDecisionReport(
    profile: CandidateProfileData,
    opinions: Record<AgentId, IndependentOpinion>,
    debateTurns: DebateTurn[]
  ): Promise<FinalConsensusReport> {
    const formattedDebate = debateTurns.map(t => {
      const speaker = AGENT_PROFILES[t.speakerId]?.name;
      const target = t.targetAgentId ? AGENT_PROFILES[t.targetAgentId]?.name : 'Committee';
      return `[${speaker} -> ${target}] (${t.responseType}): ${t.speech}`;
    }).join('\n');

    const systemInstruction = `You are the Committee Synthesis Judge.
You must synthesize the candidate evaluation into a final comprehensive decision.

IMPORTANT RULE: DO NOT SIMPLY AVERAGE SCORES.
Weigh the evidence rigorously:
- If the Skeptic Agent uncovered major factual misrepresentations, that risk outweighs pure technical claims.
- If the candidate provided verifiable, deep edge-case engineering proofs and high culture accountability, weigh that heavily.
- Explicitly identify any UNRESOLVED DISAGREEMENTS between the agents (e.g., leveling disputes, risk tolerance differences).

Respond ONLY in valid JSON matching:
{
  "candidateName": "${profile.candidateName}",
  "targetRole": "${profile.targetRole}",
  "finalRecommendation": "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject",
  "overallConfidence": 92,
  "decisionRationale": "Multi-sentence reasoned explanation of how the decision was reached",
  "evidenceWeightingExplanation": "Detailed explanation of why evidence weighting was used instead of simple averaging",
  "dimensionScores": {
    "technicalCompetence": { "score": 9.2, "maxScore": 10, "weight": 0.35 },
    "culturalIntegrity": { "score": 9.4, "maxScore": 10, "weight": 0.25 },
    "businessImpactROI": { "score": 8.8, "maxScore": 10, "weight": 0.25 },
    "riskFactorInverse": { "score": 8.5, "maxScore": 10, "weight": 0.15 }
  },
  "keyStrengths": [
    { "title": "Strength Title", "detail": "Explanation", "supportingQuote": "\"Verbatim quote\"" }
  ],
  "criticalConcerns": [
    { "title": "Concern Title", "detail": "Explanation", "supportingQuote": "\"Verbatim quote\"", "severity": "low" | "medium" | "high" }
  ],
  "unresolvedDisagreements": [
    {
      "topic": "Topic of disagreement",
      "agentAPerspective": { "agentId": "technical", "point": "..." },
      "agentBPerspective": { "agentId": "hiring_manager", "point": "..." },
      "impactOnDecision": "How the committee resolved or balanced this trade-off"
    }
  ],
  "individualAgentFinalVotes": {
    "technical": { "initialStance": "Hire", "finalStance": "Strong Hire", "finalVerdict": "...", "changedMind": true },
    "culture": { "initialStance": "Strong Hire", "finalStance": "Strong Hire", "finalVerdict": "...", "changedMind": false },
    "hiring_manager": { "initialStance": "Hire", "finalStance": "Strong Hire", "finalVerdict": "...", "changedMind": true },
    "skeptic": { "initialStance": "Hire", "finalStance": "Hire", "finalVerdict": "...", "changedMind": false }
  }
}`;

    const opinionsOverview = Object.entries(opinions).map(([id, op]) => 
      `[${id}]: Initial=${op.stance}, Confidence=${op.confidenceScore}%, Summary=${op.summary}`
    ).join('\n');

    const prompt = `CANDIDATE: ${profile.candidateName} (${profile.targetRole})

INITIAL INDEPENDENT AGENT OPINIONS:
${opinionsOverview}

RESUME & TRANSCRIPT:
Resume: ${profile.resumeText}
Transcript: ${profile.transcriptText}

DEBATE TRANSCRIPT:
${formattedDebate}

Generate the final reasoned consensus report with evidence weighting and unresolved disagreements.`;

    return await this.generateJSON<FinalConsensusReport>(prompt, systemInstruction);
  }
}
