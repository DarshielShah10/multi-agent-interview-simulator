import { InterviewerId } from '../types';
import { INTERVIEWERS } from './agents';

// Voice management and TTS helper
class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private onSpeakingChangeCallbacks: ((isSpeaking: boolean, agentId?: InterviewerId) => void)[] = [];

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

  public onSpeakingChange(cb: (isSpeaking: boolean, agentId?: InterviewerId) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
  }

  private notifySpeaking(isSpeaking: boolean, agentId?: InterviewerId) {
    this.onSpeakingChangeCallbacks.forEach(cb => cb(isSpeaking, agentId));
  }

  public speak(text: string, agentId: InterviewerId): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted) {
        resolve();
        return;
      }

      this.synth.cancel(); // Stop prior speech
      this.loadVoices();

      // Clean text of markdown or bracket tags before speaking
      const cleanText = text
        .replace(/\*\*.*?\*\*/g, (match) => match.replace(/\*\*/g, ''))
        .replace(/`.*?`/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const profile = INTERVIEWERS[agentId];

      utterance.pitch = profile.speechPitch;
      utterance.rate = profile.speechRate;

      // Assign realistic voice matching if available in browser
      if (this.voices.length > 0) {
        if (agentId === 'sarah') {
          // Look for natural female English voice
          const femaleVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Karen'))
          );
          if (femaleVoice) utterance.voice = femaleVoice;
        } else if (agentId === 'alex') {
          // Look for clear deep male voice
          const deepVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('David') || v.name.includes('Guy'))
          );
          if (deepVoice) utterance.voice = deepVoice;
        } else if (agentId === 'devon') {
          // Look for distinct male voice
          const crispVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('George') || v.name.includes('Tom') || v.name.includes('Oliver') || v.name.includes('Mark'))
          );
          if (crispVoice) utterance.voice = crispVoice;
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

// Web Speech Speech-To-Text API Wrapper
export interface SpeechRecognitionListener {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechToTextController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(listener: SpeechRecognitionListener): boolean {
    if (!this.recognition) {
      listener.onError('Web Speech API is not supported in this browser. Please type your response.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      listener.onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      listener.onError(event.error || 'Speech recognition error');
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      listener.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch {
      listener.onError('Could not start microphone');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
      this.isListening = false;
    }
  }
}
