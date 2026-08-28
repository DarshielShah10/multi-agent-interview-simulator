# The Hot Seat — Multi-Agent AI Interview Panel Simulator

An advanced, real-time multi-agent interview panel simulator built for technical, architectural, and behavioral leadership roles. 

Instead of a generic single-prompt chatbot, **The Hot Seat** orchestrates three distinct AI agents who listen simultaneously, exchange real-time secret backchannel assessments to target candidate weak spots, dynamically pass the speaking floor, and conclude with an **autonomous hiring committee deliberation debate**.

---

## 🌟 Key Multi-Agent Features

1. **3 Specialized Interviewer Personas**:
   - 🏗️ **Alex Chen (Principal System Architect)**: Focuses on scale, trade-offs, consistency models, and microservices resilience.
   - 👥 **Sarah Lin (Director of Engineering)**: Evaluates leadership principles, STAR-format situational execution, and cross-functional communication.
   - ⚡ **Devon Vance (Staff Pragmatic Engineer)**: Probes edge cases, catches hand-waving or buzzwords, and tests operational debugging instincts.

2. **🕵️ Live Interviewer Backchannel (The Whisper Stream)**:
   - While the candidate answers, the agents analyze the response in parallel and share internal observations visible in the candidate HUD.
   - Example: *"Candidate mentioned Redis but didn't address cache invalidation... passing to Alex to press."*

3. **🤝 Dynamic Turn Passing & Cross-Examination**:
   - The panel adapts dynamically: agents hand off questioning based on detected gaps rather than static round-robin ordering.

4. **🏛️ Autonomous Hiring Committee Deliberation**:
   - Upon concluding the interview, the 3 AI interviewers convene in an autonomous, multi-turn debate room to discuss the candidate's performance, challenge each other's ratings, and reach a consensus hiring decision (*Strong Hire / Hire / Lean No Hire / Reject*).

5. **🎙️ Multi-Voice TTS & Voice STT**:
   - Integrated Web Speech API enables spoken candidate responses and distinct voice profiles (pitch, rate, timbre) for each interviewer.

6. **📊 360° Comprehensive Rubric & Radar Scorecard**:
   - Instant multidimensional breakdown across:
     - Technical Architecture & Depth
     - Problem Decomposition
     - Communication Clarity & STAR Structure
     - Pragmatism & Trade-off Awareness

---

## 🛠️ Architecture

```
                                 +-----------------------------------+
                                 |         CANDIDATE INTERFACE       |
                                 |  - Audio STT / Text Input         |
                                 |  - Live Dialogue Transcript       |
                                 |  - Real-time Backchannel HUD      |
                                 +-----------------+-----------------+
                                                   |
                                                   | User Response
                                                   v
                         +---------------------------------------------------+
                         |          MULTI-AGENT ORCHESTRATOR ENGINE          |
                         |  (Parallel Assessment & State Machine Evaluator)   |
                         +-------------------------+-------------------------+
                                                   |
              +------------------------------------+------------------------------------+
              |                                    |                                    |
              v                                    v                                    v
+---------------------------+        +---------------------------+        +---------------------------+
|      ALEX CHEN (Arch)     |        |      SARAH LIN (EM)       |        |     DEVON VANCE (Lead)    |
| - Architectural Depth     | <----> | - Leadership / STAR       | <----> | - Pragmatic QA & Rigor    |
| - Distributed Systems     |        | - Cultural Alignment      |        | - Anti-Buzzword Radar     |
+---------------------------+        +---------------------------+        +---------------------------+
              |                                    |                                    |
              +------------------------------------+------------------------------------+
                                                   |
                                                   v
                                 +-----------------------------------+
                                 |   AUTONOMOUS HIRING COMMITTEE     |
                                 |   - Multi-turn Agent Debate       |
                                 |   - Consensus Vote & Scorecard    |
                                 +-----------------------------------+
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or higher)
- NPM

### 1. Installation
```bash
git clone <repository-url>
cd multi-agent-interview-panel
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. API Key or Instant Demo Mode
- You can provide your **Google Gemini API Key** directly in the setup modal or via `.env.local` (`VITE_GEMINI_API_KEY=...`).
- Alternatively, toggle **"Instant Demo Simulation Mode"** to experience the full multi-agent backchannel and deliberation workflows with rich preset simulation dynamics without requiring an API key.

---

## 📦 Single-Branch & Lightweight Footprint Guarantee
- Repository contains strictly **one branch (`main`)**.
- Source code size is **< 2 MB** (excluding `node_modules`).

---

## 📄 License
MIT License - Built for the Multi-Agent AI Application Challenge.
