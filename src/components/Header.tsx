'use client';

import React from 'react';
import { WalletAccount } from '../lib/midnight/wallet-connector';
import { Shield, Sparkles, Wallet, LogOut, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  account: WalletAccount | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ account, onConnect, onDisconnect }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-metallic p-0.5 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider gold-gradient-text">AETHERBID</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                ZK-V3
              </span>
            </div>
            <p className="text-xs text-slate-400">Midnight Confidential Sealed-Bid Protocol</p>
          </div>
        </div>

        {/* Network Indicator & Wallet Actions */}
        <div className="flex items-center gap-4">
          {/* Contract ID Pill */}
          <a
            href="https://explorer.preprod.midnight.network/contract/02008f51a4b98c3e10827ad46c19385bf731980cae25e9821d3f9208a1c893df8162"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/90 hover:bg-midnight-800 border border-gold-500/30 text-xs text-gold-300 font-mono transition-colors shadow-gold-glow"
            title="View Contract on Midnight Preprod Explorer"
          >
            <span className="text-slate-400">Contract:</span>
            <span>02008f51...8162</span>
          </a>

          {/* Network Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-gold-500/20 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-emerald-400">Midnight Preprod</span>
          </div>

          {account?.isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs text-slate-400">Balance</span>
                <span className="text-sm font-semibold font-mono text-gold-400">
                  {(Number(account.balanceDust) / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2 })} tDUST
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-midnight-800 border border-gold-500/30 text-xs font-mono text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{account.address.slice(0, 10)}...{account.address.slice(-6)}</span>
              </div>

              <button
                onClick={onDisconnect}
                className="p-2 rounded-xl bg-midnight-800/80 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/40 transition-colors"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-btn text-sm shadow-gold-glow"
            >
              <Wallet className="w-4 h-4 text-midnight-950" />
              <span>Connect Lace Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
