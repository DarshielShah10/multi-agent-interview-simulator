import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Lightbulb } from 'lucide-react';
import { SpeechToTextController } from '../lib/speech';

interface CandidateInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const CandidateInput: React.FC<CandidateInputProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const sttControllerRef = useRef<SpeechToTextController | null>(null);

  useEffect(() => {
    sttControllerRef.current = new SpeechToTextController();
    return () => {
      sttControllerRef.current?.stopListening();
    };
  }, []);

  const handleToggleVoice = () => {
    if (!sttControllerRef.current) return;
    setSpeechError(null);

    if (isListening) {
      sttControllerRef.current.stopListening();
      setIsListening(false);
    } else {
      const started = sttControllerRef.current.startListening({
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        },
        onError: (err) => {
          setSpeechError(err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
      setIsListening(started);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;

    if (isListening) {
      sttControllerRef.current?.stopListening();
      setIsListening(false);
    }

    onSubmit(text.trim());
    setText('');
    setSpeechError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertSuggestion = (sample: string) => {
    setText((prev) => (prev ? `${prev} ${sample}` : sample));
  };

  const QUICK_SUGGESTIONS = [
    'We implemented distributed idempotency keys in Redis with strict 30s lease TTLs and backoff retries.',
    'To avoid Kafka partition rebalance storm, we configured static group membership and tuned session timeouts.',
    'I ran a blameless post-mortem, identified missing synthetic alerts, and introduced canary deployments.',
    'We benchmarked Postgres SKIP LOCKED against RabbitMQ; at 15k req/s, connection saturation demanded a broker.',
  ];

  return (
    <div className="bg-boardroom-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* STAR Framework Helper / Quick Hints */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-300">STAR Quick Structure:</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Situation → Task → Action → Result</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500 font-mono">
            {text.trim() ? `${text.trim().split(/\s+/).length} words` : '0 words'}
          </span>
        </div>
      </div>

      {/* Suggested Quick Answer Snippets (Great for Fast Demos) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Quick Chips:
        </span>
        {QUICK_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => insertSuggestion(sug)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-boardroom-850 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-slate-800 transition-all text-left"
          >
            {sug.slice(0, 42)}...
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={3}
            placeholder={
              isListening
                ? 'Listening to your microphone... (speak clearly)'
                : `Address the panel... (Press Enter to send, Shift+Enter for new line)`
            }
            className={`w-full bg-boardroom-850 border rounded-xl p-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-slate-500 resize-none ${
              isListening
                ? 'border-red-500 ring-2 ring-red-500/20'
                : 'border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
          />

          {/* Voice Pulse Animation Badge if Active */}
          {isListening && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Recording Voice...
            </div>
          )}
        </div>

        {speechError && (
          <p className="text-xs text-rose-400 px-1">{speechError}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          {/* Voice Dictation Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={disabled}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-600 shadow-lg shadow-red-500/25'
                : 'bg-boardroom-850 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isListening ? 'Stop Mic' : 'Voice Input (STT)'}</span>
          </button>

          {/* Send Response Button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <span>Send Answer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
