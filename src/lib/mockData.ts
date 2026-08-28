import { BackchannelNote, CommitteeTurn, CandidateEvaluation } from '../types';

export const MOCK_INTERVIEW_TURNS: Array<{
  speakerId: 'alex' | 'sarah' | 'devon';
  question: string;
  topic: string;
  backchannelNotes: BackchannelNote[];
}> = [
  {
    speakerId: 'sarah',
    question: "Welcome! To start, walk us through a recent high-impact project where you had to make a difficult technical trade-off between speed-to-market and long-term architectural stability. How did you align the team?",
    topic: "Technical Trade-offs & Leadership",
    backchannelNotes: [
      {
        id: 'bn-1',
        agentId: 'alex',
        targetAgentId: 'devon',
        timestamp: '00:15',
        thought: "Let's see if they bring up concrete system failure modes or stay in high-level managerial buzzwords.",
        flag: 'observation'
      },
      {
        id: 'bn-2',
        agentId: 'devon',
        targetAgentId: 'alex',
        timestamp: '00:18',
        thought: "I'll be listening for whether they tested the trade-offs under real load or just made gut assumptions.",
        flag: 'probing'
      }
    ]
  },
  {
    speakerId: 'alex',
    question: "You mentioned choosing an asynchronous event-driven model using Kafka for decoupled scaling. What happens when a downstream payment consumer falls behind during an unexpected traffic spike, creating backpressure across your broker partition? How do you guarantee idempotency?",
    topic: "Distributed Systems & Backpressure",
    backchannelNotes: [
      {
        id: 'bn-3',
        agentId: 'devon',
        targetAgentId: 'alex',
        timestamp: '01:22',
        thought: "Good catch. The candidate glossed over dead-letter queues and transaction rollback semantics.",
        flag: 'weakness',
        triggerPhrase: "event-driven decoupling"
      },
      {
        id: 'bn-4',
        agentId: 'sarah',
        targetAgentId: 'alex',
        timestamp: '01:25',
        thought: "Alex is drilling deep into the architecture. Let's see how the candidate handles technical pushback under pressure.",
        flag: 'handoff'
      }
    ]
  },
  {
    speakerId: 'devon',
    question: "Everyone loves using distributed message brokers until a partition rebalance causes a 45-second latency spike during high volatility. Why didn't you just use a robust PostgreSQL queue with SKIP LOCKED and save the cluster overhead? How did you justify the operational complexity to your on-call team?",
    topic: "Pragmatism & Operational Simplicity",
    backchannelNotes: [
      {
        id: 'bn-5',
        agentId: 'alex',
        targetAgentId: 'devon',
        timestamp: '02:40',
        thought: "Classic Devon challenge. If they can defend partition throughput limits against Postgres connection pool saturation, they earn a strong signal.",
        flag: 'probing'
      },
      {
        id: 'bn-6',
        agentId: 'sarah',
        targetAgentId: 'devon',
        timestamp: '02:44',
        thought: "Great angle on operational debt. Let's watch if they acknowledge team maintenance burden.",
        flag: 'strength'
      }
    ]
  },
  {
    speakerId: 'sarah',
    question: "When this system was deployed, how did you handle cross-functional communication when an unanticipated bug slipped into staging? Did you run a blameless post-mortem, and what systemic changes resulted?",
    topic: "Engineering Culture & Blameless Post-Mortems",
    backchannelNotes: [
      {
        id: 'bn-7',
        agentId: 'alex',
        targetAgentId: 'sarah',
        timestamp: '03:50',
        thought: "Candidate demonstrated solid architectural instincts. If their team process matches their technical caliber, I'm ready to lean Strong Hire.",
        flag: 'strength'
      },
      {
        id: 'bn-8',
        agentId: 'devon',
        targetAgentId: 'sarah',
        timestamp: '03:53',
        thought: "They handled my Postgres pushback with actual metrics instead of defensiveness. That's a rare positive signal.",
        flag: 'strength'
      }
    ]
  }
];

export const MOCK_COMMITTEE_DEBATE: CommitteeTurn[] = [
  {
    id: 'deb-1',
    agentId: 'alex',
    round: 1,
    stance: 'Hire',
    confidence: 88,
    speech: "From a distributed systems perspective, I'm voting **HIRE** with potential for Staff level. When I pressed on Kafka partition backpressure and consumer lag, they correctly identified idempotency keys with distributed Redis leases and dead-letter queues. They clearly understand the trade-offs between consistency and availability.",
    highlightCriterion: "Distributed Systems Architecture"
  },
  {
    id: 'deb-2',
    agentId: 'devon',
    round: 1,
    stance: 'Hire',
    confidence: 82,
    speech: "I started out skeptical because a lot of candidates just throw cloud buzzwords around. But when I challenged them on why not use Postgres `SKIP LOCKED` instead of maintaining a complex Kafka cluster, they gave a crisp, numbers-backed argument based on write throughput and connection pool saturation. They've actually been on-call.",
    highlightCriterion: "Pragmatism & Operational Realism"
  },
  {
    id: 'deb-3',
    agentId: 'sarah',
    round: 1,
    stance: 'Strong Hire',
    confidence: 94,
    speech: "I am upgrading my vote to **STRONG HIRE**. Beyond the solid engineering fundamentals, their STAR behavioral responses showed extreme ownership. When describing the staging regression, they instituted blameless post-mortems and automated canary deployments rather than assigning blame. That leadership maturity elevates the whole team.",
    highlightCriterion: "Leadership & STAR Behavioral Execution"
  },
  {
    id: 'deb-4',
    agentId: 'alex',
    round: 2,
    stance: 'Strong Hire',
    confidence: 92,
    speech: "Agreed with Sarah's calibration. Combining deep architectural competence with mature cross-functional leadership makes this a clear **STRONG HIRE** recommendation. Let's draft the formal offer proposal.",
    highlightCriterion: "Final Consensus Convergence"
  }
];

export const MOCK_EVALUATION: CandidateEvaluation = {
  candidateName: 'Alex Mercer',
  targetRole: 'Senior Full-Stack / Distributed Systems Engineer',
  overallScore: 91,
  hiringDecision: 'Strong Hire',
  consensusSummary: 'Unanimous Strong Hire consensus across Architecture, Operational Pragmatism, and Engineering Leadership. Demonstrated exceptional distributed state mastery, deep trade-off awareness under cross-examination, and exemplary blameless post-mortem culture.',
  dimensions: {
    systemDesign: {
      name: 'Distributed Architecture & Scaling',
      score: 9.2,
      maxScore: 10,
      feedback: 'Excellent grasp of event-driven architectures, consumer backpressure mitigation, and partition tolerance.'
    },
    technicalDepth: {
      name: 'Technical Rigor & Edge Cases',
      score: 8.8,
      maxScore: 10,
      feedback: 'Accurately handled idempotency key collision, distributed caching invalidation, and transactional boundaries.'
    },
    communicationSTAR: {
      name: 'Communication & STAR Execution',
      score: 9.5,
      maxScore: 10,
      feedback: 'Crisp, structured answers using Situation-Task-Action-Result methodology with zero hand-waving.'
    },
    pragmatismEdgeCases: {
      name: 'Operational Pragmatism & SRE Instincts',
      score: 8.9,
      maxScore: 10,
      feedback: 'Defended architectural complexity with concrete throughput metrics; prioritized on-call maintainability.'
    }
  },
  keyStrengths: [
    'Deep mastery of distributed messaging semantics, idempotency, and partition recovery.',
    'Quick, respectful, and evidence-based defense when cross-examined by cynical interviewers.',
    'Exemplary leadership in establishing blameless post-mortems and canary release gates.'
  ],
  growthAreas: [
    'Could further elaborate on multi-region active-active disaster recovery latency replication.',
    'Include more granular p99 memory profiling metrics during initial sizing estimates.'
  ],
  interviewerVotes: {
    alex: {
      stance: 'Strong Hire',
      verdict: 'Deep distributed systems acumen. Answered challenging edge cases with high precision.'
    },
    sarah: {
      stance: 'Strong Hire',
      verdict: 'Outstanding cultural and leadership signal. Demonstrated high EQ and team multiplier qualities.'
    },
    devon: {
      stance: 'Hire',
      verdict: 'Passed the anti-buzzword filter with flying colors. Practical, grounded in reality.'
    }
  }
};
