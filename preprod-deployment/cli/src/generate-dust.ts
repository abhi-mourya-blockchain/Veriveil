// This file is part of midnightntwrk/example-bboard.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// import { webcrypto } from 'crypto';

import { type WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { createKeystore, UnshieldedWalletState } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { Logger } from 'pino';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletSeeds } from '@midnight-ntwrk/testkit-js';

export const getUnshieldedSeed = (seed: string): Uint8Array<ArrayBufferLike> => {
  const trimmed = seed.trim();

  try {
    const s = WalletSeeds.fromMasterSeed(trimmed);
    if (s && s.unshielded) return s.unshielded;
  } catch {}

  const seedBuffer = Buffer.from(trimmed, 'hex');
  const hdWalletResult = HDWallet.fromSeed(seedBuffer);

  if ((hdWalletResult as any).type === 'seedOk') {
    const derivationResult = (hdWalletResult as any).hdWallet.selectAccount(0).selectRole(Roles.NightExternal).deriveKeyAt(0);
    if (derivationResult.type !== 'keyOutOfBounds') {
      return derivationResult.key;
    }
  }

  throw new Error(`Unable to derive unshielded seed from provided wallet seed`);
};

export const generateDust = async (
  logger: Logger,
  walletSeed: string,
  unshieldedState: UnshieldedWalletState,
  walletFacade: WalletFacade,
  existingKeystore?: any,
) => {
  const dustAddress = await walletFacade.dust.getAddress();
  const networkId = getNetworkId();
  const unshieldedKeystore = existingKeystore ?? createKeystore(getUnshieldedSeed(walletSeed), networkId);
  const utxos = unshieldedState.availableCoins.filter((coin) => !coin.meta.registeredForDustGeneration);

  if (utxos.length === 0) {
    logger.debug('No unregistered UTXOs found for dust generation.');
    return undefined;
  }

  logger.info(`Generating dust with ${utxos.length} UTXOs for address ${dustAddress}...`);

  const recipe = await walletFacade.registerNightUtxosForDustGeneration(
    utxos,
    unshieldedKeystore.getPublicKey(),
    (payload: Uint8Array) => unshieldedKeystore.signData(payload),
    dustAddress,
  );
  const transaction = await walletFacade.finalizeRecipe(recipe);
  const txId = await walletFacade.submitTransaction(transaction);
  logger.info(`Dust generation transaction submitted with txId: ${txId}`);

  return txId;
};

