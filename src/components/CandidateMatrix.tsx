import React from 'react';
import { SAMPLE_CANDIDATES, SampleCandidatePreset } from '../lib/mockData';
import { Users, ArrowRight } from 'lucide-react';

interface CandidateMatrixProps {
  onSelectCandidate: (candidate: SampleCandidatePreset) => void;
}

export const CandidateMatrix: React.FC<CandidateMatrixProps> = ({ onSelectCandidate }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-boardroom-900 via-boardroom-850 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" />
              Executive Calibration Board
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Multi-Candidate Benchmark Matrix
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Compare multiple candidates side-by-side across all 4 AI persona dimensions, calibrated leveling, and consensus verdicts.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SAMPLE_CANDIDATES.map((cand) => {
          const isHire = cand.finalReport.finalRecommendation === 'Strong Hire' || cand.finalReport.finalRecommendation === 'Hire';

          return (
            <div
              key={cand.id}
              className={`bg-boardroom-900 border rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all hover:border-indigo-500/50 hover:scale-[1.01] ${
                isHire ? 'border-slate-800' : 'border-rose-900/40 bg-rose-950/10'
              }`}
            >
              <div className="space-y-3">
                {/* Candidate Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white">{cand.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{cand.targetRole}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
                    cand.finalReport.finalRecommendation === 'Strong Hire'
                      ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/60'
                      : cand.finalReport.finalRecommendation === 'Hire'
                      ? 'text-indigo-300 bg-indigo-950/80 border-indigo-500/60'
                      : 'text-rose-300 bg-rose-950/80 border-rose-500/60'
                  }`}>
                    {cand.finalReport.finalRecommendation}
                  </span>
                </div>

                {/* Score & Confidence */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-boardroom-850 border border-slate-800 text-xs">
                  <span className="text-slate-400">Confidence Rating</span>
                  <span className="font-mono font-bold text-white text-sm">{cand.finalReport.overallConfidence}%</span>
                </div>

                {/* 4 Dimension Mini Bars */}
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Technical Depth</span>
                      <span className="text-blue-400 font-bold">{cand.finalReport.dimensionScores.technicalCompetence.score}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-boardroom-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(cand.finalReport.dimensionScores.technicalCompetence.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Culture & Ethics</span>
                      <span className="text-purple-400 font-bold">{cand.finalReport.dimensionScores.culturalIntegrity.score}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-boardroom-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(cand.finalReport.dimensionScores.culturalIntegrity.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Risk Mitigation</span>
                      <span className="text-amber-400 font-bold">{cand.finalReport.dimensionScores.riskFactorInverse.score}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-boardroom-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHire ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${(cand.finalReport.dimensionScores.riskFactorInverse.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Insight Summary */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-2 border-t border-slate-800/80">
                  {cand.finalReport.decisionRationale}
                </p>
              </div>

              {/* View Full Report Button */}
              <button
                type="button"
                onClick={() => onSelectCandidate(cand)}
                className="w-full py-2.5 px-4 rounded-xl bg-boardroom-850 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all mt-2"
              >
                <span>Inspect Full Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
