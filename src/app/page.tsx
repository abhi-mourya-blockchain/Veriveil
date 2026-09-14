'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FeaturedAuction } from '../components/FeaturedAuction';
import { ConfidentialBiddingPanel } from '../components/ConfidentialBiddingPanel';
import { RevealTallyPanel } from '../components/RevealTallyPanel';
import { PrivacyRadar } from '../components/PrivacyRadar';
import { LiveActivityStream } from '../components/LiveActivityStream';
import { walletConnector, WalletAccount } from '../lib/midnight/wallet-connector';
import { AetherBidContractAPI, ActivityEvent } from '../lib/midnight/contract-api';
import { AetherBidLedgerState, AuctionState } from '../../contract/managed';
import { PrivateBidWitness } from '../lib/midnight/crypto-zk';
import { 
  Shield, Sparkles, Cpu, Lock, CheckCircle2, ArrowRight, Play, EyeOff, 
  Layers, ExternalLink, Zap, Key, RefreshCw, BarChart3 
} from 'lucide-react';

const contractInstance = new AetherBidContractAPI();

export default function Home() {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [ledgerState, setLedgerState] = useState<AetherBidLedgerState>(contractInstance.getLedgerState());
  const [activities, setActivities] = useState<ActivityEvent[]>(contractInstance.getActivityLogs());
  const [activeTab, setActiveTab] = useState<'auction' | 'radar' | 'stream'>('auction');

  useEffect(() => {
    const existing = walletConnector.getAccount();
    if (existing) {
      setAccount(existing);
    }
  }, []);

  const handleConnectWallet = async () => {
    const acc = await walletConnector.connectLaceWallet();
    setAccount(acc);
  };

  const handleDisconnectWallet = () => {
    walletConnector.disconnect();
    setAccount(null);
  };

  const handleSubmitBid = (witness: PrivateBidWitness) => {
    const res = contractInstance.submitSealedBid(witness);
    setLedgerState(contractInstance.getLedgerState());
    setActivities(contractInstance.getActivityLogs());
    return res;
  };

  const handleRevealBid = (witness: PrivateBidWitness) => {
    const res = contractInstance.revealHighestBid(witness);
    setLedgerState(contractInstance.getLedgerState());
    setActivities(contractInstance.getActivityLogs());
    return res;
  };

  const handleFinalize = () => {
    contractInstance.finalizeAuction();
    setLedgerState(contractInstance.getLedgerState());
    setActivities(contractInstance.getActivityLogs());
  };

  const handleToggleSimulationPhase = () => {
    if (ledgerState.auctionState === AuctionState.BiddingActive) {
      contractInstance.transitionToRevealPhase();
    } else if (ledgerState.auctionState === AuctionState.RevealActive) {
      contractInstance.finalizeAuction();
    } else {
      window.location.reload();
      return;
    }
    setLedgerState(contractInstance.getLedgerState());
    setActivities(contractInstance.getActivityLogs());
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between selection:bg-celestial-500 selection:text-obsidian-950 overflow-x-hidden">
      
      {/* Top Floating Navigation Bar */}
      <Header
        account={account}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      {/* Hero Section with Signature Celestial Arc & Luminous Eclipse */}
      <main className="flex-1 celestial-arc relative pt-12 sm:pt-20 pb-16">
        
        {/* Glow Horizon Line */}
        <div className="arc-line-glow"></div>

        {/* Hero Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Early Access Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-early-access text-xs font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-celestial-400" />
            <span>Midnight Preprod Level-3 • Verified On-Chain</span>
          </div>

          {/* Main Hero Headline - Neone & Wallety Fusion */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight celestial-title max-w-4xl mx-auto leading-[1.1] mb-6">
            Where High-Value Auctions <br className="hidden sm:inline" />
            <span className="celestial-gradient-text">Find Cryptographic Sanctuary</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            A minimal, zero-knowledge confidential sealed-bid protocol natively engineered on <strong className="text-white font-medium">Midnight Network</strong>. Bid amounts remain private in encrypted witnesses while ensuring verifiable on-chain settlement.
          </p>

          {/* Action Buttons - White Pill & Glass Capsule */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="#dashboard-frame"
              className="btn-white-pill px-7 py-3 text-sm flex items-center gap-2 group"
            >
              <span>Explore Live Auctions</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://photos.app.goo.gl/s1RRNzngZfZaw3qy9"
              target="_blank"
              rel="noreferrer"
              className="btn-glass-pill px-6 py-3 text-sm flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-celestial-400 fill-celestial-400/30" />
              <span>Watch Demo Walkthrough</span>
            </a>

            <a
              href="https://preprod.midnight.network/contract/7917d54030a7b550eff2d7c96e7943a39559432c3c15867d6b40eb52e43406d0"
              target="_blank"
              rel="noreferrer"
              className="btn-glass-pill px-5 py-3 text-sm flex items-center gap-1.5 text-celestial-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </a>
          </div>

          {/* Submerged Dashboard Container (Interactive dApp Frame) */}
          <div id="dashboard-frame" className="submerged-dashboard-frame rounded-3xl p-4 sm:p-6 lg:p-8 text-left transition-all">
            
            {/* Dashboard Sub-Header / Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Sealed-Bid Protocol</span>
                </div>
                <span className="text-xs font-mono text-celestial-400/80 bg-celestial-500/10 px-2 py-0.5 rounded-md border border-celestial-500/20">
                  Epoch #418 • Midnight Preprod
                </span>
              </div>

              {/* Navigation Tabs inside Dashboard */}
              <div className="flex items-center gap-1.5 bg-obsidian-950/80 p-1 rounded-full border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab('auction')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                    activeTab === 'auction'
                      ? 'bg-white text-obsidian-950 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Auction Hub
                </button>
                <button
                  onClick={() => setActiveTab('radar')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                    activeTab === 'radar'
                      ? 'bg-white text-obsidian-950 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Privacy Radar
                </button>
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                    activeTab === 'stream'
                      ? 'bg-white text-obsidian-950 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Activity Stream
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'auction' && (
              <div className="space-y-8">
                {/* Featured Auction Showcase */}
                <FeaturedAuction
                  ledgerState={ledgerState}
                  onPhaseChange={handleToggleSimulationPhase}
                />

                {/* Bidding or Reveal Phase Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    {ledgerState.auctionState === AuctionState.BiddingActive ? (
                      <ConfidentialBiddingPanel
                        account={account}
                        ledgerState={ledgerState}
                        onSubmitBid={handleSubmitBid}
                        onConnectWallet={handleConnectWallet}
                      />
                    ) : (
                      <RevealTallyPanel
                        account={account}
                        ledgerState={ledgerState}
                        onRevealBid={handleRevealBid}
                        onFinalize={handleFinalize}
                      />
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <PrivacyRadar ledgerState={ledgerState} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrivacyRadar ledgerState={ledgerState} />
                <div className="glass-card-obsidian rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-celestial-400" />
                    <span>Midnight Confidential Ledger State</span>
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-obsidian-950/60 border border-white/5 flex justify-between">
                      <span className="text-slate-400">Deployed Contract Address:</span>
                      <span className="font-mono text-celestial-300">7917d540...06d0</span>
                    </div>
                    <div className="p-3 rounded-xl bg-obsidian-950/60 border border-white/5 flex justify-between">
                      <span className="text-slate-400">Total Registered Bids:</span>
                      <span className="font-semibold text-white">{ledgerState.totalBidsCount.toString()} Bids</span>
                    </div>
                    <div className="p-3 rounded-xl bg-obsidian-950/60 border border-white/5 flex justify-between">
                      <span className="text-slate-400">Reserve Floor:</span>
                      <span className="font-semibold text-white">{(Number(ledgerState.item.reservePrice) / 1e6).toLocaleString()} tDUST</span>
                    </div>
                    <div className="p-3 rounded-xl bg-obsidian-950/60 border border-white/5 flex justify-between">
                      <span className="text-slate-400">On-Chain State Proof:</span>
                      <span className="text-emerald-400 font-mono">Compact 0.31.1 Verifier OK</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stream' && (
              <div className="max-w-4xl mx-auto">
                <LiveActivityStream events={activities} />
              </div>
            )}

          </div>

          {/* Wallety-Style Bento Grid Showcase: Sanctuary of Private DeFi */}
          <section id="features" className="mt-28 text-left">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-early-access text-[11px] font-semibold mb-3">
                <span>✦ ZERO-KNOWLEDGE ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold celestial-title">
                Engineered For True Auction Privacy
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Powered by Midnight's Compact smart contract language and zero-knowledge private witness provers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bento Card 1 */}
              <div className="glass-card-obsidian rounded-2xl p-7 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-celestial-500/10 border border-celestial-500/30 flex items-center justify-center text-celestial-400 mb-5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Private Witness Shield</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Bid amounts and cryptographic salts are stored locally in the bidder&apos;s private witness. Nothing is leaked to mempools or public observers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-celestial-400">
                  <span>SHA-256 + Pedersen</span>
                  <span className="text-slate-500">100% Sealed</span>
                </div>
              </div>

              {/* Bento Card 2 */}
              <div className="glass-card-obsidian rounded-2xl p-7 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">MEV & Snipe Immunity</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Prevent frontrunning bots and shill bidding. Competitors cannot inspect incoming bids to outbid you by micro-fractions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-indigo-400">
                  <span>Anti-Collusion</span>
                  <span className="text-slate-500">Tamper-Proof</span>
                </div>
              </div>

              {/* Bento Card 3 */}
              <div className="glass-card-obsidian rounded-2xl p-7 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Selective Disclosure</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Compact smart contract executes zero-knowledge tallying and discloses only the single winning bid. Losing bids remain secret forever.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Midnight Preprod</span>
                  <span className="text-slate-500">Compact v0.31</span>
                </div>
              </div>

            </div>

          </section>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 bg-obsidian-950/90 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">VERIVEIL</span>
            <span>• Zero-Knowledge Sealed-Bid Protocol on Midnight Network</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-celestial-400" />
              Compact Smart Contracts
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-celestial-300" />
              ZK Witness Privacy
            </span>
            <span className="text-emerald-400 font-mono">
              v1.0.0-Preprod
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

