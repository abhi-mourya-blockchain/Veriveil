'use client';

import React, { useState, useEffect } from 'react';
import { AuctionState, AetherBidLedgerState } from '../../contract/managed';
import { Timer, EyeOff, Lock, Users, Sparkles, ShieldCheck, Award } from 'lucide-react';

interface FeaturedAuctionProps {
  ledgerState: AetherBidLedgerState;
  onPhaseChange?: () => void;
}

export const FeaturedAuction: React.FC<FeaturedAuctionProps> = ({ ledgerState, onPhaseChange }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = () => {
    switch (ledgerState.auctionState) {
      case AuctionState.BiddingActive:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SEALED BIDS ACTIVE</span>
          </div>
        );
      case AuctionState.RevealActive:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>REVEAL & TALLY PHASE</span>
          </div>
        );
      case AuctionState.Finalized:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>AUCTION FINALIZED</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card-obsidian rounded-3xl p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-celestial-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Luxury Item Showcase */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square bg-obsidian-950 flex items-center justify-center p-4">
            
            {/* Holographic Dial Visual */}
            <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-950 via-obsidian-900 to-celestial-950/30 opacity-90"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-36 h-36 rounded-full border border-dashed border-celestial-400/40 p-2 flex items-center justify-center animate-spin-slow">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-celestial-500 via-indigo-600 to-white p-[2px] shadow-blue-glow flex items-center justify-center">
                  <div className="w-full h-full bg-obsidian-950 rounded-full flex flex-col items-center justify-center p-2 text-center">
                    <Sparkles className="w-6 h-6 text-celestial-300 mb-1" />
                    <span className="text-[10px] font-mono text-celestial-300 font-bold uppercase">ZK PROOF</span>
                    <span className="text-[9px] text-slate-400">Midnight Genesis</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-obsidian-900 border border-white/10 text-celestial-300">
                  Item ID: #MID-ZK-8801
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-white/10 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-celestial-400" />
                Zero-Knowledge Encrypted
              </span>
              <span className="text-emerald-400 font-mono font-medium">Compact V3</span>
            </div>
          </div>
        </div>

        {/* Item Information & Live Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              {getStatusBadge()}
              
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-obsidian-950/80 px-3 py-1 rounded-full border border-white/10">
                <Users className="w-3.5 h-3.5 text-celestial-400" />
                <span>{ledgerState.totalBidsCount.toString()} Confidential Bids</span>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide mb-2">
              {ledgerState.item.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {ledgerState.item.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Current Verified Reserve / Highest Disclosed */}
            <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>
                  {ledgerState.auctionState === AuctionState.RevealActive || ledgerState.auctionState === AuctionState.Finalized
                    ? "Highest Verified Bid"
                    : "Initial Reserve Floor"}
                </span>
                <ShieldCheck className="w-4 h-4 text-celestial-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                <span>{(Number(ledgerState.highestBid) / 1_000_000).toLocaleString()}</span>
                <span className="text-xs text-celestial-400 font-sans">tDUST</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-celestial-400" />
                {ledgerState.auctionState === AuctionState.BiddingActive 
                  ? "Active bids hidden via private witnesses"
                  : "Cryptographically verified on Midnight"}
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Phase Remaining Time</span>
                <Timer className="w-4 h-4 text-celestial-400" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center" suppressHydrationWarning>
                <div className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10">
                  <div className="text-lg font-bold font-mono text-white" suppressHydrationWarning>{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Hours</div>
                </div>
                <div className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10">
                  <div className="text-lg font-bold font-mono text-white" suppressHydrationWarning>{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Mins</div>
                </div>
                <div className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10">
                  <div className="text-lg font-bold font-mono text-celestial-300" suppressHydrationWarning>{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Secs</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Network: Midnight Preprod Epoch #418
              </p>
            </div>

          </div>

          {/* Phase Control for Demo/Simulation */}
          {onPhaseChange && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Simulation Mode Toggle:</span>
              <button
                onClick={onPhaseChange}
                className="px-3 py-1.5 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 text-celestial-300 border border-celestial-500/30 transition-colors"
              >
                {ledgerState.auctionState === AuctionState.BiddingActive
                  ? "Advance to Reveal Phase ➔"
                  : ledgerState.auctionState === AuctionState.RevealActive
                  ? "Finalize Auction ➔"
                  : "Reset to Bidding Phase ↺"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

