'use client';

import React from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Globe, Database, FileCode, Check } from 'lucide-react';
import { AetherBidLedgerState } from '../../contract/managed';

interface PrivacyRadarProps {
  ledgerState?: AetherBidLedgerState;
}

export const PrivacyRadar: React.FC<PrivacyRadarProps> = ({ ledgerState }) => {
  return (
    <div className="glass-card-obsidian rounded-3xl p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Privacy Transparency Radar</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-celestial-500/10 text-celestial-300 border border-celestial-500/30">
              Midnight ZK Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-Knowledge state partitioning: What is verified on-chain vs what remains confidential in your private witness.
          </p>
        </div>
      </div>

      {/* Radar Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Public Ledger Record */}
        <div className="p-5 rounded-2xl bg-obsidian-950/80 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Globe className="w-4 h-4 text-celestial-400" />
                <span>Public Ledger Record (On-Chain)</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-celestial-950/60 text-celestial-300 border border-celestial-500/30">
                Visible to All
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-200">Cryptographic Commitment Hash:</strong>
                  <span className="text-slate-400 block font-mono text-[11px]">0x8fa3b7c9...283 (32-byte Pedersen Hash)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-200">Block Timestamp & Block Height:</strong>
                  <span className="text-slate-400 block font-mono text-[11px]">Epoch #418, Block #148942</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-200">Current Highest Verified Bid:</strong>
                  <span className="text-slate-400 block text-[11px]">Only updated upon successful ZK reveal phase</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-200">Zero-Knowledge Proof Validity:</strong>
                  <span className="text-slate-400 block text-[11px]">Mathematical proof verification result</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified by Midnight Consensus</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Right: Hidden Local Data (Private Witness) */}
        <div className="p-5 rounded-2xl bg-obsidian-950/80 border border-celestial-500/20 shadow-blue-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-celestial-300 font-semibold text-sm">
                <Lock className="w-4 h-4 text-celestial-400" />
                <span>Hidden Local Witness (Client-Only)</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                100% Confidential
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <EyeOff className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Exact Sealed Bid Amount:</strong>
                  <span className="text-slate-400 block text-[11px]">Never transmitted over network during bidding phase</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <EyeOff className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Cryptographic Salt Entropy:</strong>
                  <span className="text-slate-400 block font-mono text-[11px]">256-bit random salt stored in encrypted localStorage</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <EyeOff className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Bidder Private Key (SK):</strong>
                  <span className="text-slate-400 block text-[11px]">Secured inside Lace wallet hardware/secure enclave</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <EyeOff className="w-4 h-4 text-celestial-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Losing Bid Amounts:</strong>
                  <span className="text-slate-400 block text-[11px]">Never disclosed, even after auction completes</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-celestial-300 flex items-center justify-between">
            <span>Guaranteed by Compact ZK Circuits</span>
            <FileCode className="w-4 h-4 text-celestial-400" />
          </div>
        </div>

      </div>

    </div>
  );
};

