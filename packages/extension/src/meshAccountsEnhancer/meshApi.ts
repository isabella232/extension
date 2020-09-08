// Copyright 2020-2021 @polymath-network authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import meshSchema from './meshSchema';
// @TODO read endpoint from config.
const provider = new WsProvider('wss://pmf.polymath.network');
const _meshApi = ApiPromise.create({
  provider,
  rpc: meshSchema.rpc,
  types: meshSchema.types
});

const meshApi: Promise<ApiPromise> = new Promise((resolve, reject): void => {
  _meshApi.then((api) => {
    api.isReady.then((api) => {
      resolve(api);
    }).catch((err) => reject(err));
  }).catch((err) => reject(err));
});

export default meshApi;
