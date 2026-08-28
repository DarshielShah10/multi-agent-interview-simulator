import React from 'react';
import { BackchannelNote } from '../types';
import { INTERVIEWERS } from '../lib/agents';
import { ShieldAlert, Sparkles, ArrowRight, Eye, MessageSquareCode } from 'lucide-react';

interface BackchannelFeedProps {
  notes: BackchannelNote[];
}

export const BackchannelFeed: React.FC<BackchannelFeedProps> = ({ notes }) => {
  const getFlagBadge = (flag: BackchannelNote['flag']) => {
    switch (flag) {
      case 'weakness':
        return { label: 'Gap Detected', icon: ShieldAlert, color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' };
      case 'strength':
        return { label: 'Strong Signal', icon: Sparkles, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
      case 'handoff':
        return { label: 'Tag-Team Handoff', icon: ArrowRight, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
      case 'probing':
        return { label: 'Challenge Point', icon: Eye, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
      default:
        return { label: 'Observation', icon: MessageSquareCode, color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' };
    }
  };

  return (
    <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interviewer Backchannel
            </h3>
            <p className="text-[10px] text-slate-400">
              Secret AI-to-AI whisper stream & candidate weakness radar
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          {notes.length} whispers
        </span>
      </div>

      {/* Feed Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Eye className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
            <p className="text-xs font-medium">Interviewer backchannel is quiet.</p>
            <p className="text-[11px] mt-0.5">Whispers will appear here after candidate responses.</p>
          </div>
        ) : (
          notes.map((note) => {
            const sender = INTERVIEWERS[note.agentId];
            const target = note.targetAgentId ? INTERVIEWERS[note.targetAgentId] : null;
            const flagInfo = getFlagBadge(note.flag);
            const FlagIcon = flagInfo.icon;

            return (
              <div
                key={note.id}
                className="bg-boardroom-850 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2 hover:border-slate-700 transition-colors animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Whisper metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className={`font-bold ${sender?.accentColor || 'text-white'}`}>
                      {sender?.name.split(' ')[0]}
                    </span>
                    {target && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className={`font-semibold ${target.accentColor}`}>
                          {target.name.split(' ')[0]}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${flagInfo.color}`}>
                      <FlagIcon className="w-2.5 h-2.5" />
                      <span>{flagInfo.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{note.timestamp}</span>
                  </div>
                </div>

                {/* Thought Content */}
                <p className="text-slate-300 leading-relaxed italic">
                  "{note.thought}"
                </p>

                {/* Trigger phrase snippet if present */}
                {note.triggerPhrase && (
                  <div className="text-[10px] text-slate-400 bg-boardroom-900 px-2 py-1 rounded border border-slate-800/60 font-mono truncate">
                    <span className="text-slate-500">Trigger:</span> "{note.triggerPhrase}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
