# Multi-Agent AI Interview Panel & Hiring Committee Simulator

An end-to-end Multi-Agent AI application specifically built to simulate an authentic, evidence-backed multi-persona hiring board evaluating candidate resumes and interview transcripts.

---

## 🏆 Challenge Requirements & System Implementation

### 1. 📋 Candidate Profile Builder & Fact Extractor
* Ingests candidate **Resume / CV** and **Verbatim Interview Transcript**.
* Automatically extracts structured ground-truth facts shared across all agents:
  - Verified technical & leadership skills
  - Claimed achievements
  - Work history
  - Verbatim transcript quotes used as evidence.
* Includes pre-configured demo candidates:
  - **Alex Mercer**: High-caliber distributed systems candidate (Strong Hire case).
  - **Jordan Hayes**: Severe resume inflation and contradiction exposed during cross-examination (Contradiction & Reject case).

### 2. 🤖 4 Specialized AI Personas (Isolated Independent Evaluation)
* **Dr. Marcus Vance (Technical Specialist)**: Assesses architectural depth, system design rigor, concurrency, and hard trade-offs.
* **Elena Rostova (HR & Culture Specialist)**: Checks communication clarity, empathy, accountability, and STAR-format behavioral structure.
* **David Sterling (Hiring Manager / ROI & Delivery)**: Evaluates business impact, delivery velocity, and hiring ROI.
* **Rachel Zane (Skeptic & Contradiction Auditor)**: Scrutinizes discrepancies between resume claims and transcript statements, hunts for unverified buzzwords.
* **🔒 Isolated Evaluation Protocol**:
  - Each agent runs its own independent evaluation *without seeing what other agents concluded* (separate parallel LLM reasoning calls).
  - **Every opinion is backed by a verbatim cited quote or direct fact** from the transcript/resume.

### 3. 🎙️ Multi-Turn Cross-Agent Voice Debate (Bonus Points Integrated!)
* Agents engage in an autonomous, structured debate where they talk **directly to each other**:
  - **Direct Rebuttals**: Agents challenge peers' assertions (e.g. Rachel challenging Marcus on unverified claims).
  - **Opinion Evolution**: Agents update and evolve their stance (`opinion_shift`) when confronted with peer evidence.
  - **Web Speech Audio**: Integrated Text-to-Speech (TTS) with distinct voice profiles, pitch, and timbre for each persona.

### 4. ⚖️ Evidence-Weighted Final Decision (Non-Simple Averaging)
* The system **does not simply average scores**.
* A sophisticated reasoning step weighs evidence confidence:
  - Fatal factual contradictions uncovered by the Skeptic Agent supersede theoretical technical claims.
  - Verifiable architectural proofs and blameless leadership execution carry high positive weight.

### 5. 📊 Comprehensive Final Decision Report
* **Final Recommendation**: `Strong Hire` | `Hire` | `Leaning No Hire` | `Reject`
* **Overall Confidence Level**: Percentage calibration
* **Evidence-Backed Strengths**: Detailed points with verbatim quote citations
* **Critical Concerns & Red Flags**: Categorized by risk severity with supporting quotes
* **Unresolved Disagreements Section**: Details specific philosophical friction points between agents (e.g. Seniority Leveling vs Risk Tolerance)
* **Vote Evolution Table**: Tracks how each agent's stance changed from before the debate to after the debate
* **One-Click Export**: Download structured JSON Scorecard and copy Markdown Summary.

---

## 🛠️ Architecture Overview

```
                                 [ Candidate Resume + Verbatim Transcript ]
                                                      |
                                                      v
                                      +-------------------------------+
                                      | 1. CANDIDATE FACT EXTRACTOR   |
                                      | (Verified Skills, Claims,     |
                                      |  Shared Direct Quotes Sheet)  |
                                      +---------------+---------------+
                                                      |
                   +----------------------------------+----------------------------------+
                   |                                  |                                  |
                   v                                  v                                  v
    +-----------------------------+    +-----------------------------+    +-----------------------------+
    | DR. MARCUS VANCE (Tech)     |    | ELENA ROSTOVA (Culture)     |    | DAVID STERLING (Hiring Mgr) |
    | Isolated Opinion + Quotes   |    | Isolated Opinion + Quotes   |    | Isolated Opinion + Quotes   |
    +--------------+--------------+    +--------------+--------------+    +--------------+--------------+
                   |                                  |                                  |
                   +----------------------------------+----------------------------------+
                                                      |
                                                      v
                                       +-----------------------------+
                                       | RACHEL ZANE (Skeptic)       |
                                       | Contradiction & Fact-Check  |
                                       +--------------+--------------+
                                                      |
                                                      v
                                 +-----------------------------------------+
                                 | 3. MULTI-TURN CROSS-AGENT VOICE DEBATE  |
                                 | (Direct Challenges, Stance Shifts & TTS)|
                                 +--------------------+--------------------+
                                                      |
                                                      v
                                 +-----------------------------------------+
                                 | 4. REASONED EVIDENCE-WEIGHTED DECISION  |
                                 | (Non-simple averaging consensus engine) |
                                 +--------------------+--------------------+
                                                      |
                                                      v
                                 +-----------------------------------------+
                                 | 5. COMPREHENSIVE FINAL REPORT           |
                                 | (Strengths, Concerns, Unresolved        |
                                 |  Disagreements & Vote Evolution)        |
                                 +-----------------------------------------+
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

### 2. Run the Application
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Usage & Modes
- **Instant Demo Mode**: Includes pre-tuned scenario simulations (Strong Hire & Contradiction cases) for zero-latency presentation without needing an API key.
- **Live Gemini 2.0 Mode**: Click **"Set Key"** in the top bar to provide your Google Gemini API Key for live LLM evaluations.

---

## 📦 Single-Branch & Lightweight Guarantee
- Strictly **1 single branch (`main`)**.
- Total repository footprint is **< 1 MB** (excluding `node_modules`).

---

## 📄 License
MIT License - Built for the Multi-Agent AI Application Challenge.
