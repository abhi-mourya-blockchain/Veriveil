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
import { Shield, Sparkles, Cpu, Lock, CheckCircle2 } from 'lucide-react';

const contractInstance = new AetherBidContractAPI();

export default function Home() {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [ledgerState, setLedgerState] = useState<AetherBidLedgerState>(contractInstance.getLedgerState());
  const [activities, setActivities] = useState<ActivityEvent[]>(contractInstance.getActivityLogs());

  useEffect(() => {
    // Initial check for existing connected wallet
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
      // Re-initialize for simulation loop
      window.location.reload();
      return;
    }
    setLedgerState(contractInstance.getLedgerState());
    setActivities(contractInstance.getActivityLogs());
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-midnight-950">
      
      {/* Top Navigation */}
      <Header
        account={account}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 flex-1 w-full">
        
        {/* Hero Banner / Protocol Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Zero-Knowledge Sealed-Bid Protocol on Midnight Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight gold-gradient-text">
            Confidential High-Value Auctions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Bid with cryptographic discretion. Your bid amounts remain sealed inside private zero-knowledge witnesses. Observers only verify cryptographic commitments without revealing losing bids.
          </p>
        </div>

        {/* Featured Luxury Auction Item */}
        <FeaturedAuction
          ledgerState={ledgerState}
          onPhaseChange={handleToggleSimulationPhase}
        />

        {/* Two-Column Interactive Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ConfidentialBiddingPanel
            account={account}
            ledgerState={ledgerState}
            onSubmitBid={handleSubmitBid}
            onConnectWallet={handleConnectWallet}
          />

          <RevealTallyPanel
            account={account}
            ledgerState={ledgerState}
            onRevealBid={handleRevealBid}
            onFinalize={handleFinalize}
          />
        </div>

        {/* Privacy Transparency Radar */}
        <PrivacyRadar />

        {/* Live Encrypted Activity Stream */}
        <LiveActivityStream events={activities} />

      </main>

      {/* Luxury Cyber-Gold Footer */}
      <footer className="border-t border-gold-500/20 glass-panel py-8 mt-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold-400" />
            <span className="font-semibold text-slate-200">AetherBid Protocol</span>
            <span>— Midnight Network Preprod Level-3 dApp</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Compact Smart Contracts
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
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
