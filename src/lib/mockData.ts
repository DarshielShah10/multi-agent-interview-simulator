import { CandidateProfileData, IndependentOpinion, DebateTurn, FinalConsensusReport } from '../types';

export interface SampleCandidatePreset {
  id: string;
  name: string;
  targetRole: string;
  description: string;
  tag: string;
  profile: CandidateProfileData;
  independentOpinions: Record<string, IndependentOpinion>;
  debateTurns: DebateTurn[];
  finalReport: FinalConsensusReport;
}

export const SAMPLE_CANDIDATES: SampleCandidatePreset[] = [
  {
    id: 'candidate-strong',
    name: 'Alex Mercer',
    targetRole: 'Senior Distributed Systems Engineer',
    description: 'High technical depth, solid trade-off defense, transparent on-call experience.',
    tag: 'Strong Hire Case',
    profile: {
      candidateName: 'Alex Mercer',
      targetRole: 'Senior Distributed Systems Engineer',
      experienceYears: 7,
      resumeText: `Alex Mercer — Staff/Senior Backend Engineer
Experience:
- Senior Systems Engineer at CloudStream (2021 - Present): Designed high-throughput event processing engine handling 850k msgs/sec using Kafka and Go. Reduced p99 latency by 38%.
- Backend Engineer at DataForge (2018 - 2021): Migrated core monolith to Kubernetes microservices. Implemented distributed Redis caching layer.
Skills: Go, Distributed Systems, Kafka, Redis, PostgreSQL, Kubernetes, AWS, High Concurrency.`,
      transcriptText: `[Interviewer]: Can you explain how you guaranteed idempotency during message re-deliveries when consumer partitions rebalanced?
[Alex Mercer]: "When a consumer crashes and Kafka rebalances, in-flight messages get re-delivered. We solved this by attaching a deterministic UUIDv4 idempotency key to every incoming transaction. Downstream worker nodes write this key to a distributed Redis cluster using SET NX with a 60-second TTL before executing any state changes. If Redis returns 0, we acknowledge and drop the duplicate."

[Interviewer]: What happened when your database connection pool got exhausted during the Black Friday peak?
[Alex Mercer]: "To be honest, that was an incident I personally caused early in the migration. I misconfigured the MaxOpenConns setting on the connection pool, which overwhelmed our Postgres replica. I owned the mistake immediately in the post-mortem, wrote a blameless RCA document, and built automated canary load tests to simulate spike traffic before release."

[Interviewer]: Devon asked why not use Postgres SKIP LOCKED instead of Kafka.
[Alex Mercer]: "For workloads under 5,000 queries per second, Postgres SKIP LOCKED is wonderful and avoids maintaining a Kafka cluster. But our telemetry showed write throughput exceeding 45,000 transactions/second during flash sales. At that volume, the connection thrashing and WAL write contention on Postgres would have collapsed our storage IOPS."`,
      extractedFacts: {
        verifiedSkills: ['Kafka', 'Go', 'Distributed Redis Caching', 'PostgreSQL', 'Blameless Post-Mortem Facilitation'],
        claimedAchievements: ['Engineered 850k msg/sec event pipeline', 'Reduced p99 latency by 38%', 'Designed Redis SET NX idempotency lock'],
        workHistory: ['Senior Systems Engineer @ CloudStream (3 yrs)', 'Backend Engineer @ DataForge (3 yrs)'],
        directQuotes: [
          '"We solved this by attaching a deterministic UUIDv4 idempotency key... write to distributed Redis using SET NX with 60-second TTL"',
          '"I owned the mistake immediately in the post-mortem, wrote a blameless RCA document, and built automated canary load tests"',
          '"At 45,000 transactions/second, the connection thrashing and WAL write contention on Postgres would have collapsed our storage IOPS."'
        ]
      }
    },
    independentOpinions: {
      technical: {
        agentId: 'technical',
        stance: 'Strong Hire',
        confidenceScore: 92,
        summary: 'Exceptional mastery of distributed state, locking protocols, and storage limits under heavy concurrency.',
        keyPoints: [
          {
            point: 'Correctly implements distributed deduplication using atomic Redis SET NX with TTL leases.',
            citedQuote: '"We solved this by attaching a deterministic UUIDv4 idempotency key... write to distributed Redis using SET NX with 60-second TTL"',
            sentiment: 'positive'
          },
          {
            point: 'Demonstrated empirical knowledge of database internals and WAL contention vs streaming brokers.',
            citedQuote: '"At 45,000 transactions/second, the connection thrashing and WAL write contention on Postgres would have collapsed our storage IOPS."',
            sentiment: 'positive'
          }
        ]
      },
      culture: {
        agentId: 'culture',
        stance: 'Strong Hire',
        confidenceScore: 94,
        summary: 'High integrity, blameless mindset, and extreme ownership when acknowledging previous production outages.',
        keyPoints: [
          {
            point: 'Transparently took accountability for a past configuration outage and instituted systemic safeguards.',
            citedQuote: '"I owned the mistake immediately in the post-mortem, wrote a blameless RCA document, and built automated canary load tests"',
            sentiment: 'positive'
          }
        ]
      },
      hiring_manager: {
        agentId: 'hiring_manager',
        stance: 'Hire',
        confidenceScore: 86,
        summary: 'Candidate will ramp quickly, knows when to keep architecture simple vs when to scale up, and protects SLA.',
        keyPoints: [
          {
            point: 'Understands pragmatic architectural choices based on actual business traffic numbers.',
            citedQuote: '"For workloads under 5,000 queries per second, Postgres SKIP LOCKED is wonderful... But our telemetry showed write throughput exceeding 45,000..."',
            sentiment: 'positive'
          }
        ]
      },
      skeptic: {
        agentId: 'skeptic',
        stance: 'Hire',
        confidenceScore: 80,
        summary: 'Looked for resume inflation on the 850k msgs/sec claim. The technical explanation holds up, though multi-region disaster recovery was not detailed.',
        keyPoints: [
          {
            point: 'Defended the trade-offs with concrete technical reasoning instead of deflection.',
            citedQuote: '"At that volume, the connection thrashing and WAL write contention on Postgres would have collapsed our storage IOPS."',
            sentiment: 'positive'
          },
          {
            point: 'Note: Did not proactively describe secondary region failover in case of full Redis cluster network partition.',
            citedQuote: '"writes this key to a distributed Redis cluster"',
            sentiment: 'concerning'
          }
        ]
      }
    },
    debateTurns: [
      {
        id: 'deb-1',
        speakerId: 'technical',
        targetAgentId: 'skeptic',
        responseType: 'agreement',
        speech: "I reviewed Rachel's concern regarding Redis cluster network partitions. While Alex didn't spend time detailing multi-region cross-datacenter replication, their answer on UUIDv4 idempotency with `SET NX` proves they have hands-on distributed systems depth that few candidates possess.",
        revisedStance: 'Strong Hire',
        revisedConfidence: 94
      },
      {
        id: 'deb-2',
        speakerId: 'skeptic',
        targetAgentId: 'technical',
        responseType: 'opinion_shift',
        speech: "Fair point, Dr. Vance. I specifically scrutinized the resume claim of 'handling 850k msgs/sec' to catch typical buzzword padding. When pressed, Alex didn't just repeat marketing bullet points; they cited Postgres WAL saturation numbers and connection pool crashes. I am upgrading my stance from Leaning Hire to a solid **HIRE**.",
        revisedStance: 'Hire',
        revisedConfidence: 88,
        stanceShiftReason: "Verified that technical answers contained authentic operational depth rather than memorized theory."
      },
      {
        id: 'deb-3',
        speakerId: 'culture',
        targetAgentId: 'hiring_manager',
        responseType: 'agreement',
        speech: "David, what stands out from a team culture perspective is their psychological safety in admitting faults. Quote: *'I owned the mistake immediately in the post-mortem'*. That attitude prevents recurring outages and multiplies team performance.",
        revisedStance: 'Strong Hire',
        revisedConfidence: 96
      },
      {
        id: 'deb-4',
        speakerId: 'hiring_manager',
        targetAgentId: 'culture',
        responseType: 'opinion_shift',
        speech: "Given Elena's culture signal and Rachel's verified fact-check on the throughput metrics, I am upgrading my stance from Hire to **STRONG HIRE**. The business value and technical velocity they bring far outweigh the remaining ramp-up on multi-region failover.",
        revisedStance: 'Strong Hire',
        revisedConfidence: 95,
        stanceShiftReason: "Consensus reached that candidate combines high technical bar with blameless leadership execution."
      }
    ],
    finalReport: {
      candidateName: 'Alex Mercer',
      targetRole: 'Senior Distributed Systems Engineer',
      finalRecommendation: 'Strong Hire',
      overallConfidence: 93,
      decisionRationale: 'Unanimous Strong Hire consensus reached across Technical Depth, Culture, Hiring Value, and Fact-Checking. The candidate substantiated high-throughput architectural claims with concrete concurrency algorithms and demonstrated blameless post-mortem maturity.',
      evidenceWeightingExplanation: 'Rather than simple averaging, the committee placed primary weight on the verified technical proofs (Redis idempotency & WAL bottlenecks) combined with the Skeptic Agent validating resume claims. Culture metrics reinforced the decision with high leadership upside.',
      dimensionScores: {
        technicalCompetence: { score: 9.4, maxScore: 10, weight: 0.35 },
        culturalIntegrity: { score: 9.6, maxScore: 10, weight: 0.25 },
        businessImpactROI: { score: 9.2, maxScore: 10, weight: 0.25 },
        riskFactorInverse: { score: 8.8, maxScore: 10, weight: 0.15 }
      },
      keyStrengths: [
        {
          title: 'Distributed State & Idempotency Mastery',
          detail: 'Demonstrated precise implementation knowledge of atomic Redis keys with TTL leases to prevent race conditions during partition rebalance.',
          supportingQuote: '"We solved this by attaching a deterministic UUIDv4 idempotency key... write to distributed Redis using SET NX with 60-second TTL"'
        },
        {
          title: 'Blameless Post-Mortem Culture & Radical Candor',
          detail: 'Proactively volunteered past configuration failures and explained how automated canary tests were engineered to prevent recurrence.',
          supportingQuote: '"I owned the mistake immediately in the post-mortem, wrote a blameless RCA document, and built automated canary load tests"'
        }
      ],
      criticalConcerns: [
        {
          title: 'Multi-Region Failover Architecture',
          detail: 'Candidate focused primarily on single-region cluster scaling without expanding on cross-region active-active disaster recovery.',
          supportingQuote: '"writes this key to a distributed Redis cluster"',
          severity: 'low'
        }
      ],
      unresolvedDisagreements: [
        {
          topic: 'Seniority Level Banding (Senior vs Staff)',
          agentAPerspective: {
            agentId: 'technical',
            point: 'Dr. Vance argued candidate demonstrated Staff-level distributed systems depth based on Postgres WAL bottleneck analysis.'
          },
          agentBPerspective: {
            agentId: 'hiring_manager',
            point: 'David Sterling recommended leveling at Senior Engineer initially until multi-region DR capabilities are proven on the job.'
          },
          impactOnDecision: 'Consensus agreed on Strong Hire at Senior Level with an accelerated 6-month Staff promotion roadmap.'
        }
      ],
      individualAgentFinalVotes: {
        technical: { initialStance: 'Strong Hire', finalStance: 'Strong Hire', finalVerdict: 'World-class distributed systems acumen and deep storage understanding.', changedMind: false },
        culture: { initialStance: 'Strong Hire', finalStance: 'Strong Hire', finalVerdict: 'Outstanding integrity, team-first mentality, and extreme accountability.', changedMind: false },
        hiring_manager: { initialStance: 'Hire', finalStance: 'Strong Hire', finalVerdict: 'Upgraded during debate after verifying real-world throughput capabilities.', changedMind: true },
        skeptic: { initialStance: 'Hire', finalStance: 'Hire', finalVerdict: 'Fact-checks validated; technical explanations matched the resume claims.', changedMind: true }
      }
    }
  },
  {
    id: 'candidate-contradiction',
    name: 'Jordan Hayes',
    targetRole: 'Lead Cloud Architect',
    description: 'Claimed to build a global multi-region cloud platform, but exposed by the Skeptic Agent for severe resume exaggeration.',
    tag: 'Contradiction / Red Flag Demo',
    profile: {
      candidateName: 'Jordan Hayes',
      targetRole: 'Lead Cloud Architect',
      experienceYears: 6,
      resumeText: `Jordan Hayes — Lead Cloud & Microservices Architect
Experience:
- Principal Architect at GlobalCloud (2022 - Present): Architected end-to-end multi-region active-active Kubernetes clusters spanning 4 continents. Sole author of the distributed consensus protocol.
- Senior DevOps Engineer at AppFlow (2019 - 2022): Built all Terraform automation for 500+ AWS instances.
Skills: Multi-region Kubernetes, Raft Consensus, Distributed Databases, Terraform, Global Traffic Management.`,
      transcriptText: `[Interviewer]: You listed on your resume that you were the 'sole author of the distributed consensus protocol for active-active multi-region clusters'. Could you explain your Raft quorum heartbeats across inter-region latency?
[Jordan Hayes]: "Well, to be clear, our principal infrastructure architect who left the company had set up the initial Raft quorum code in etcd. I mostly helped write the Helm chart parameters and adjusted the timeout variables."

[Interviewer]: When the inter-region WAN connection was severed, how did your split-brain prevention handle partition recovery?
[Jordan Hayes]: "Actually, the network operations team handled all the routing. Whenever that happened, we usually just restarted the pods in the primary region until the alerts cleared."

[Interviewer]: How did you resolve the team conflict when your architectural changes caused downtime?
[Jordan Hayes]: "The QA team didn't run the full regression test suite in staging before giving the green light. It was their oversight for not catching the configuration drift."`,
      extractedFacts: {
        verifiedSkills: ['Helm Charts', 'Basic Kubernetes Pod Restarts', 'Configuration Tuning'],
        claimedAchievements: ['Sole author of distributed consensus protocol', 'Architected multi-region active-active clusters across 4 continents'],
        workHistory: ['Principal Architect @ GlobalCloud', 'DevOps @ AppFlow'],
        directQuotes: [
          '"Well, to be clear, our principal infrastructure architect who left... set up the initial Raft quorum code... I mostly helped write the Helm chart parameters"',
          '"Whenever that happened, we usually just restarted the pods in the primary region until the alerts cleared."',
          '"The QA team didn\'t run the full regression test suite... It was their oversight for not catching the configuration drift."'
        ]
      }
    },
    independentOpinions: {
      technical: {
        agentId: 'technical',
        stance: 'Leaning No Hire',
        confidenceScore: 78,
        summary: 'Resume claims deep distributed consensus design, but candidate could not explain partition quorum or split-brain resolution.',
        keyPoints: [
          {
            point: 'Admits they did not write the consensus protocol as claimed, but merely edited Helm parameters.',
            citedQuote: '"Well, to be clear, our principal infrastructure architect who left... set up the initial Raft quorum code... I mostly helped write the Helm chart parameters"',
            sentiment: 'concerning'
          }
        ]
      },
      culture: {
        agentId: 'culture',
        stance: 'Reject',
        confidenceScore: 92,
        summary: 'Blaming QA for production outages demonstrates severe lack of ownership and negative leadership impact.',
        keyPoints: [
          {
            point: 'Shifted responsibility for production downtime entirely onto QA team.',
            citedQuote: '"The QA team didn\'t run the full regression test suite... It was their oversight for not catching the configuration drift."',
            sentiment: 'concerning'
          }
        ]
      },
      hiring_manager: {
        agentId: 'hiring_manager',
        stance: 'Leaning No Hire',
        confidenceScore: 75,
        summary: 'Candidate may have some cloud deployment skills, but hiring at the Lead Architect level would be a catastrophic mismatch.',
        keyPoints: [
          {
            point: 'Operational triage technique was crude pod restarts rather than root cause resolution.',
            citedQuote: '"Whenever that happened, we usually just restarted the pods in the primary region until the alerts cleared."',
            sentiment: 'concerning'
          }
        ]
      },
      skeptic: {
        agentId: 'skeptic',
        stance: 'Reject',
        confidenceScore: 98,
        summary: 'Major resume fraud detected. Direct contradiction between "Sole author of consensus protocol" and admitting they only wrote Helm parameters.',
        keyPoints: [
          {
            point: 'Direct contradiction with resume claim.',
            citedQuote: '"Well, to be clear, our principal infrastructure architect who left... set up the initial Raft quorum code... I mostly helped write the Helm chart parameters"',
            sentiment: 'concerning'
          },
          {
            point: 'Passed blame to external teams when questioned on architectural flaws.',
            citedQuote: '"The QA team didn\'t run the full regression test suite... It was their oversight"',
            sentiment: 'concerning'
          }
        ]
      }
    },
    debateTurns: [
      {
        id: 'deb-c1',
        speakerId: 'skeptic',
        targetAgentId: 'technical',
        responseType: 'challenge',
        speech: "Dr. Vance and David, look at the resume claim: *'Sole author of distributed consensus protocol'*. When asked a basic Raft question, they immediately confessed another architect wrote it and they just adjusted Helm YAML. This is not just an exaggeration; it is deliberate misrepresentation.",
        revisedStance: 'Reject',
        revisedConfidence: 99
      },
      {
        id: 'deb-c2',
        speakerId: 'technical',
        targetAgentId: 'skeptic',
        responseType: 'opinion_shift',
        speech: "Rachel is completely right. I initially gave them leeway thinking they might have contributed to consensus algorithms, but their answers on split-brain recovery (*'we just restarted the pods until alerts cleared'*) shows a dangerous lack of architectural competence. I am changing my vote from Leaning No Hire to **REJECT**.",
        revisedStance: 'Reject',
        revisedConfidence: 95,
        stanceShiftReason: "Skeptic Agent proved direct fabrication of resume claims and dangerous triage habits."
      },
      {
        id: 'deb-c3',
        speakerId: 'culture',
        targetAgentId: 'hiring_manager',
        responseType: 'agreement',
        speech: "When coupled with their immediate finger-pointing at QA (*'It was their oversight'*), this candidate will poison engineering team trust. There is zero psychological safety here.",
        revisedStance: 'Reject',
        revisedConfidence: 98
      },
      {
        id: 'deb-c4',
        speakerId: 'hiring_manager',
        targetAgentId: 'skeptic',
        responseType: 'opinion_shift',
        speech: "Based on the clear factual contradictions surfaced by Rachel and validated by Marcus and Elena, I am moving my stance to **UNANIMOUS REJECT**. The risk of architectural failure and cultural toxicity is unacceptable.",
        revisedStance: 'Reject',
        revisedConfidence: 98,
        stanceShiftReason: "Unanimous consensus reached on resume misrepresentation and lack of engineering accountability."
      }
    ],
    finalReport: {
      candidateName: 'Jordan Hayes',
      targetRole: 'Lead Cloud Architect',
      finalRecommendation: 'Reject',
      overallConfidence: 98,
      decisionRationale: 'Unanimous Reject consensus. The Skeptic Agent exposed severe factual contradictions between resume claims and interview statements. The candidate lacked core distributed systems competency and demonstrated destructive blame-shifting behavior.',
      evidenceWeightingExplanation: 'The decision was driven by the Skeptic Agent uncovering fatal contradictions backed by direct quote evidence, which triggered a complete consensus shift during the debate stage.',
      dimensionScores: {
        technicalCompetence: { score: 3.2, maxScore: 10, weight: 0.35 },
        culturalIntegrity: { score: 2.1, maxScore: 10, weight: 0.25 },
        businessImpactROI: { score: 3.5, maxScore: 10, weight: 0.25 },
        riskFactorInverse: { score: 1.5, maxScore: 10, weight: 0.15 }
      },
      keyStrengths: [
        {
          title: 'Basic Helm & YAML Configuration',
          detail: 'Has familiarity deploying standard Helm charts and adjusting pod timeout parameters.',
          supportingQuote: '"I mostly helped write the Helm chart parameters and adjusted the timeout variables."'
        }
      ],
      criticalConcerns: [
        {
          title: 'Direct Resume Misrepresentation / Integrity Red Flag',
          detail: 'Falsely claimed to be the sole author of an active-active consensus engine; confessed during cross-examination that another engineer built it.',
          supportingQuote: '"Well, to be clear, our principal infrastructure architect who left... set up the initial Raft quorum code"',
          severity: 'high'
        },
        {
          title: 'Blame Shifting & Lack of Ownership',
          detail: 'Refused to take responsibility for configuration regressions, blaming staging QA engineers.',
          supportingQuote: '"The QA team didn\'t run the full regression test suite... It was their oversight"',
          severity: 'high'
        },
        {
          title: 'Superficial Incident Triage Habits',
          detail: 'Mitigated distributed split-brain partition failures by blindly restarting pods instead of diagnosing network state.',
          supportingQuote: '"Whenever that happened, we usually just restarted the pods in the primary region until the alerts cleared."',
          severity: 'high'
        }
      ],
      unresolvedDisagreements: [],
      individualAgentFinalVotes: {
        technical: { initialStance: 'Leaning No Hire', finalStance: 'Reject', finalVerdict: 'Pivoted to Reject during debate after verifying fabricated consensus claims.', changedMind: true },
        culture: { initialStance: 'Reject', finalStance: 'Reject', finalVerdict: 'Toxic blame-shifting onto QA team.', changedMind: false },
        hiring_manager: { initialStance: 'Leaning No Hire', finalStance: 'Reject', finalVerdict: 'Pivoted to Reject after reviewing the severity of factual discrepancies.', changedMind: true },
        skeptic: { initialStance: 'Reject', finalStance: 'Reject', finalVerdict: 'Surfaced core contradictions that dismantled the candidate profile.', changedMind: false }
      }
    }
  }
];
