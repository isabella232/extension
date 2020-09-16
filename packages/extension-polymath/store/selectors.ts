import { createSelector } from '@reduxjs/toolkit';
import { networkURLs } from '../constants';
import { DidType, ReversedDidList } from '../types';
import { RootState } from './rootReducer';

export const didsList = createSelector(
  (state: RootState) => state.identities,
  (identities) => Object.keys(identities)
);

export const reversedDidList = createSelector(
  (state: RootState) => state.identities,
  (identities): ReversedDidList => {
    return Object.keys(identities).reduce((reversedList: ReversedDidList, did) => {
      const identity = identities[did];
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
  (accounts, reversedDidList: ReversedDidList) => {
    return Object.values(accounts).map((account) => ({ ...account, ...reversedDidList[account.address] }));
  }
);

export const network = createSelector(
  (state: RootState) => state.network,
  (network) => network
);

export const networkUrl = createSelector(
  network,
  (network) => networkURLs[network]
);
