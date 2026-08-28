import React, { useState } from 'react';
import { 
  CandidateProfileData, 
  IndependentOpinion, 
  DebateTurn, 
  FinalConsensusReport, 
  PipelineStep,
  AgentId
} from './types';
import { SAMPLE_CANDIDATES, SampleCandidatePreset } from './lib/mockData';
import { GeminiPipelineService } from './lib/gemini';
import { speechManager } from './lib/speech';
import { ProfileBuilder } from './components/ProfileBuilder';
import { IndependentReviews } from './components/IndependentReviews';
import { DebateRoom } from './components/DebateRoom';
import { FinalDecisionReport } from './components/FinalDecisionReport';
import { Sparkles, Key, Zap, ShieldCheck, FileText, Users, MessageSquare, Award } from 'lucide-react';

export const App: React.FC = () => {
  const [step, setStep] = useState<PipelineStep>('profile');
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State across pipeline
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfileData>(SAMPLE_CANDIDATES[0].profile);
  const [selectedSamplePreset, setSelectedSamplePreset] = useState<SampleCandidatePreset | undefined>(SAMPLE_CANDIDATES[0]);
  const [opinions, setOpinions] = useState<Record<string, IndependentOpinion>>(SAMPLE_CANDIDATES[0].independentOpinions);
  const [debateTurns, setDebateTurns] = useState<DebateTurn[]>(SAMPLE_CANDIDATES[0].debateTurns);
  const [finalReport, setFinalReport] = useState<FinalConsensusReport>(SAMPLE_CANDIDATES[0].finalReport);

  const geminiService = new GeminiPipelineService(apiKey);

  // Step 1 -> Step 2: Ingest & run independent opinions
  const handleProceedToReviews = async (profile: CandidateProfileData, sample?: SampleCandidatePreset) => {
    setCandidateProfile(profile);
    setSelectedSamplePreset(sample);
    setIsLoading(true);

    if (useDemoMode || !geminiService.hasApiKey() || sample) {
      if (sample) {
        setOpinions(sample.independentOpinions);
        setDebateTurns(sample.debateTurns);
        setFinalReport(sample.finalReport);
      } else {
        setOpinions(SAMPLE_CANDIDATES[0].independentOpinions);
      }
      setIsLoading(false);
      setStep('independent_review');
    } else {
      try {
        const agentIds: AgentId[] = ['technical', 'culture', 'hiring_manager', 'skeptic'];
        const results: Record<string, IndependentOpinion> = {};

        // Parallel isolated LLM calls (Rule: separate LLM calls, no agent sees another's output)
        await Promise.all(
          agentIds.map(async (id) => {
            const opinion = await geminiService.evaluateIndependently(id, profile);
            results[id] = opinion;
          })
        );

        setOpinions(results);
        setStep('independent_review');
      } catch (err) {
        console.error('Gemini error, fallback to preset:', err);
        setOpinions(SAMPLE_CANDIDATES[0].independentOpinions);
        setStep('independent_review');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Step 2 -> Step 3: Start Debate
  const handleStartDebate = async () => {
    setIsLoading(true);

    if (useDemoMode || !geminiService.hasApiKey() || selectedSamplePreset) {
      if (selectedSamplePreset) {
        setDebateTurns(selectedSamplePreset.debateTurns);
      } else {
        setDebateTurns(SAMPLE_CANDIDATES[0].debateTurns);
      }
      setIsLoading(false);
      setStep('debate');
    } else {
      try {
        const turns = await geminiService.generateDebateSession(candidateProfile, opinions as any);
        setDebateTurns(turns);
        setStep('debate');
      } catch (err) {
        console.error('Debate generation error:', err);
        setDebateTurns(SAMPLE_CANDIDATES[0].debateTurns);
        setStep('debate');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Step 3 -> Step 4: Synthesize Final Report
  const handleSynthesizeFinalReport = async () => {
    setIsLoading(true);

    if (useDemoMode || !geminiService.hasApiKey() || selectedSamplePreset) {
      if (selectedSamplePreset) {
        setFinalReport(selectedSamplePreset.finalReport);
      } else {
        setFinalReport(SAMPLE_CANDIDATES[0].finalReport);
      }
      setIsLoading(false);
      setStep('final_report');
    } else {
      try {
        const report = await geminiService.generateFinalDecisionReport(candidateProfile, opinions as any, debateTurns);
        setFinalReport(report);
        setStep('final_report');
      } catch (err) {
        console.error('Final decision synthesis error:', err);
        setFinalReport(SAMPLE_CANDIDATES[0].finalReport);
        setStep('final_report');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRestart = () => {
    speechManager.stop();
    setStep('profile');
  };

  const STEPS_NAV = [
    { id: 'profile', label: '1. Fact Extractor', icon: FileText },
    { id: 'independent_review', label: '2. 4 Independent Agents', icon: Users },
    { id: 'debate', label: '3. Voice Debate Room', icon: MessageSquare },
    { id: 'final_report', label: '4. Reasoned Consensus', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-boardroom-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Navbar */}
      <header className="bg-boardroom-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              Multi-Agent AI Interview Panel Simulator
            </h1>
            <p className="text-xs text-slate-400">
              4 AI Personas • Isolated Reviews • Cross-Agent Debate • Evidence Weighting
            </p>
          </div>
        </div>

        {/* Pipeline Step Progress Indicator */}
        <div className="hidden lg:flex items-center gap-1 bg-boardroom-850 p-1 rounded-xl border border-slate-800">
          {STEPS_NAV.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Mode Toggle & API Key */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseDemoMode(!useDemoMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              useDemoMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {useDemoMode ? <Zap className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{useDemoMode ? 'Demo Mode' : 'Gemini 2.0 Live'}</span>
          </button>

          {!useDemoMode && (
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 rounded-xl bg-boardroom-850 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>{apiKey ? 'Key Set' : 'Set Key'}</span>
            </button>
          )}
        </div>
      </header>

      {/* API Key Modal if opened */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-boardroom-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-boardroom-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" /> Configure Gemini API Key
            </h3>
            <p className="text-xs text-slate-400">
              Enter your Google Gemini API Key for live LLM evaluations.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-boardroom-850 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Stages */}
      <main className="flex-1 py-4 md:py-6">
        {step === 'profile' && (
          <ProfileBuilder onProceed={handleProceedToReviews} isLoading={isLoading} />
        )}

        {step === 'independent_review' && (
          <IndependentReviews
            profile={candidateProfile}
            opinions={opinions}
            onStartDebate={handleStartDebate}
            onBack={() => setStep('profile')}
            isLoading={isLoading}
          />
        )}

        {step === 'debate' && (
          <DebateRoom
            debateTurns={debateTurns}
            onSynthesizeFinalReport={handleSynthesizeFinalReport}
            onBack={() => setStep('independent_review')}
            isLoading={isLoading}
          />
        )}

        {step === 'final_report' && (
          <FinalDecisionReport
            report={finalReport}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
};
export default App;
