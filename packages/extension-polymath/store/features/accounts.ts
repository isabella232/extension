/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash/merge';

import { AccountData } from '../../types';
type AccountsState = Record<string, AccountData>;
const initialState: AccountsState = {};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccount (state, action: PayloadAction<AccountData>) {
      const accountData = action.payload;

      if (!isEqual(accountData, state[accountData.address])) {
        state[accountData.address] = merge(state[accountData.address], accountData);
      }
    },
    removeAccount (state, action: PayloadAction<string>) {
      delete state[action.payload];
    }
  }
});

export const actions = accountsSlice.actions;

export default accountsSlice.reducer;
