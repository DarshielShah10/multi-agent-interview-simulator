import React, { useState } from 'react';
import { CandidateProfileData } from '../types';
import { SAMPLE_CANDIDATES, SampleCandidatePreset } from '../lib/mockData';
import { FileText, Sparkles, User, Briefcase, CheckCircle2, ArrowRight, Cpu } from 'lucide-react';

interface ProfileBuilderProps {
  onProceed: (profile: CandidateProfileData, sample?: SampleCandidatePreset) => void;
  isLoading?: boolean;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onProceed, isLoading }) => {
  const [selectedSample, setSelectedSample] = useState<SampleCandidatePreset>(SAMPLE_CANDIDATES[0]);
  const [candidateName, setCandidateName] = useState(SAMPLE_CANDIDATES[0].name);
  const [targetRole, setTargetRole] = useState(SAMPLE_CANDIDATES[0].targetRole);
  const [experienceYears, setExperienceYears] = useState(SAMPLE_CANDIDATES[0].profile.experienceYears);
  const [resumeText, setResumeText] = useState(SAMPLE_CANDIDATES[0].profile.resumeText);
  const [transcriptText, setTranscriptText] = useState(SAMPLE_CANDIDATES[0].profile.transcriptText);

  const handleSelectSample = (sample: SampleCandidatePreset) => {
    setSelectedSample(sample);
    setCandidateName(sample.name);
    setTargetRole(sample.targetRole);
    setExperienceYears(sample.profile.experienceYears);
    setResumeText(sample.profile.resumeText);
    setTranscriptText(sample.profile.transcriptText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: CandidateProfileData = {
      candidateName: candidateName.trim() || 'Candidate',
      targetRole: targetRole.trim() || 'Software Engineer',
      experienceYears,
      resumeText,
      transcriptText,
      extractedFacts: selectedSample?.name === candidateName ? selectedSample.profile.extractedFacts : {
        verifiedSkills: ['Distributed Systems', 'PostgreSQL', 'Concurrency'],
        claimedAchievements: ['Engineered high-throughput service', 'Improved SLA resilience'],
        workHistory: [`${targetRole} (${experienceYears} yrs)`],
        directQuotes: [
          '"We solved this by attaching a deterministic UUIDv4 idempotency key..."',
          '"I owned the mistake immediately in the post-mortem, wrote a blameless RCA..."'
        ]
      }
    };

    onProceed(profile, selectedSample.name === candidateName ? selectedSample : undefined);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-boardroom-900 via-boardroom-850 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1: Candidate Profile & Fact Extractor
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Multi-Agent AI Hiring Committee Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ingest candidate Resume & Interview Transcript. The system extracts ground-truth facts to feed 4 independent AI agents.
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Load Evaluation Test Scenarios:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_CANDIDATES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedSample.id === sample.id
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg'
                    : 'bg-boardroom-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {sample.name.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-white">{sample.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    sample.id === 'candidate-strong'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950/60 text-rose-400 border-rose-800'
                  }`}>
                    {sample.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">{sample.targetRole}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sample.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Ingestion Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Candidate Full Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full bg-boardroom-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Target Job Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-boardroom-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Experience (Years)
            </label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full bg-boardroom-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Dual Textboxes: Resume and Transcript */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Resume Box */}
          <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" /> Candidate Resume / CV Claims
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Shared Fact Ingestion</span>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-boardroom-850 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              required
            />
          </div>

          {/* Transcript Box */}
          <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" /> Verbatim Interview Transcript
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Quote & Fact Extraction Source</span>
            </div>
            <textarea
              rows={8}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              className="w-full bg-boardroom-850 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Extracted Facts Preview */}
        {selectedSample?.profile.extractedFacts && (
          <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Fact Sheet (Fed to All 4 Agents)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Verified Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSample.profile.extractedFacts.verifiedSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Key Direct Quotes for Evidence:</span>
                <ul className="space-y-1 text-slate-300 italic text-[11px]">
                  {selectedSample.profile.extractedFacts.directQuotes.map((q, i) => (
                    <li key={i} className="line-clamp-1">"{q}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Proceed to 4-Agent Independent Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
