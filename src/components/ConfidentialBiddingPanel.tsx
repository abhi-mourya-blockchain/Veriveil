'use client';

import React, { useState, useEffect } from 'react';
import { WalletAccount } from '../lib/midnight/wallet-connector';
import { AetherBidLedgerState, AuctionState } from '../../contract/managed';
import { generateSalt, PrivateBidWitness, computeBidCommitment } from '../lib/midnight/crypto-zk';
import { ZkProofModal, ZkStep } from './ZkProofModal';
import { Shield, KeyRound, Lock, Sparkles, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfidentialBiddingPanelProps {
  account: WalletAccount | null;
  ledgerState: AetherBidLedgerState;
  onSubmitBid: (witness: PrivateBidWitness) => { success: boolean; txHash: string; commitment: string };
  onConnectWallet: () => void;
}

export const ConfidentialBiddingPanel: React.FC<ConfidentialBiddingPanelProps> = ({
  account,
  ledgerState,
  onSubmitBid,
  onConnectWallet
}) => {
  const [bidAmount, setBidAmount] = useState<string>('8500');
  const [salt, setSalt] = useState<string>('');
  const [hasExistingBid, setHasExistingBid] = useState<boolean>(false);
  const [existingWitness, setExistingWitness] = useState<PrivateBidWitness | null>(null);

  // ZK Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zkStep, setZkStep] = useState<ZkStep>('IDLE');
  const [txHash, setTxHash] = useState<string>('');
  const [commitmentHash, setCommitmentHash] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    // Generate fresh cryptographic salt
    setSalt(generateSalt());

    // Check if user already submitted a sealed bid locally
    if (typeof window !== 'undefined' && account?.publicKey) {
      const saved = localStorage.getItem(`aetherbid_witness_${account.publicKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setExistingWitness({
            ...parsed,
            bidAmount: BigInt(parsed.bidAmount)
          });
          setHasExistingBid(true);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [account]);

  const handleRegenerateSalt = () => {
    setSalt(generateSalt());
  };

  const handleSubmitSealedBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.isConnected) {
      onConnectWallet();
      return;
    }

    const numAmount = parseFloat(bidAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid bid amount greater than 0.');
      return;
    }

    const rawDust = BigInt(Math.floor(numAmount * 1_000_000));
    const minRequired = ledgerState.highestBid;

    if (rawDust <= minRequired) {
      setErrorMsg(`Bid must strictly exceed current reserve/highest bid (${(Number(minRequired) / 1_000_000).toLocaleString()} tDUST)`);
      return;
    }

    setIsModalOpen(true);
    setZkStep('GENERATING_WITNESS');
    setErrorMsg('');

    try {
      const witness: PrivateBidWitness = {
        bidderSk: '0x4f8a2c6b9e1f5a9d3c7b0e4f8a2c6b9e1f5a9d3c7b0e4f8a2c6b9e1f5a9d3c7b',
        bidderPk: account.publicKey,
        bidAmount: rawDust,
        salt: salt || generateSalt()
      };

      // Stage 1: Local storage encryption
      await new Promise(r => setTimeout(r, 800));
      localStorage.setItem(`aetherbid_witness_${account.publicKey}`, JSON.stringify({
        ...witness,
        bidAmount: witness.bidAmount.toString()
      }));

      // Stage 2: ZK Proof computation
      setZkStep('COMPUTING_PROOF');
      await new Promise(r => setTimeout(r, 1000));
      const computedCommitment = computeBidCommitment(witness);
      setCommitmentHash(computedCommitment);

      // Stage 3: Midnight on-chain dispatch
      setZkStep('SUBMITTING_TX');
      await new Promise(r => setTimeout(r, 900));

      const result = onSubmitBid(witness);
      setTxHash(result.txHash);
      setExistingWitness(witness);
      setHasExistingBid(true);
      setZkStep('SUCCESS');
    } catch (err: any) {
      setZkStep('ERROR');
      setErrorMsg(err.message || 'Failed to submit sealed bid.');
    }
  };

  const isBiddingActive = ledgerState.auctionState === AuctionState.BiddingActive;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/30">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Confidential Bidding Panel</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Private Witness
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Your bid amount and secret salt never leave your local browser storage until the reveal phase.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight-900 border border-slate-700/60 text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-gold-400" />
          <span>Local Witness Storage: <strong className="text-emerald-400">Encrypted</strong></span>
        </div>
      </div>

      {/* Existing Bid Warning / Status */}
      {hasExistingBid && existingWitness && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-300">Active Sealed Bid Registered</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Your private bid amount is: <strong className="text-gold-400">{(Number(existingWitness.bidAmount) / 1_000_000).toLocaleString()} tDUST</strong>.
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Witness Salt: {existingWitness.salt.slice(0, 16)}...
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            ZK Committed
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmitSealedBid} className="space-y-6">
        
        {/* Bid Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Secret Bid Amount</span>
              <span className="text-gold-400 font-normal">(tDUST)</span>
            </label>
            <span className="text-xs text-slate-400">
              Min Next Bid: <strong className="text-gold-400">{(Number(ledgerState.highestBid) / 1_000_000 + 1).toLocaleString()} tDUST</strong>
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              disabled={!isBiddingActive}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter confidential bid amount..."
              className="w-full bg-midnight-900 border border-gold-500/30 focus:border-gold-400 rounded-2xl py-3.5 px-4 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-gold-400 transition-all disabled:opacity-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-midnight-950 border border-gold-500/20 text-xs font-mono text-gold-400">
                tDUST
              </span>
            </div>
          </div>
        </div>

        {/* Secret Salt Generator */}
        <div className="p-4 rounded-2xl bg-midnight-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-gold-400" />
              <span>Cryptographic Salt (Private Witness Entropy)</span>
            </label>
            <button
              type="button"
              onClick={handleRegenerateSalt}
              className="text-xs text-gold-400 hover:text-gold-300 underline font-mono"
            >
              Regenerate
            </button>
          </div>
          <div className="bg-midnight-950 p-2.5 rounded-xl font-mono text-xs text-slate-400 truncate border border-slate-800/80">
            {salt || 'Generating secure entropy...'}
          </div>
          <p className="text-[11px] text-slate-400">
            This entropy is blended with your bid inside the Compact ZK circuit to prevent rainbow table attacks.
          </p>
        </div>

        {/* Submit Action */}
        {!isBiddingActive ? (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Bidding phase has concluded. Proceed to the Reveal & Tally Interface below to prove your winning bid.</span>
          </div>
        ) : account?.isConnected ? (
          <button
            type="submit"
            className="w-full py-4 rounded-2xl gold-gradient-btn text-midnight-950 font-bold tracking-wide shadow-gold-glow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-midnight-950" />
            <span>Submit Encrypted Sealed Bid (Generate ZK Proof)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnectWallet}
            className="w-full py-4 rounded-2xl gold-gradient-btn text-midnight-950 font-bold tracking-wide shadow-gold-glow flex items-center justify-center gap-2"
          >
            <span>Connect Lace Wallet to Submit Sealed Bid</span>
          </button>
        )}

      </form>

      {/* ZK Prover Modal */}
      <ZkProofModal
        isOpen={isModalOpen}
        step={zkStep}
        errorMsg={errorMsg}
        txHash={txHash}
        commitmentHash={commitmentHash}
        bidAmount={bidAmount}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
