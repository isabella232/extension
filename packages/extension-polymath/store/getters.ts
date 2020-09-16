import { networkUrl } from './selectors';

import store from '.';

function getNetworkUrl (): string {
  return networkUrl(store.getState());
}

export {
  getNetworkUrl
};
