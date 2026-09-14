'use client';

import React, { useState } from 'react';
import { WalletAccount } from '../lib/midnight/wallet-connector';
import { AetherBidLedgerState, AuctionState } from '../../contract/managed';
import { PrivateBidWitness } from '../lib/midnight/crypto-zk';
import { Award, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface RevealTallyPanelProps {
  account: WalletAccount | null;
  ledgerState: AetherBidLedgerState;
  onRevealBid: (witness: PrivateBidWitness) => { success: boolean; newHighestBid: bigint; txHash: string };
  onFinalize: () => void;
}

export const RevealTallyPanel: React.FC<RevealTallyPanelProps> = ({
  account,
  ledgerState,
  onRevealBid,
  onFinalize
}) => {
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [revealSuccess, setRevealSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [revealedTx, setRevealedTx] = useState<string>('');

  const isRevealPhase = ledgerState.auctionState === AuctionState.RevealActive;
  const isFinalized = ledgerState.auctionState === AuctionState.Finalized;

  const handleExecuteReveal = async () => {
    if (!account?.publicKey) return;

    setIsRevealing(true);
    setErrorMessage('');
    setRevealSuccess(false);

    try {
      const saved = localStorage.getItem(`aetherbid_witness_${account.publicKey}`);
      if (!saved) {
        throw new Error("No private witness found in local storage for this wallet. You must submit a sealed bid before revealing.");
      }

      const witness: PrivateBidWitness = JSON.parse(saved);
      witness.bidAmount = BigInt(witness.bidAmount);

      // Simulate ZK circuit computation delay
      await new Promise(r => setTimeout(r, 1200));

      const result = onRevealBid(witness);
      setRevealedTx(result.txHash);
      setRevealSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify and reveal winning bid proof.');
    } finally {
      setIsRevealing(false);
    }
  };

  return (
    <div className="glass-card-obsidian rounded-3xl p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Reveal & Tally Verification Interface</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Compact disclose()
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proves in Zero-Knowledge that your private bid exceeds the current highest bid without exposing non-winning bids.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-slate-300">
          Current Winner: <strong className="font-mono text-celestial-300">{ledgerState.highestBidder.slice(0, 8)}...{ledgerState.highestBidder.slice(-6)}</strong>
        </div>
      </div>

      {/* State Notices */}
      {ledgerState.auctionState === AuctionState.BiddingActive && (
        <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 flex items-center gap-3 text-xs text-slate-400 mb-6">
          <ShieldAlert className="w-4 h-4 text-celestial-400 flex-shrink-0" />
          <span>
            Bidding phase is currently active. Witness verification and tallying will be unlocked once the bidding epoch closes.
          </span>
        </div>
      )}

      {isFinalized && (
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
            <Award className="w-5 h-5" />
            <span>Auction Concluded & Finalized</span>
          </div>
          <p className="text-xs text-slate-300">
            Winning Bid: <strong className="text-white font-mono">{(Number(ledgerState.highestBid) / 1_000_000).toLocaleString()} tDUST</strong>.
          </p>
          <p className="text-xs text-slate-400 font-mono truncate">
            Winner PK: {ledgerState.highestBidder}
          </p>
        </div>
      )}

      {/* Success Notification */}
      {revealSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 space-y-1 mb-6">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Zero-Knowledge Proof Verified by Compact Smart Contract!</span>
          </div>
          <p>
            Your bid has been verified and registered as the new highest on-chain bid.
          </p>
          {revealedTx && (
            <span className="block font-mono text-[11px] text-slate-400">
              Tx: {revealedTx}
            </span>
          )}
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          disabled={!isRevealPhase || isRevealing}
          onClick={handleExecuteReveal}
          className={`py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isRevealPhase
              ? 'btn-white-pill text-obsidian-950 shadow-pill-glow'
              : 'bg-obsidian-950 border border-white/10 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isRevealing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying ZK Circuit...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Prove & Reveal Winning Bid</span>
            </>
          )}
        </button>

        <button
          disabled={!isRevealPhase}
          onClick={onFinalize}
          className={`py-3.5 px-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
            isRevealPhase
              ? 'btn-glass-pill text-white border-celestial-500/40'
              : 'bg-obsidian-950 border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>Finalize & Lock Auction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
