import React from 'react';
import { IndependentOpinion, CandidateProfileData } from '../types';
import { AGENT_PROFILES } from '../lib/agents';
import { ShieldCheck, Quote, ArrowRight, TrendingUp, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

interface IndependentReviewsProps {
  profile: CandidateProfileData;
  opinions: Record<string, IndependentOpinion>;
  onStartDebate: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const IndependentReviews: React.FC<IndependentReviewsProps> = ({
  profile,
  opinions,
  onStartDebate,
  onBack,
  isLoading,
}) => {
  const getStanceBadge = (stance: IndependentOpinion['stance']) => {
    switch (stance) {
      case 'Strong Hire':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/60 shadow-emerald-500/10';
      case 'Hire':
        return 'text-indigo-300 bg-indigo-950/80 border-indigo-500/60 shadow-indigo-500/10';
      case 'Leaning No Hire':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/60 shadow-amber-500/10';
      default:
        return 'text-rose-300 bg-rose-950/80 border-rose-500/60 shadow-rose-500/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-boardroom-900 via-boardroom-850 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Step 2: Isolated Independent Evaluations (No Cross-Contamination)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Independent Persona Assessments
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Candidate: <span className="text-white font-semibold">{profile.candidateName}</span> ({profile.targetRole})
            </p>
          </div>

          {/* Isolated Evaluation Rule Banner */}
          <div className="p-3 rounded-2xl bg-boardroom-900 border border-indigo-500/30 text-xs text-indigo-200 max-w-sm">
            <span className="font-bold block text-white mb-0.5">🔒 Isolated Evaluation Protocol:</span>
            Each agent generated its opinion independently with separate LLM reasoning before seeing other agents' conclusions.
          </div>
        </div>
      </div>

      {/* 4 Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(AGENT_PROFILES).map(([agentKey, agent]) => {
          const opinion = opinions[agentKey];
          if (!opinion) return null;

          return (
            <div
              key={agentKey}
              className={`bg-boardroom-900 border ${agent.borderColor} rounded-2xl p-5 md:p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${agent.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {agent.name}
                      </h3>
                      <p className={`text-xs font-semibold ${agent.accentColor}`}>
                        {agent.roleTitle}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Domain: {agent.domain}
                      </p>
                    </div>
                  </div>

                  {/* Stance & Confidence Badge */}
                  <div className="text-right space-y-1">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${getStanceBadge(opinion.stance)}`}>
                      {opinion.stance}
                    </span>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 font-mono">
                      <TrendingUp className="w-3 h-3 text-indigo-400" />
                      <span>{opinion.confidenceScore}% conf</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-200 mt-3 leading-relaxed">
                  {opinion.summary}
                </p>

                {/* Key Evidence & Direct Quotes */}
                <div className="mt-4 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Cited Evidence & Verbatim Quotes:
                  </span>
                  {opinion.keyPoints.map((kp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-boardroom-850 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-start gap-1.5">
                        {kp.sentiment === 'positive' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : kp.sentiment === 'concerning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5"></span>
                        )}
                        <p className="text-slate-200 font-medium">{kp.point}</p>
                      </div>

                      {kp.citedQuote && (
                        <div className="flex items-start gap-1.5 text-[11px] text-slate-400 italic bg-boardroom-900/80 p-2 rounded-lg border border-slate-800/80">
                          <Quote className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{kp.citedQuote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Evaluated independently prior to debate stage.
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-boardroom-850 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fact Extractor</span>
        </button>

        <button
          onClick={onStartDebate}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Convene Step 3: Multi-Agent Voice Debate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
