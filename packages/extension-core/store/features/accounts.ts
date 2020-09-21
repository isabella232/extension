/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash/merge';

import { AccountData, NetworkName } from '../../types';
type State = Record<NetworkName, Record<string, AccountData>>;
const initialState: State = {
  [NetworkName.pmf]: {},
  [NetworkName.alcyone]: {}
};

type SetAccountPayload = { network: NetworkName, data: AccountData };

type RemoveAccountPayload = { network: NetworkName, address: string };

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccount (state, action: PayloadAction<SetAccountPayload>) {
      const { data, network } = action.payload;
      const prev = state[network][data.address];

      if (!isEqual(data, prev)) {
        state[network][data.address] = merge(prev, data);
      }
    },
    removeAccount (state, action: PayloadAction<RemoveAccountPayload>) {
      const { address, network } = action.payload;

      delete state[network][address];
    }
  }
});

export const actions = accountsSlice.actions;

export default accountsSlice.reducer;
