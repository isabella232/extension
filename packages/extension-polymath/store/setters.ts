import store from '.';
import { NetworkName } from '../types';
import { actions as networkActions } from './features/network';
import { actions as accountActions } from './features/accounts';

function setNetwork (network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

function setSelectedAccount (account: string): void {
  store.dispatch(accountActions.selectAccount(account));
}

export {
  setNetwork,
  setSelectedAccount
};
