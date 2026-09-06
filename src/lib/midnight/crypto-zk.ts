import { createHash, randomBytes } from 'crypto';

/**
 * Client-Side Cryptographic & Zero-Knowledge Proof Engine for AetherBid
 * Implements Pedersen/Sha256 commitment schemes and simulated ZK proving for Midnight Preprod.
 */

export interface PrivateBidWitness {
  bidderSk: string;
  bidderPk: string;
  bidAmount: bigint;
  salt: string;
}

export interface SealedBidProof {
  commitmentHash: string;
  publicInputs: {
    bidderPk: string;
    timestamp: bigint;
  };
  proofBlob: string;
}

export interface RevealProof {
  bidderPk: string;
  revealedBidAmount: bigint;
  isValid: boolean;
  proofBlob: string;
}

/**
 * Derives a deterministic public key from a private key.
 */
export function derivePublicKey(privateKeyHex: string): string {
  const hash = createHash('sha256');
  hash.update(Buffer.from(privateKeyHex.replace('0x', ''), 'hex'));
  hash.update(Buffer.from([0x01]));
  return '0x' + hash.digest('hex');
}

/**
 * Generates a secure random 32-byte hexadecimal salt.
 */
export function generateSalt(): string {
  return '0x' + randomBytes(32).toString('hex');
}

/**
 * Generates a cryptographic commitment for a sealed bid.
 * Hash(bidderSk || salt || bidAmount) -> commitmentHash (Bytes<32>)
 */
export function computeBidCommitment(witness: PrivateBidWitness): string {
  const hash = createHash('sha256');
  hash.update(Buffer.from(witness.bidderSk.replace('0x', ''), 'hex'));
  hash.update(Buffer.from(witness.salt.replace('0x', ''), 'hex'));
  
  // Pad bidAmount to 32 bytes
  const amountBuf = Buffer.alloc(32);
  amountBuf.writeBigUInt64BE(witness.bidAmount, 24);
  hash.update(amountBuf);

  return '0x' + hash.digest('hex');
}

/**
 * Simulates Midnight ZK Prover for `submitSealedBid` circuit.
 */
export function generateSubmitBidProof(witness: PrivateBidWitness, timestamp: bigint): SealedBidProof {
  const commitment = computeBidCommitment(witness);
  const proofHash = createHash('sha256')
    .update(commitment)
    .update(witness.bidderPk)
    .digest('hex');

  return {
    commitmentHash: commitment,
    publicInputs: {
      bidderPk: witness.bidderPk,
      timestamp
    },
    proofBlob: `zk_proof_midnight_v3_${proofHash}`
  };
}

/**
 * Verifies and proves that a private witness matches a registered commitment
 * and satisfies `bidAmount > currentHighestBid`.
 */
export function proveAndVerifyReveal(
  witness: PrivateBidWitness,
  registeredCommitment: string,
  currentHighestBid: bigint
): { success: boolean; error?: string; revealProof?: RevealProof } {
  // 1. Verify PK matches SK
  const expectedPk = derivePublicKey(witness.bidderSk);
  if (expectedPk.toLowerCase() !== witness.bidderPk.toLowerCase()) {
    return { success: false, error: 'Witness private key does not match bidder public key' };
  }

  // 2. Verify Commitment Hash
  const recomputedCommitment = computeBidCommitment(witness);
  if (recomputedCommitment.toLowerCase() !== registeredCommitment.toLowerCase()) {
    return { success: false, error: 'ZK Proof verification failed: witness does not match registered commitment' };
  }

  // 3. Verify Bid Value strictly exceeds current highest bid
  if (witness.bidAmount <= currentHighestBid) {
    return {
      success: false,
      error: `Revealed bid (${witness.bidAmount.toLocaleString()} tDUST) does not exceed current highest bid (${currentHighestBid.toLocaleString()} tDUST)`
    };
  }

  const proofSignature = createHash('sha256')
    .update(registeredCommitment)
    .update(witness.bidAmount.toString())
    .digest('hex');

  return {
    success: true,
    revealProof: {
      bidderPk: witness.bidderPk,
      revealedBidAmount: witness.bidAmount,
      isValid: true,
      proofBlob: `zk_reveal_proof_midnight_${proofSignature}`
    }
  };
}
