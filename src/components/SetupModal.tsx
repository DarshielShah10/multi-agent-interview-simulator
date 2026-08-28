import React, { useState } from 'react';
import { InterviewConfig } from '../types';
import { ROLE_PRESETS } from '../lib/agents';
import { Sparkles, Key, Briefcase, User, Play, Info, ShieldCheck, Zap } from 'lucide-react';

interface SetupModalProps {
  onStart: (config: InterviewConfig) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ onStart }) => {
  const [candidateName, setCandidateName] = useState('Alex Mercer');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [targetRole, setTargetRole] = useState(ROLE_PRESETS[0].role);
  const [jobLevel, setJobLevel] = useState<InterviewConfig['jobLevel']>('Senior');
  const [companyContext, setCompanyContext] = useState(ROLE_PRESETS[0].context);
  const [apiKey, setApiKey] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [showKeyField, setShowKeyField] = useState(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const preset = ROLE_PRESETS[idx];
    setTargetRole(preset.role);
    setJobLevel(preset.level);
    setCompanyContext(preset.context);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      candidateName: candidateName.trim() || 'Candidate',
      targetRole: targetRole.trim() || 'Software Engineer',
      jobLevel,
      companyContext,
      useDemoMode,
      geminiApiKey: apiKey.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-boardroom-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-boardroom-900 border border-slate-700/60 rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Agent Boardroom Simulation
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              The Hot Seat: Panel Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure your interview session with 3 dynamic AI agents.
            </p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Target Role Preset
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {ROLE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={preset.role}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-3.5 rounded-xl border transition-all duration-150 ${
                    selectedPresetIndex === idx
                      ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/50'
                      : 'bg-boardroom-850 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{preset.role}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                      {preset.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{preset.context}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
                className="w-full bg-boardroom-850 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Alex Mercer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Job Seniority
              </label>
              <select
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value as any)}
                className="w-full bg-boardroom-850 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Mid-Level">Mid-Level Engineer</option>
                <option value="Senior">Senior Engineer</option>
                <option value="Staff / Principal">Staff / Principal Architect</option>
                <option value="Lead / Director">Lead / Director of Engineering</option>
              </select>
            </div>
          </div>

          {/* Mode Configuration Card */}
          <div className="p-4 rounded-xl bg-boardroom-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${useDemoMode ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {useDemoMode ? <Zap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {useDemoMode ? 'Instant Demo Simulation Mode' : 'Live Gemini AI Mode'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {useDemoMode
                      ? 'Zero latency pre-tuned multi-agent simulation with rich backchannel whispers.'
                      : 'Live parallel multi-agent LLM reasoning using Gemini 2.0 Flash.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseDemoMode(!useDemoMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useDemoMode ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useDemoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {!useDemoMode && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" /> Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeyField ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-boardroom-900 border border-slate-700/60 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyField(!showKeyField)}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {showKeyField ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Stored only in browser memory. Falls back to demo mode if empty.
                </p>
              </div>
            )}
          </div>

          {/* Start Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-white" />
            Enter The Hot Seat Interview
          </button>
        </form>
      </div>
    </div>
  );
};
