// eslint-disable-next-line header/header
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Option } from '@polkadot/types/codec';
import difference from 'lodash-es/difference';

import apiPromise from './api/apiPromise';
import { DidRecord, LinkedKeyInfo, CddStatus } from './api/apiPromise/types';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';

import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import store from './store';
import { AccountData, IdentityData, UnsubCallback } from './types';
import { subscribeDidsList } from './store/subscribers';
import { getNetwork } from './store/getters';

function observeAccounts (cb: (accounts: string[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address } }) => address);

    cb(accounts);
  });
}

// @TODO convert into a thunk? https://redux-toolkit.js.org/tutorials/advanced-tutorial#thinking-in-thunks
export function meshAccountsEnhancer (): void {
  apiPromise.then((api) => {
    const unsubCallbacks: Record<string, UnsubCallback> = {};
    let prevAccounts: string[] = [];
    let prevDids: string[] = [];
    const network = getNetwork();

    // @TODO manage this subscription. Perhaps on port disconnect
    observeAccounts((accounts: string[]) => {
      const newAccounts = difference(accounts, prevAccounts);
      const removedAccounts = difference(prevAccounts, accounts);

      removedAccounts.forEach((account) => {
        unsubCallbacks[account]();
        store.dispatch(accountActions.removeAccount({ address: account, network }));
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

          store.dispatch(accountActions.setAccount({ data: accountData, network }));

          if (!linkedKeyInfo.unwrapOrDefault().isEmpty) {
            const did = linkedKeyInfo.unwrapOrDefault().asUnique.toString();

            // eslint-disable-next-line
            (api.rpc as any).identity.isIdentityHasValidCdd(did)
              .then((cddStatus: CddStatus) => {
                store.dispatch(identityActions.setIdentity({ data: {
                  cdd: cddStatus.isOk,
                  did,
                  priKey: account,
                  secKeys: []
                },
                network }));
              })
              .catch(console.error);
          }
        }).then((unsub) => {
          unsubCallbacks[account] = unsub;
        }).catch(console.error);
      });
    });

    // @TODO manage this subscription.
    subscribeDidsList((dids: string[]) => {
      const newDids = difference(dids, prevDids);
      const removedDids = difference(prevDids, dids);

      newDids.forEach((did) => {
        api.query.identity.didRecords<DidRecord>(did, (didRecords) => {
          const priKey = encodeAddress(didRecords.primary_key);
          const secKeys = didRecords.secondary_keys.toArray().reduce((keys, item) => {
            return item.signer.isAccount
              ? keys.concat(encodeAddress(item.signer.asAccount))
              : keys;
          }, [] as string[]);

          const identityData: IdentityData = {
            did,
            priKey,
            secKeys
          };

          store.dispatch(identityActions.setIdentity({ data: identityData, network }));
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
