import store from '.';
import { NetworkName } from '../types';
import { actions as networkActions } from './features/network';

function setNetwork (network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

export {
  setNetwork
};
