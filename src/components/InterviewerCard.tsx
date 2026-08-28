import React from 'react';
import { InterviewerProfile, InterviewerMood } from '../types';
import { Sparkles, Mic, AlertCircle, CheckCircle2, Search } from 'lucide-react';

interface InterviewerCardProps {
  profile: InterviewerProfile;
  isSpeaking: boolean;
  mood: InterviewerMood;
  lastActiveTopic?: string;
}

export const InterviewerCard: React.FC<InterviewerCardProps> = ({
  profile,
  isSpeaking,
  mood,
}) => {
  const getMoodBadge = () => {
    switch (mood) {
      case 'probing':
        return { text: 'Probing Depth', icon: Search, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
      case 'skeptical':
        return { text: 'Skeptical / Edge-Case', icon: AlertCircle, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
      case 'impressed':
        return { text: 'Impressed', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
      case 'satisfied':
        return { text: 'Satisfied Signal', icon: CheckCircle2, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60' };
      default:
        return { text: 'Observing', icon: Sparkles, color: 'text-slate-400 bg-slate-800/60 border-slate-700/60' };
    }
  };

  const moodInfo = getMoodBadge();
  const MoodIcon = moodInfo.icon;

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between ${
        isSpeaking
          ? `${profile.borderColor} bg-boardroom-850 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/10 scale-[1.02]`
          : 'border-slate-800 bg-boardroom-900/80 hover:border-slate-700'
      }`}
    >
      {/* Speaking Indicator Pulse Glow */}
      {isSpeaking && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md animate-pulse">
          <Mic className="w-3 h-3" /> Speaking Now
        </div>
      )}

      <div>
        {/* Top: Avatar & Name */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl ${profile.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
              {profile.name.charAt(0)}
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-boardroom-900"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
              {profile.name}
            </h3>
            <p className={`text-xs font-semibold ${profile.accentColor} truncate`}>
              {profile.companyRole}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {profile.title}
            </p>
          </div>
        </div>

        {/* Focus Area */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
          {profile.primaryFocus}
        </p>
      </div>

      {/* Footer Status and Sound Waves */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${moodInfo.color}`}>
          <MoodIcon className="w-3 h-3" />
          <span>{moodInfo.text}</span>
        </div>

        {/* Animated Audio Equalizer Bars if Speaking */}
        {isSpeaking ? (
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-full bg-indigo-400 animate-bounce rounded-full [animation-delay:-0.3s]"></span>
            <span className="w-0.5 h-full bg-indigo-400 animate-bounce rounded-full [animation-delay:-0.15s]"></span>
            <span className="w-0.5 h-full bg-indigo-400 animate-bounce rounded-full [animation-delay:-0.45s]"></span>
            <span className="w-0.5 h-full bg-indigo-400 animate-bounce rounded-full"></span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono">Listening</span>
        )}
      </div>
    </div>
  );
};
