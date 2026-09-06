import { describe, it, expect, beforeEach } from 'vitest';
import {
  derivePublicKey,
  generateSalt,
  computeBidCommitment,
  proveAndVerifyReveal,
  PrivateBidWitness
} from '../src/lib/midnight/crypto-zk';
import { AetherBidContractAPI } from '../src/lib/midnight/contract-api';
import { AuctionState } from '../contract/managed';

describe('AetherBid Protocol - Zero-Knowledge Sealed-Bid Contract & Circuits', () => {
  let contract: AetherBidContractAPI;
  let bidder1Witness: PrivateBidWitness;
  let bidder2Witness: PrivateBidWitness;
  let bidder3Witness: PrivateBidWitness;

  beforeEach(() => {
    // Initialize fresh contract with 5,000 tDUST reserve price
    contract = new AetherBidContractAPI(5000n);

    const sk1 = '0x1000000000000000000000000000000000000000000000000000000000000001';
    bidder1Witness = {
      bidderSk: sk1,
      bidderPk: derivePublicKey(sk1),
      bidAmount: 12000n,
      salt: generateSalt()
    };

    const sk2 = '0x2000000000000000000000000000000000000000000000000000000000000002';
    bidder2Witness = {
      bidderSk: sk2,
      bidderPk: derivePublicKey(sk2),
      bidAmount: 18500n,
      salt: generateSalt()
    };

    const sk3 = '0x3000000000000000000000000000000000000000000000000000000000000003';
    bidder3Witness = {
      bidderSk: sk3,
      bidderPk: derivePublicKey(sk3),
      bidAmount: 8000n,
      salt: generateSalt()
    };
  });

  it('Test 1: Ensures Bid Secrecy & Commitment Hash Generation', () => {
    const commitment1 = computeBidCommitment(bidder1Witness);
    const commitment2 = computeBidCommitment(bidder2Witness);

    // Commitments must be 32-byte hex strings
    expect(commitment1).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(commitment2).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(commitment1).not.toBe(commitment2);

    // Submitting a sealed bid registers commitment without disclosing amount
    const initialCount = contract.getLedgerState().totalBidsCount;
    const subResult = contract.submitSealedBid(bidder1Witness);

    expect(subResult.success).toBe(true);
    expect(subResult.commitment).toBe(commitment1);
    expect(contract.getLedgerState().totalBidsCount).toBe(initialCount + 1n);

    // Verify on-chain registered commitment matches hash exactly
    const registered = contract.getLedgerState().registeredBids.get(bidder1Witness.bidderPk);
    expect(registered?.commitmentHash).toBe(commitment1);
  });

  it('Test 2: Rejects Tampered or Non-Matching Witness on Reveal', () => {
    // 1. Submit valid sealed bid
    const subResult = contract.submitSealedBid(bidder1Witness);
    expect(subResult.success).toBe(true);

    // 2. Transition to reveal phase
    contract.transitionToRevealPhase();
    expect(contract.getLedgerState().auctionState).toBe(AuctionState.RevealActive);

    // 3. Attempt reveal with tampered bid amount (lying about amount)
    const tamperedWitness: PrivateBidWitness = {
      ...bidder1Witness,
      bidAmount: 25000n // Altered amount
    };

    expect(() => {
      contract.revealHighestBid(tamperedWitness);
    }).toThrow(/ZK Proof verification failed: witness does not match registered commitment/i);

    // 4. Attempt reveal with invalid secret key
    const forgedWitness: PrivateBidWitness = {
      ...bidder1Witness,
      bidderSk: '0x9999999999999999999999999999999999999999999999999999999999999999'
    };

    expect(() => {
      contract.revealHighestBid(forgedWitness);
    }).toThrow(/Witness private key does not match bidder public key/i);
  });

  it('Test 3: Correctly Updates Public Highest Bid & Discloses Winner on Valid Proof', () => {
    // Register both bidder 1 (12,000) and bidder 2 (18,500)
    contract.submitSealedBid(bidder1Witness);
    contract.submitSealedBid(bidder2Witness);

    contract.transitionToRevealPhase();

    // Bidder 1 reveals first (12,000 > 5,000 initial reserve)
    const reveal1 = contract.revealHighestBid(bidder1Witness);
    expect(reveal1.success).toBe(true);
    expect(reveal1.newHighestBid).toBe(12000n);

    let state = contract.getLedgerState();
    expect(state.highestBid).toBe(12000n);
    expect(state.highestBidder).toBe(bidder1Witness.bidderPk);

    // Bidder 2 reveals next (18,500 > 12,000 current highest)
    const reveal2 = contract.revealHighestBid(bidder2Witness);
    expect(reveal2.success).toBe(true);
    expect(reveal2.newHighestBid).toBe(18500n);

    state = contract.getLedgerState();
    expect(state.highestBid).toBe(18500n);
    expect(state.highestBidder).toBe(bidder2Witness.bidderPk);
  });

  it('Test 4: Enforces Strict Phase Gating (No Early Reveals or Late Bids)', () => {
    contract.submitSealedBid(bidder1Witness);

    // Attempting to reveal during BiddingActive phase must fail
    expect(() => {
      contract.revealHighestBid(bidder1Witness);
    }).toThrow(/Cannot reveal bid: Auction is not in RevealActive phase/i);

    // Transition to RevealActive phase
    contract.transitionToRevealPhase();

    // Attempting to submit a new sealed bid after bidding closed must fail
    expect(() => {
      contract.submitSealedBid(bidder3Witness);
    }).toThrow(/Cannot submit bid: Auction is not in active bidding state/i);

    // Finalize auction
    contract.finalizeAuction();
    expect(contract.getLedgerState().auctionState).toBe(AuctionState.Finalized);

    // After finalization, cannot reveal
    expect(() => {
      contract.revealHighestBid(bidder2Witness);
    }).toThrow(/Cannot reveal bid: Auction is not in RevealActive phase/i);
  });
});
