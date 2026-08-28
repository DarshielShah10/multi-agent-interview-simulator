import { ChatMessage, InterviewerId, BackchannelNote, CommitteeTurn, CandidateEvaluation, InterviewConfig, InterviewerMood } from '../types';
import { GeminiOrchestrator } from './gemini';
import { MOCK_INTERVIEW_TURNS, MOCK_COMMITTEE_DEBATE, MOCK_EVALUATION } from './mockData';
import { speechManager } from './speech';

export class InterviewSession {
  public config: InterviewConfig;
  public history: ChatMessage[] = [];
  public backchannelNotes: BackchannelNote[] = [];
  public currentSpeaker: InterviewerId | null = null;
  public moods: Record<InterviewerId, InterviewerMood> = {
    alex: 'neutral',
    sarah: 'neutral',
    devon: 'skeptical'
  };
  public committeeTurns: CommitteeTurn[] = [];
  public evaluation: CandidateEvaluation | null = null;
  public currentMockTurnIndex = 0;

  private gemini: GeminiOrchestrator;
  private onStateChange: () => void;

  constructor(config: InterviewConfig, onStateChange: () => void) {
    this.config = config;
    this.onStateChange = onStateChange;
    this.gemini = new GeminiOrchestrator(config.geminiApiKey);
  }

  public async startInterview(initialGreeting?: string) {
    const defaultGreeting = initialGreeting || `Welcome, ${this.config.candidateName}. We've reviewed your background for the ${this.config.targetRole} role. To begin, could you briefly introduce yourself and share a complex architectural or leadership challenge you tackled recently?`;
    
    this.currentSpeaker = 'sarah';
    this.moods.sarah = 'probing';

    const firstMessage: ChatMessage = {
      id: `msg-${Date.now()}-0`,
      speaker: 'sarah',
      interviewerId: 'sarah',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionTopic: 'Role Introduction & Background'
    };

    this.history.push(firstMessage);
    
    // Initial backchannel whispers
    this.backchannelNotes.push({
      id: `bn-init-1`,
      agentId: 'alex',
      targetAgentId: 'sarah',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thought: `Candidate profile initialized for ${this.config.targetRole}. Ready to probe distributed systems & latency trade-offs.`,
      flag: 'observation'
    });

    this.onStateChange();

    // Play TTS for opening question
    await speechManager.speak(defaultGreeting, 'sarah');
  }

  public async submitCandidateResponse(userText: string): Promise<void> {
    if (!userText.trim()) return;

    // Add candidate message
    const candidateMsg: ChatMessage = {
      id: `msg-${Date.now()}-cand`,
      speaker: 'candidate',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.history.push(candidateMsg);
    this.currentSpeaker = null;
    this.onStateChange();

    // If Demo Mode or No API Key -> Use Realistic Mock Simulation
    if (this.config.useDemoMode || !this.gemini.hasApiKey()) {
      await this.processMockTurn(userText);
    } else {
      await this.processGeminiTurn(userText);
    }
  }

  private async processMockTurn(_candidateText: string) {
    // Artificial brief delay for realistic simulation feel
    await new Promise(r => setTimeout(r, 1200));

    this.currentMockTurnIndex = (this.currentMockTurnIndex + 1) % MOCK_INTERVIEW_TURNS.length;
    const mockTurn = MOCK_INTERVIEW_TURNS[this.currentMockTurnIndex];

    // Push backchannel notes
    mockTurn.backchannelNotes.forEach(note => {
      this.backchannelNotes.unshift({
        ...note,
        id: `bn-mock-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    // Update moods based on speaker
    this.currentSpeaker = mockTurn.speakerId;
    if (mockTurn.speakerId === 'alex') {
      this.moods.alex = 'probing';
      this.moods.devon = 'skeptical';
      this.moods.sarah = 'satisfied';
    } else if (mockTurn.speakerId === 'devon') {
      this.moods.devon = 'probing';
      this.moods.alex = 'satisfied';
      this.moods.sarah = 'impressed';
    } else {
      this.moods.sarah = 'probing';
      this.moods.alex = 'neutral';
      this.moods.devon = 'impressed';
    }

    const nextMsg: ChatMessage = {
      id: `msg-${Date.now()}-${mockTurn.speakerId}`,
      speaker: mockTurn.speakerId,
      interviewerId: mockTurn.speakerId,
      text: mockTurn.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionTopic: mockTurn.topic
    };

    this.history.push(nextMsg);
    this.onStateChange();

    // Trigger TTS
    await speechManager.speak(mockTurn.question, mockTurn.speakerId);
  }

  private async processGeminiTurn(candidateText: string) {
    try {
      const turn = await this.gemini.processCandidateResponse(this.history, candidateText, this.config);

      // Add backchannel notes
      turn.backchannelNotes.forEach(note => {
        this.backchannelNotes.unshift(note);
      });

      this.currentSpeaker = turn.nextSpeaker;
      this.moods[turn.nextSpeaker] = 'probing';

      const nextMsg: ChatMessage = {
        id: `msg-${Date.now()}-${turn.nextSpeaker}`,
        speaker: turn.nextSpeaker,
        interviewerId: turn.nextSpeaker,
        text: turn.question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionTopic: turn.topic
      };

      this.history.push(nextMsg);
      this.onStateChange();

      // Trigger TTS
      await speechManager.speak(turn.question, turn.nextSpeaker);
    } catch (err: any) {
      console.error('Failed to process Gemini turn, falling back to mock:', err);
      // Seamlessly fallback to mock turn if API errors out
      await this.processMockTurn(candidateText);
    }
  }

  public async runCommitteeDebate(): Promise<void> {
    speechManager.stop();
    this.currentSpeaker = null;

    if (this.config.useDemoMode || !this.gemini.hasApiKey()) {
      // Step through mock debate turns with realistic timing
      for (const turn of MOCK_COMMITTEE_DEBATE) {
        this.committeeTurns.push(turn);
        this.currentSpeaker = turn.agentId;
        this.onStateChange();
        await speechManager.speak(turn.speech, turn.agentId);
        await new Promise(r => setTimeout(r, 600));
      }
      this.evaluation = {
        ...MOCK_EVALUATION,
        candidateName: this.config.candidateName,
        targetRole: this.config.targetRole
      };
      this.currentSpeaker = null;
      this.onStateChange();
    } else {
      try {
        const { debateTurns, evaluation } = await this.gemini.conductCommitteeDebate(this.history, this.config);
        
        for (const turn of debateTurns) {
          this.committeeTurns.push(turn);
          this.currentSpeaker = turn.agentId;
          this.onStateChange();
          await speechManager.speak(turn.speech, turn.agentId);
          await new Promise(r => setTimeout(r, 600));
        }

        this.evaluation = evaluation;
        this.currentSpeaker = null;
        this.onStateChange();
      } catch (err) {
        console.error('Failed to conduct live committee debate, fallback to mock:', err);
        this.committeeTurns = MOCK_COMMITTEE_DEBATE;
        this.evaluation = MOCK_EVALUATION;
        this.currentSpeaker = null;
        this.onStateChange();
      }
    }
  }
}
