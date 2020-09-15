// eslint-disable-next-line header/header
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Option } from '@polkadot/types/codec';
import isEqual from 'lodash-es/isEqual';
import difference from 'lodash-es/difference';

import meshApi from './meshApi';
import { DidRecord, LinkedKeyInfo, CddStatus } from './meshTypes';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';

import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import store from './store';
import { AccountData, IdentityData, UnsubCallback } from './types';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store/rootReducer';

function observeAccounts (cb: (accounts: string[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address } }) => address);

    cb(accounts);
  });
}

// @TODO a generic subscriber that received store, selector and cb. Like in dan's example.

function observeDids (cb: (dids: string[]) => void) {
  let currentState: string[];

  const didsSelector = createSelector(
    (state: RootState) => state.identities,
    (identities) => Object.keys(identities)
  );

  function storeListener () {
    const nextState = didsSelector(store.getState());

    if (!isEqual(nextState, currentState)) {
      currentState = nextState;
      cb(currentState);
    }
  }

  const unsubscribe = store.subscribe(storeListener);

  storeListener();

  return unsubscribe;
}

// @TODO generic observer functions

// @TODO convert into a thunk? https://redux-toolkit.js.org/tutorials/advanced-tutorial#thinking-in-thunks
export function meshAccountsEnhancer (): void {
  meshApi.then((api) => {
    const unsubCallbacks: Record<string, UnsubCallback> = {};
    let prevAccounts: string[] = [];
    let prevDids: string[] = [];

    // @TODO manage this subscription.
    observeAccounts((accounts: string[]) => {
      const newAccounts = difference(accounts, prevAccounts);
      const removedAccounts = difference(prevAccounts, accounts);

      removedAccounts.forEach((account) => {
        unsubCallbacks[account]();
        store.dispatch(accountActions.removeAccount(account));
      });

      prevAccounts = accounts;
      newAccounts.forEach((account) => {
        api.queryMulti([
          [api.query.system.account, account],
          [api.query.identity.keyToIdentityIds, account]
        ], ([accData, linkedKeyInfo]: [AccountInfo, Option<LinkedKeyInfo>]) => {
          const accountData: AccountData = {
            address: account,
            balance: accData.data.free.toString()
          };

          store.dispatch(accountActions.setAccount(accountData));

          if (!linkedKeyInfo.unwrapOrDefault().isEmpty) {
            const did = linkedKeyInfo.unwrapOrDefault().asUnique.toString();

            // eslint-disable-next-line
            api.rpc.identity.isIdentityHasValidCdd(did)
              .then((cddStatus: CddStatus) => {
                store.dispatch(identityActions.setIdentity({
                  cdd: cddStatus.isOk,
                  did,
                  priKey: account,
                  secKeys: []
                }));
              })
              .catch(console.error);
          }
        }).then((unsub) => {
          unsubCallbacks[account] = unsub;
        }).catch(console.error);
      });
    });

    // @TODO manage this subscription.
    observeDids((dids: string[]) => {
      const newDids = difference(dids, prevDids);
      const removedDids = difference(prevDids, dids);

      newDids.forEach((did) => {
        api.query.identity.didRecords<DidRecord>(did, (didRecords) => {
          console.log('didRecords', didRecords);
          const priKey = encodeAddress(didRecords.primary_key);
          const secKeys = didRecords.secondary_keys.toArray().reduce((keys, item) => {
            return item.signer.isAccountKey
              ? keys.concat(encodeAddress(item.signer.asAccountKey))
              : keys;
          }, [] as string[]);

          const identityData: IdentityData = {
            did,
            priKey,
            secKeys
          };

          store.dispatch(identityActions.setIdentity(identityData));
        })
          .then((unsub) => {
            unsubCallbacks[did] = unsub;
          })
          .catch(console.error);
      });

      removedDids.forEach((did) => {
        unsubCallbacks[did]();
      });

      prevDids = dids;
    });
    console.log('meshAccountsEnhancer initialization completed');
  }).catch((err) => console.error('meshAccountsEnhancer initialization failed', err));
}
