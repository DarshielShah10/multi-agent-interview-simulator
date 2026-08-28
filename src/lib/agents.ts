import { InterviewerId, InterviewerProfile } from '../types';

export const INTERVIEWERS: Record<InterviewerId, InterviewerProfile> = {
  alex: {
    id: 'alex',
    name: 'Alex Chen',
    title: 'Principal Distributed Systems Architect',
    companyRole: 'Technical Bar-Raiser',
    avatarBg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    primaryFocus: 'Scalability, Distributed State, Fault Tolerance, CAP Theorem & Latency Bottlenecks',
    bio: '15+ years in hyper-scale cloud architecture. Dissects architectural trade-offs with relentless precision. Cares deeply about consistency vs availability.',
    speechPitch: 0.9,
    speechRate: 0.95,
  },
  sarah: {
    id: 'sarah',
    name: 'Sarah Lin',
    title: 'Director of Engineering',
    companyRole: 'Hiring Manager & Culture Lead',
    avatarBg: 'bg-gradient-to-br from-purple-600 to-pink-500',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    primaryFocus: 'Cross-Functional Leadership, STAR Behavioral Alignment, Conflict Resolution & Ownership',
    bio: 'Seasoned engineering leader who built and scaled teams across 3 unicorn startups. Looks for empathy, clear communication, and extreme ownership.',
    speechPitch: 1.15,
    speechRate: 1.05,
  },
  devon: {
    id: 'devon',
    name: 'Devon Vance',
    title: 'Staff Platform & SRE Engineer',
    companyRole: 'Pragmatic Skeptic & Bug Hunter',
    avatarBg: 'bg-gradient-to-br from-amber-600 to-orange-500',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    primaryFocus: 'Edge Cases, Anti-Buzzword QA, Production Realities, Simplicity & Monitoring',
    bio: 'Zero tolerance for buzzwords or theoretical over-engineering. Asks: "What breaks when this hits 3 AM on Black Friday? Why not just use Postgres?"',
    speechPitch: 0.85,
    speechRate: 1.1,
  }
};

export const ROLE_PRESETS = [
  {
    role: 'Senior Full-Stack Engineer',
    level: 'Senior' as const,
    context: 'High-throughput e-commerce platform migrating from monolith to event-driven microservices.',
    openingPrompt: 'Welcome! We are excited to chat with you today. To kick things off, could you briefly introduce yourself and share a challenging production problem you recently solved and how you approached the trade-offs?'
  },
  {
    role: 'Staff Distributed Systems Architect',
    level: 'Staff / Principal' as const,
    context: 'Real-time financial telemetry engine processing 1M+ transactions/sec with strict sub-millisecond p99 SLA.',
    openingPrompt: 'Hi there. We are designing a distributed ledger pipeline requiring exactly-once semantics under network partitions. How would you approach designing such a system?'
  },
  {
    role: 'AI / LLM Platform Engineer',
    level: 'Senior' as const,
    context: 'Enterprise multi-tenant RAG and Agentic Workflow platform handling streaming inference and caching.',
    openingPrompt: 'Welcome! We are building a multi-agent orchestration infrastructure. When orchestrating subagents with potential cyclic dependencies and rate limits, how do you architect the state machine and observability?'
  },
  {
    role: 'Engineering Manager (Platform & Core Services)',
    level: 'Lead / Director' as const,
    context: 'Leading 3 distributed squads, managing technical debt vs feature velocity, and cross-team alignment.',
    openingPrompt: 'Welcome to the panel. Could you tell us about a time when your engineering team strongly pushed back against an executive deadline due to architectural debt, and how you navigated the outcome?'
  }
];
