import { network, networkUrl } from './selectors';

import store from '.';
import { NetworkName } from '../types';

function getNetwork (): NetworkName {
  return network(store.getState());
}

function getNetworkUrl (): string {
  return networkUrl(store.getState());
}

export {
  getNetwork,
  getNetworkUrl
};
