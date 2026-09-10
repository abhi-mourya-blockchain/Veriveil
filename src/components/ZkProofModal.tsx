'use client';

import React from 'react';
import { Shield, CheckCircle, Loader2, Sparkles, X, ExternalLink } from 'lucide-react';

export type ZkStep = 'IDLE' | 'GENERATING_WITNESS' | 'COMPUTING_PROOF' | 'SUBMITTING_TX' | 'SUCCESS' | 'ERROR';

interface ZkProofModalProps {
  isOpen: boolean;
  step: ZkStep;
  errorMsg?: string;
  txHash?: string;
  commitmentHash?: string;
  bidAmount?: string;
  onClose: () => void;
}

export const ZkProofModal: React.FC<ZkProofModalProps> = ({
  isOpen,
  step,
  errorMsg,
  txHash,
  commitmentHash,
  bidAmount,
  onClose
}) => {
  if (!isOpen) return null;

  const stepsList = [
    {
      id: 'GENERATING_WITNESS',
      title: 'Generating Private Witness',
      desc: 'Encrypting bid amount and cryptographic salt in local memory.'
    },
    {
      id: 'COMPUTING_PROOF',
      title: 'Computing Zero-Knowledge Proof',
      desc: 'Running Compact ZK circuit to derive sealed commitment hash.'
    },
    {
      id: 'SUBMITTING_TX',
      title: 'Submitting to Midnight Preprod',
      desc: 'Broadcasting proof to Midnight network ledger node.'
    }
  ];

  const getStepStatus = (index: number) => {
    const order = ['GENERATING_WITNESS', 'COMPUTING_PROOF', 'SUBMITTING_TX', 'SUCCESS'];
    const currentIdx = order.indexOf(step);
    if (step === 'SUCCESS') return 'complete';
    if (step === 'ERROR') return 'error';
    if (currentIdx > index) return 'complete';
    if (currentIdx === index) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-gold-glow">
        
        {/* Close Button */}
        {(step === 'SUCCESS' || step === 'ERROR') && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-midnight-800 text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold-metallic p-0.5 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Zero-Knowledge Circuit Prover</h3>
            <p className="text-xs text-slate-400">Midnight Compact Protocol Engine</p>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4 mb-6">
          {stepsList.map((item, idx) => {
            const status = getStepStatus(idx);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  status === 'active'
                    ? 'bg-midnight-800/90 border-gold-500/60 shadow-gold-glow'
                    : status === 'complete'
                    ? 'bg-midnight-900/60 border-emerald-500/30 text-slate-300'
                    : 'bg-midnight-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {status === 'complete' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : status === 'active' ? (
                      <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${status === 'active' ? 'text-gold-300' : 'text-slate-200'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Details */}
        {step === 'SUCCESS' && (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 mb-6">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Sealed Bid Registered On-Chain!</span>
            </div>
            {bidAmount && (
              <p className="text-xs text-slate-300">
                Encrypted Bid Amount: <strong className="text-gold-400">{bidAmount} tDUST</strong> (Stored privately in local witness).
              </p>
            )}
            {commitmentHash && (
              <div className="text-xs text-slate-400">
                <span className="block text-[10px] uppercase text-slate-400">Public Commitment Hash:</span>
                <code className="block bg-midnight-950 p-2 rounded-lg font-mono text-[11px] text-gold-300 truncate mt-1">
                  {commitmentHash}
                </code>
              </div>
            )}
            {txHash && (
              <a
                href={`https://explorer.preprod.midnight.network/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium pt-1"
              >
                <span>View Transaction on Midnight Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Error Details */}
        {step === 'ERROR' && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 mb-6">
            <strong className="block text-rose-400 mb-1">Proof Computation / Submission Failed:</strong>
            {errorMsg || 'An unknown error occurred while submitting zero knowledge proof.'}
          </div>
        )}

        {/* Action Button */}
        {(step === 'SUCCESS' || step === 'ERROR') && (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl gold-gradient-btn text-sm font-bold shadow-gold-glow"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
