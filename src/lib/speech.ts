import { AgentId } from '../types';
import { AGENT_PROFILES } from './agents';

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private onSpeakingChangeCallbacks: ((isSpeaking: boolean, agentId?: AgentId) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
      this.notifySpeaking(false);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public onSpeakingChange(cb: (isSpeaking: boolean, agentId?: AgentId) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
  }

  private notifySpeaking(isSpeaking: boolean, agentId?: AgentId) {
    this.onSpeakingChangeCallbacks.forEach(cb => cb(isSpeaking, agentId));
  }

  public speak(text: string, agentId: AgentId): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted) {
        resolve();
        return;
      }

      this.synth.cancel();
      this.loadVoices();

      const cleanText = text
        .replace(/\*\*.*?\*\*/g, (match) => match.replace(/\*\*/g, ''))
        .replace(/`.*?`/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/"/g, '')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const profile = AGENT_PROFILES[agentId];

      utterance.pitch = profile?.speechPitch || 1.0;
      utterance.rate = profile?.speechRate || 1.0;

      if (this.voices.length > 0) {
        if (agentId === 'culture') {
          const femaleVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira'))
          );
          if (femaleVoice) utterance.voice = femaleVoice;
        } else if (agentId === 'skeptic') {
          const sharpVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Karen') || v.name.includes('Susan') || v.name.includes('Moira') || v.name.includes('Tessa'))
          );
          if (sharpVoice) utterance.voice = sharpVoice;
        } else if (agentId === 'technical') {
          const deepVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('David') || v.name.includes('Guy'))
          );
          if (deepVoice) utterance.voice = deepVoice;
        } else if (agentId === 'hiring_manager') {
          const execVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('George') || v.name.includes('Tom') || v.name.includes('Oliver') || v.name.includes('Mark'))
          );
          if (execVoice) utterance.voice = execVoice;
        }
      }

      utterance.onstart = () => {
        this.notifySpeaking(true, agentId);
      };

      utterance.onend = () => {
        this.notifySpeaking(false, agentId);
        resolve();
      };

      utterance.onerror = () => {
        this.notifySpeaking(false, agentId);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notifySpeaking(false);
    }
  }
}

export const speechManager = new SpeechManager();
