'use client';

import React from 'react';
import { ActivityEvent } from '../lib/midnight/contract-api';
import { Radio, ExternalLink, ShieldCheck, Lock, Award, RefreshCw } from 'lucide-react';

interface LiveActivityStreamProps {
  events: ActivityEvent[];
}

export const LiveActivityStream: React.FC<LiveActivityStreamProps> = ({ events }) => {
  const getEventBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'SEALED_BID_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            Sealed Bid
          </span>
        );
      case 'HIGHEST_BID_REVEALED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-3 h-3" />
            Winner Reveal
          </span>
        );
      case 'PHASE_TRANSITION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <RefreshCw className="w-3 h-3" />
            Phase Shift
          </span>
        );
      case 'AUCTION_INITIALIZED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-3 h-3" />
            Initialized
          </span>
        );
      case 'AUCTION_FINALIZED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-3 h-3" />
            Finalized
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/30">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Radio className="w-5 h-5 text-gold-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Live Encrypted Activity Stream</h3>
            <p className="text-xs text-slate-400">Real-time Zero-Knowledge ledger proofs on Midnight Preprod</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-midnight-900 px-3 py-1 rounded-full border border-slate-700">
          Sync: Realtime Blockstream
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-2xl bg-midnight-900/60 hover:bg-midnight-900/90 border border-slate-800/80 hover:border-gold-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {getEventBadge(evt.type)}
                <span className="text-xs text-slate-400">
                  Block #{evt.blockHeight}
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {evt.commitmentHash && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Commitment:</span>
                  <code className="font-mono text-[11px] text-gold-300 bg-midnight-950 px-2 py-0.5 rounded truncate max-w-[280px]">
                    {evt.commitmentHash}
                  </code>
                </div>
              )}

              {evt.revealedAmount && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Revealed Winner Bid:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {(Number(evt.revealedAmount) / 1_000_000).toLocaleString()} tDUST
                  </span>
                </div>
              )}
            </div>

            {/* Transaction Link */}
            <div className="flex items-center gap-3">
              <a
                href={`https://explorer.preprod.midnight.network/tx/${evt.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline bg-midnight-950 px-3 py-1.5 rounded-xl border border-cyan-500/20"
              >
                <span>{evt.txHash.slice(0, 8)}...{evt.txHash.slice(-6)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
