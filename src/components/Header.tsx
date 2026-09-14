'use client';

import React from 'react';
import { WalletAccount } from '../lib/midnight/wallet-connector';
import { Shield, Sparkles, Wallet, LogOut, CheckCircle2, ExternalLink, ChevronDown } from 'lucide-react';

interface HeaderProps {
  account: WalletAccount | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ account, onConnect, onDisconnect }) => {
  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="glass-capsule rounded-full px-5 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-celestial-500 via-indigo-500 to-white p-[1px] shadow-blue-glow flex items-center justify-center">
            <div className="w-full h-full bg-obsidian-950 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-celestial-300" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-wider text-white">VERIVEIL</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest rounded-full bg-celestial-500/15 text-celestial-300 border border-celestial-500/30">
              Midnight ZK
            </span>
          </div>
        </div>

        {/* Center Nav Links - Wallety / Neone Style */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
          <a href="#features" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
            Features
          </a>
          <a href="#auctions" className="px-3.5 py-1.5 rounded-full text-white bg-white/10 border border-white/10 shadow-sm flex items-center gap-1">
            <span>Auctions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </a>
          <a href="#zk-protocol" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
            ZK Circuits
          </a>
          <a 
            href="https://preprod.midnight.network/contract/7917d54030a7b550eff2d7c96e7943a39559432c3c15867d6b40eb52e43406d0" 
            target="_blank" 
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 text-celestial-300"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a href="#docs" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
            Docs
          </a>
        </nav>

        {/* Right Actions - Pill Buttons */}
        <div className="flex items-center gap-3">
          {/* Verified On-Chain Contract Pill */}
          <a
            href="https://preprod.midnight.network/contract/7917d54030a7b550eff2d7c96e7943a39559432c3c15867d6b40eb52e43406d0"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-900/90 hover:bg-obsidian-800 border border-celestial-500/20 text-[11px] text-slate-300 font-mono transition-colors"
            title="Verified Contract on Midnight Preprod"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>7917d540...06d0</span>
          </a>

          {/* Connect Lace Wallet Pill Button */}
          {account ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-ping"></span>
                <span className="font-mono">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
                <span className="text-[10px] text-celestial-300 bg-celestial-500/20 px-1.5 py-0.5 rounded-full font-mono">
                  {(Number(account.balanceDust) / 1e6).toLocaleString()} tDUST
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="btn-white-pill px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
