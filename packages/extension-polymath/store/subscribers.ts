import { Unsubscribe } from '@reduxjs/toolkit';
import { IdentifiedAccount } from '../types';
import reduxSubscribe from './reduxSubscribe';
import { didsList, identifiedAccounts } from './selectors';

export function subscribeDidsList (cb: (dids: string[]) => void): Unsubscribe {
  const unsubscribe = reduxSubscribe(didsList, cb);

  return unsubscribe;
}

export function subscribeIdentifiedAccounts (cb: (accounts: IdentifiedAccount[]) => void): Unsubscribe {
  const unsubscribe = reduxSubscribe(identifiedAccounts, cb);

  return unsubscribe;
}
