import React from 'react';
import { CandidateProfileData } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, FileText, Quote } from 'lucide-react';

interface TruthMatrixProps {
  profile: CandidateProfileData;
  candidateId?: string;
}

interface ClaimVerificationItem {
  id: string;
  resumeClaim: string;
  transcriptQuote: string;
  status: 'verified' | 'exaggerated' | 'contradiction';
  auditorVerdict: string;
  confidenceScore: number;
}

export const TruthMatrix: React.FC<TruthMatrixProps> = ({ profile, candidateId }) => {
  // Generate claim verifications based on candidate
  const getVerificationData = (): ClaimVerificationItem[] => {
    if (candidateId === 'candidate-contradiction' || profile.candidateName.includes('Jordan')) {
      return [
        {
          id: 'claim-1',
          resumeClaim: 'Sole author of the distributed consensus protocol for active-active multi-region clusters',
          transcriptQuote: '"Well, to be clear, our principal infrastructure architect who left the company had set up the initial Raft quorum code in etcd. I mostly helped write the Helm chart parameters..."',
          status: 'contradiction',
          auditorVerdict: 'FATAL CONTRADICTION: Candidate admitted another architect wrote the protocol; candidate only adjusted Helm variables.',
          confidenceScore: 99
        },
        {
          id: 'claim-2',
          resumeClaim: 'Architected end-to-end multi-region active-active Kubernetes clusters across 4 continents',
          transcriptQuote: '"Whenever that happened, we usually just restarted the pods in the primary region until the alerts cleared."',
          status: 'contradiction',
          auditorVerdict: 'SUPERFICIAL TRIAGE: Inability to articulate partition recovery; relied on crude pod restarts.',
          confidenceScore: 95
        },
        {
          id: 'claim-3',
          resumeClaim: 'Built all Terraform automation for 500+ AWS instances',
          transcriptQuote: '"The QA team didn\'t run the full regression test suite... It was their oversight for not catching the configuration drift."',
          status: 'exaggerated',
          auditorVerdict: 'BLAME SHIFTING: Refused to take ownership of staging configuration regressions.',
          confidenceScore: 92
        }
      ];
    }

    if (candidateId === 'candidate-ai' || profile.candidateName.includes('Priya')) {
      return [
        {
          id: 'claim-ai-1',
          resumeClaim: 'Built multi-tenant LLM serving gateway with semantic caching and vLLM; cut token costs by 42%',
          transcriptQuote: '"We deployed an exact & semantic Redis cache tier that intercepts redundant subagent queries, saving over 40% of downstream API invocations."',
          status: 'verified',
          auditorVerdict: 'VERIFIED: Semantic cache hit rate architecture corroborates the 42% cost reduction metrics.',
          confidenceScore: 96
        },
        {
          id: 'claim-ai-2',
          resumeClaim: 'Engineered multi-agent orchestration infrastructure with guardrails',
          transcriptQuote: '"We implemented an explicit directed acyclic state machine with a hard recursion depth limit of 8 steps and budget token caps per run."',
          status: 'verified',
          auditorVerdict: 'VERIFIED: Concrete deterministic DAG guardrails prevent infinite token loops.',
          confidenceScore: 98
        }
      ];
    }

    // Default: Alex Mercer
    return [
      {
        id: 'claim-def-1',
        resumeClaim: 'Designed high-throughput event processing engine handling 850k msgs/sec using Kafka and Go',
        transcriptQuote: '"Our telemetry showed write throughput exceeding 45,000 transactions/second during flash sales... WAL write contention on Postgres would have collapsed our storage IOPS."',
        status: 'verified',
        auditorVerdict: 'VERIFIED: Defended Kafka throughput necessity with concrete database storage IOPS limits.',
        confidenceScore: 94
      },
      {
        id: 'claim-def-2',
        resumeClaim: 'Implemented distributed Redis caching layer and idempotency guarantees',
        transcriptQuote: '"We solved this by attaching a deterministic UUIDv4 idempotency key... write to distributed Redis cluster using SET NX with 60-second TTL..."',
        status: 'verified',
        auditorVerdict: 'VERIFIED: Precise algorithm implementation using atomic Redis SET NX with TTL lease.',
        confidenceScore: 97
      },
      {
        id: 'claim-def-3',
        resumeClaim: 'Reduced p99 latency by 38% and managed high-scale production migrations',
        transcriptQuote: '"I misconfigured the MaxOpenConns setting... I owned the mistake immediately in the post-mortem, wrote a blameless RCA..."',
        status: 'verified',
        auditorVerdict: 'HIGH INTEGRITY: Transparently volunteered past production outage and instituted systemic canary tests.',
        confidenceScore: 96
      }
    ];
  };

  const claims = getVerificationData();

  const getStatusBadge = (status: ClaimVerificationItem['status']) => {
    switch (status) {
      case 'verified':
        return {
          label: 'VERIFIED CLAIM',
          icon: CheckCircle2,
          color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/60'
        };
      case 'exaggerated':
        return {
          label: 'EXAGGERATED CLAIM',
          icon: AlertTriangle,
          color: 'text-amber-400 bg-amber-950/80 border-amber-500/60'
        };
      default:
        return {
          label: 'CONTRADICTION / RED FLAG',
          icon: XCircle,
          color: 'text-rose-400 bg-rose-950/80 border-rose-500/60 animate-pulse'
        };
    }
  };

  return (
    <div className="bg-boardroom-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Rachel Zane's Skeptic Audit Engine
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Resume vs. Transcript Truth Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated factual cross-referencing comparing resume claims against verbatim interview transcript quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-boardroom-850 border border-slate-800 text-slate-300">
            {claims.filter(c => c.status === 'verified').length} Verified • {claims.filter(c => c.status === 'contradiction').length} Red Flags
          </span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-4">
        {claims.map((item) => {
          const badge = getStatusBadge(item.status);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={item.id}
              className={`p-4 md:p-5 rounded-2xl border transition-all ${
                item.status === 'contradiction'
                  ? 'bg-rose-950/20 border-rose-900/60 ring-1 ring-rose-500/30'
                  : 'bg-boardroom-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${badge.color}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Audit Confidence: <span className="text-white font-bold">{item.confidenceScore}%</span>
                </span>
              </div>

              {/* Side-by-Side Claim vs Quote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Resume Claim */}
                <div className="p-3.5 rounded-xl bg-boardroom-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-400" /> Resume / CV Stated Claim:
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {item.resumeClaim}
                  </p>
                </div>

                {/* Transcript Quote */}
                <div className="p-3.5 rounded-xl bg-boardroom-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Quote className="w-3 h-3 text-purple-400" /> Verbatim Transcript Quote:
                  </span>
                  <p className="text-slate-300 italic leading-relaxed">
                    {item.transcriptQuote}
                  </p>
                </div>
              </div>

              {/* Auditor Verdict */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                <span className="font-bold text-slate-300">Skeptic Auditor Finding:</span>{' '}
                <span className={item.status === 'contradiction' ? 'text-rose-300 font-semibold' : 'text-slate-300'}>
                  {item.auditorVerdict}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
