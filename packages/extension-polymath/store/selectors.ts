import { createSelector } from '@reduxjs/toolkit';
import { networkURLs } from '../constants';
import { DidType, ReversedDidList } from '../types';
import { RootState } from './rootReducer';

export const network = createSelector(
  (state: RootState) => state.network,
  (network) => network
);

export const networkUrl = createSelector(
  network,
  (network) => networkURLs[network]
);

export const didsList = createSelector(
  (state: RootState) => state.identities,
  network,
  (identities, network) => Object.keys(identities[network])
);

export const reversedDidList = createSelector(
  (state: RootState) => state.identities,
  network,
  (identities, network): ReversedDidList => {
    return Object.keys(identities[network]).reduce((reversedList: ReversedDidList, did) => {
      const identity = identities[network][did];
      const data = { cdd: identity.cdd, did, didAlias: identity.alias || '' };

      reversedList[identity.priKey] = { ...data, keyType: DidType.primary };

      identity.secKeys.forEach((secKey) => {
        reversedList[secKey] = { ...data, keyType: DidType.secondary };
      });

      return reversedList;
    }, {} as ReversedDidList);
  }
);

export const identifiedAccounts = createSelector(
  (state: RootState) => state.accounts,
  reversedDidList,

  network,
  (accounts, reversedDidList: ReversedDidList, network) => {
    return Object.values(accounts[network]).map((account) => ({ ...account, ...reversedDidList[account.address] }));
  }
);
