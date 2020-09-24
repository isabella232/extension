// Copyright 2020-2021 @polymath-network authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import meshSchema from './schema';
import { getNetworkUrl } from '../../store/getters';

const url = getNetworkUrl();
const provider = new WsProvider(url);

const apiPromise:Promise<ApiPromise> = new Promise((resolve, reject): void => {
  ApiPromise.create({
    provider,
    rpc: meshSchema.rpc,
    types: meshSchema.types
  }).then((api) => {
    api.isReady.then((api) => {
      resolve(api);
    }).catch((err) => reject(err));
  }).catch((err) => reject(err));
});

export default apiPromise;
