import React, { useState, useEffect } from 'react';
import { InterviewConfig } from '../types';
import { Volume2, VolumeX, Gavel, RotateCcw, Clock, ShieldCheck, Zap } from 'lucide-react';
import { speechManager } from '../lib/speech';

interface PanelHeaderProps {
  config: InterviewConfig;
  turnCount: number;
  onConcludeInterview: () => void;
  onReset: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  config,
  turnCount,
  onConcludeInterview,
  onReset,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(speechManager.getMuted());

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    const nextState = !isMuted;
    speechManager.setMuted(nextState);
    setIsMuted(nextState);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-boardroom-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3.5 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
      {/* Role & Context Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <span className="font-mono font-black text-white text-base">HS</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              {config.targetRole}
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {config.jobLevel}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border ${
              config.useDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {config.useDemoMode ? <Zap className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              {config.useDemoMode ? 'Demo Simulation' : 'Gemini 2.0 Live'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Candidate: <span className="text-slate-200 font-medium">{config.candidateName}</span> • Panel: 3 AI Interviewers
          </p>
        </div>
      </div>

      {/* Metrics & Control Actions */}
      <div className="flex items-center gap-2.5 md:gap-4">
        {/* Timer */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-boardroom-850 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatTime(seconds)}</span>
        </div>

        {/* Turn Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-boardroom-850 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-400">Round:</span>
          <span className="font-semibold text-indigo-400">{turnCount}</span>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleAudio}
          title={isMuted ? 'Unmute AI Voices' : 'Mute AI Voices'}
          className={`p-2 rounded-lg border transition-all ${
            isMuted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              : 'bg-boardroom-850 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset Session */}
        <button
          onClick={onReset}
          title="Reset Interview"
          className="p-2 rounded-lg bg-boardroom-850 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Conclude & Convene Committee */}
        <button
          onClick={onConcludeInterview}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          <Gavel className="w-4 h-4" />
          <span>Conclude & Deliberate</span>
        </button>
      </div>
    </header>
  );
};
