import React, { useState, useEffect, useReducer } from 'react';
import { InterviewConfig, InterviewPhase } from './types';
import { INTERVIEWERS } from './lib/agents';
import { InterviewSession } from './lib/orchestrator';
import { speechManager } from './lib/speech';
import { SetupModal } from './components/SetupModal';
import { PanelHeader } from './components/PanelHeader';
import { InterviewerCard } from './components/InterviewerCard';
import { DialogueTranscript } from './components/DialogueTranscript';
import { BackchannelFeed } from './components/BackchannelFeed';
import { CandidateInput } from './components/CandidateInput';
import { CommitteeDebate } from './components/CommitteeDebate';
import { ScorecardReport } from './components/ScorecardReport';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<InterviewPhase>('setup');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isSpeakingActive, setIsSpeakingActive] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | undefined>();
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    speechManager.onSpeakingChange((speaking, agentId) => {
      setIsSpeakingActive(speaking);
      setActiveSpeakerId(agentId);
    });
  }, []);

  const handleStartInterview = async (config: InterviewConfig) => {
    const newSession = new InterviewSession(config, () => {
      forceUpdate();
    });
    setSession(newSession);
    setPhase('interview');
    await newSession.startInterview();
  };

  const handleSubmitResponse = async (text: string) => {
    if (!session) return;
    await session.submitCandidateResponse(text);
  };

  const handleConcludeInterview = async () => {
    if (!session) return;
    setPhase('committee');
    setIsDeliberating(true);
    await session.runCommitteeDebate();
    setIsDeliberating(false);
  };

  const handleViewScorecard = () => {
    setPhase('scorecard');
  };

  const handleReset = () => {
    speechManager.stop();
    setSession(null);
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-boardroom-950 text-slate-100 flex flex-col font-sans">
      {/* PHASE 1: SETUP MODAL */}
      {phase === 'setup' && (
        <SetupModal onStart={handleStartInterview} />
      )}

      {/* PHASE 2: ACTIVE INTERVIEW */}
      {phase === 'interview' && session && (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <PanelHeader
            config={session.config}
            turnCount={session.history.filter((m) => m.speaker === 'candidate').length + 1}
            onConcludeInterview={handleConcludeInterview}
            onReset={handleReset}
          />

          {/* Main Interview Stage */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
            {/* Top 3 Interviewer Persona Video/Avatar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InterviewerCard
                profile={INTERVIEWERS.alex}
                isSpeaking={isSpeakingActive && activeSpeakerId === 'alex'}
                mood={session.moods.alex}
              />
              <InterviewerCard
                profile={INTERVIEWERS.sarah}
                isSpeaking={isSpeakingActive && activeSpeakerId === 'sarah'}
                mood={session.moods.sarah}
              />
              <InterviewerCard
                profile={INTERVIEWERS.devon}
                isSpeaking={isSpeakingActive && activeSpeakerId === 'devon'}
                mood={session.moods.devon}
              />
            </div>

            {/* Split Stage: Left (Dialogue + Candidate Input), Right (Secret Backchannel) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[480px]">
              {/* Left Column: Dialogue & Input (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex-1 min-h-[340px]">
                  <DialogueTranscript
                    messages={session.history}
                    currentSpeaker={session.currentSpeaker}
                    candidateName={session.config.candidateName}
                  />
                </div>

                <CandidateInput
                  onSubmit={handleSubmitResponse}
                  disabled={isSpeakingActive}
                  targetRole={session.config.targetRole}
                />
              </div>

              {/* Right Column: Interviewer Backchannel / Whisper HUD (4 cols) */}
              <div className="lg:col-span-4 flex flex-col">
                <BackchannelFeed notes={session.backchannelNotes} />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* PHASE 3: AUTONOMOUS HIRING COMMITTEE DELIBERATION */}
      {phase === 'committee' && session && (
        <div className="flex-1 flex flex-col min-h-screen">
          <PanelHeader
            config={session.config}
            turnCount={session.history.filter((m) => m.speaker === 'candidate').length}
            onConcludeInterview={() => {}}
            onReset={handleReset}
          />
          <main className="flex-1 py-6">
            <CommitteeDebate
              turns={session.committeeTurns}
              isDeliberating={isDeliberating}
              currentSpeaker={session.currentSpeaker}
              onViewScorecard={handleViewScorecard}
            />
          </main>
        </div>
      )}

      {/* PHASE 4: FINAL COMPREHENSIVE SCORECARD */}
      {phase === 'scorecard' && session?.evaluation && (
        <div className="flex-1 flex flex-col min-h-screen">
          <PanelHeader
            config={session.config}
            turnCount={session.history.filter((m) => m.speaker === 'candidate').length}
            onConcludeInterview={() => {}}
            onReset={handleReset}
          />
          <main className="flex-1 py-6">
            <ScorecardReport
              evaluation={session.evaluation}
              onRestart={handleReset}
            />
          </main>
        </div>
      )}
    </div>
  );
};
export default App;
