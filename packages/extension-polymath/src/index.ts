// eslint-disable-next-line header/header
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Option } from '@polkadot/types/codec';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise from './api/apiPromise';
import { DidRecord, LinkedKeyInfo, CddStatus } from './api/apiPromise/types';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';

import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as statusActions } from './store/features/status';
import store, { Dispatch } from './store';
import { AccountData, IdentityData, UnsubCallback } from './types';
import { subscribeDidsList } from './store/subscribers';
import { getNetwork } from './store/getters';

type KeyringAccountData = {
  address: string,
  name?: string,
}

function observeAccounts (cb: (accounts: KeyringAccountData[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address, meta: { name } } }) => ({ address, name }));

    cb(accounts);
  });
}

function meshAccountsEnhancer (dispatch: Dispatch): void {
  apiPromise.then((api) => {
    const unsubCallbacks: Record<string, UnsubCallback> = {};
    let prevAccounts: string[] = [];
    let prevDids: string[] = [];
    const network = getNetwork();

    // @TODO manage this subscription. Perhaps on port disconnect
    observeAccounts((accountsData: KeyringAccountData[]) => {
      function accountName (_address: string): string | undefined {
        return accountsData.find(({ address }) => address === _address)?.name;
      }

      const accounts = accountsData.map(({ address }) => address);
      const newAccounts = difference(accounts, prevAccounts);
      const removedAccounts = difference(prevAccounts, accounts);
      const preExistingAccounts = intersection(prevAccounts, accounts);

      // A) If account is removed, clean up any associated subscriptions
      removedAccounts.forEach((account) => {
        unsubCallbacks[account]();
        dispatch(accountActions.removeAccount({ address: account, network }));
      });

      // B) Subscribe to new accounts
      newAccounts.forEach((account) => {
        api.queryMulti([
          [api.query.system.account, account],
          [api.query.identity.keyToIdentityIds, account]
        ], ([accData, linkedKeyInfo]: [AccountInfo, Option<LinkedKeyInfo>]) => {
          const accountData: AccountData = {
            address: account,
            balance: accData.data.free.toString(),
            name: accountName(account)
          };

          dispatch(accountActions.setAccount({ data: accountData, network }));

          if (!linkedKeyInfo.unwrapOrDefault().isEmpty) {
            const did = linkedKeyInfo.unwrapOrDefault().asUnique.toString();

            // eslint-disable-next-line
            (api.rpc as any).identity.isIdentityHasValidCdd(did)
              .then((cddStatus: CddStatus) => {
                dispatch(identityActions.setIdentity({ data: {
                  cdd: cddStatus.isOk,
                  did,
                  priKey: account,
                  secKeys: []
                },
                network }));
              })
              .catch(console.error);
          }

          dispatch(statusActions.setIsReady(true));
        }).then((unsub) => {
          unsubCallbacks[account] = unsub;
        }).catch(console.error);
      });

      // C) Update data of pre-existing accounts.
      preExistingAccounts.forEach((account) => {
        const accountData: AccountData = {
          address: account,
          name: accountName(account)
        };

        dispatch(accountActions.setAccount({ data: accountData, network }));
      });

      prevAccounts = accounts;
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

          dispatch(identityActions.setIdentity({ data: identityData, network }));
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

export default function init (): void {
  store.dispatch(meshAccountsEnhancer);
}
