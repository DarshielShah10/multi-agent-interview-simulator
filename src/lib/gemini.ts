import { ChatMessage, InterviewerId, BackchannelNote, CommitteeTurn, CandidateEvaluation, InterviewConfig } from '../types';

interface AgentTurnResponse {
  nextSpeaker: InterviewerId;
  question: string;
  topic: string;
  backchannelNotes: BackchannelNote[];
}

export class GeminiOrchestrator {
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

  private async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody: any = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        responseMimeType: "application/json",
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini');
    }
    return rawText;
  }

  public async processCandidateResponse(
    history: ChatMessage[],
    lastCandidateAnswer: string,
    config: InterviewConfig
  ): Promise<AgentTurnResponse> {
    const formattedHistory = history.map(m => `[${m.speaker.toUpperCase()}]: ${m.text}`).join('\n');

    const systemPrompt = `You are orchestrating a Multi-Agent AI Interview Panel ("The Hot Seat") with 3 distinct interviewers:
1. Alex Chen ('alex') - Principal Systems Architect: Probes distributed scale, latency, consistency, trade-offs, and microservice architecture.
2. Sarah Lin ('sarah') - Director of Engineering: Probes leadership, STAR-format situational execution, ownership, and team empathy.
3. Devon Vance ('devon') - Staff SRE & Pragmatist: Catches buzzwords, hand-waving assertions, tests operational debugging and simplicity.

Candidate Details:
- Name: ${config.candidateName}
- Target Role: ${config.targetRole} (${config.jobLevel})
- Company Context: ${config.companyContext}

Analyze the candidate's last answer in parallel across all 3 agent perspectives. Generate:
1. Secret "Backchannel Notes" (whispers between the non-speaking agents noting weaknesses, strengths, or hand-offs).
2. Nominate the next speaker who should cross-examine or follow up based on candidate weak spots or logical leaps.
3. Formulate a sharp, context-aware question from the nominated speaker.

Respond ONLY in valid JSON matching this schema:
{
  "nextSpeaker": "alex" | "sarah" | "devon",
  "question": "The question to ask the candidate directly",
  "topic": "Short 2-4 word topic label",
  "backchannelNotes": [
    {
      "agentId": "alex" | "sarah" | "devon",
      "targetAgentId": "alex" | "sarah" | "devon",
      "thought": "Internal private agent assessment of the answer",
      "flag": "weakness" | "strength" | "handoff" | "probing" | "observation",
      "triggerPhrase": "specific phrase candidate said that triggered this thought"
    }
  ]
}`;

    const userPrompt = `INTERVIEW TRANSCRIPT SO FAR:
${formattedHistory}

CANDIDATE'S LATEST ANSWER:
"${lastCandidateAnswer}"

Generate the next turn with agent backchannel analysis and the next interviewer question.`;

    const rawJson = await this.generateContent(userPrompt, systemPrompt);
    const parsed = JSON.parse(rawJson);

    return {
      nextSpeaker: parsed.nextSpeaker || 'alex',
      question: parsed.question,
      topic: parsed.topic || 'System Design & Problem Solving',
      backchannelNotes: (parsed.backchannelNotes || []).map((n: any, idx: number) => ({
        id: `bn-live-${Date.now()}-${idx}`,
        agentId: n.agentId || 'alex',
        targetAgentId: n.targetAgentId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        thought: n.thought,
        flag: n.flag || 'observation',
        triggerPhrase: n.triggerPhrase
      }))
    };
  }

  public async conductCommitteeDebate(
    history: ChatMessage[],
    config: InterviewConfig
  ): Promise<{ debateTurns: CommitteeTurn[]; evaluation: CandidateEvaluation }> {
    const formattedHistory = history.map(m => `[${m.speaker.toUpperCase()}]: ${m.text}`).join('\n');

    const systemPrompt = `You are simulating an autonomous post-interview Hiring Committee debate between Alex Chen (Architect), Sarah Lin (Director of Eng), and Devon Vance (Staff Pragmatist).
They are deliberating the candidate's interview performance for the role: ${config.targetRole} (${config.jobLevel}).

The agents must:
1. Conduct a realistic 4-turn debate where each agent shares their vote (Strong Hire / Hire / Leaning No Hire / Reject), cites specific moments from the interview, challenges colleagues' assessments, and converges on a consensus verdict.
2. Produce a comprehensive rubric evaluation with 4 distinct dimension scores (1-10 scale), overall score (1-100), key strengths, and growth areas.

Respond ONLY with valid JSON with this exact structure:
{
  "debateTurns": [
    {
      "agentId": "alex" | "sarah" | "devon",
      "round": 1,
      "stance": "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject",
      "confidence": 85,
      "speech": "Detailed debate argument citing the transcript",
      "highlightCriterion": "Criterion name"
    }
  ],
  "evaluation": {
    "candidateName": "${config.candidateName}",
    "targetRole": "${config.targetRole}",
    "overallScore": 88,
    "hiringDecision": "Strong Hire" | "Hire" | "Leaning No Hire" | "Reject",
    "consensusSummary": "Detailed multi-sentence summary of the committee consensus",
    "dimensions": {
      "systemDesign": { "name": "Distributed Architecture & Scaling", "score": 8.5, "maxScore": 10, "feedback": "..." },
      "technicalDepth": { "name": "Technical Depth & Edge Cases", "score": 8.0, "maxScore": 10, "feedback": "..." },
      "communicationSTAR": { "name": "Communication & STAR Execution", "score": 9.0, "maxScore": 10, "feedback": "..." },
      "pragmatismEdgeCases": { "name": "Operational Pragmatism & SRE", "score": 8.5, "maxScore": 10, "feedback": "..." }
    },
    "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
    "growthAreas": ["Growth area 1", "Growth area 2"],
    "interviewerVotes": {
      "alex": { "stance": "Hire", "verdict": "..." },
      "sarah": { "stance": "Strong Hire", "verdict": "..." },
      "devon": { "stance": "Hire", "verdict": "..." }
    }
  }
}`;

    const userPrompt = `FULL INTERVIEW TRANSCRIPT:
${formattedHistory}

Generate the Hiring Committee Debate and final Rubric Evaluation.`;

    const rawJson = await this.generateContent(userPrompt, systemPrompt);
    const parsed = JSON.parse(rawJson);

    const debateTurns: CommitteeTurn[] = (parsed.debateTurns || []).map((t: any, idx: number) => ({
      id: `turn-live-${Date.now()}-${idx}`,
      agentId: t.agentId || 'alex',
      round: t.round || 1,
      stance: t.stance || 'Hire',
      confidence: t.confidence || 80,
      speech: t.speech,
      highlightCriterion: t.highlightCriterion || 'Technical Assessment'
    }));

    return {
      debateTurns,
      evaluation: parsed.evaluation
    };
  }
}
