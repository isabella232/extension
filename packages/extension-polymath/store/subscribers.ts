import { Unsubscribe } from '@reduxjs/toolkit';
import { IdentifiedAccount, NetworkName } from '../types';
import reduxSubscribe from './reduxSubscribe';
import { didsList, identifiedAccounts, network } from './selectors';

export function subscribeDidsList (cb: (dids: string[]) => void): Unsubscribe {
  const unsubscribe = reduxSubscribe(didsList, cb);

  return unsubscribe;
}

export function subscribeIdentifiedAccounts (cb: (accounts: IdentifiedAccount[]) => void): Unsubscribe {
  const unsubscribe = reduxSubscribe(identifiedAccounts, cb);

  return unsubscribe;
}

export function subscribeNetwork (cb: (network: NetworkName) => void): Unsubscribe {
  const unsubscribe = reduxSubscribe(network, cb);

  return unsubscribe;
}
