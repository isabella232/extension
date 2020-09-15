/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IdentityData } from '../../types';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

type IdentitiesState = Record<string, IdentityData>;
const initialState: IdentitiesState = {};

const identitiesSlice = createSlice({
  name: 'identities',
  initialState,
  reducers: {
    setIdentity (state, action: PayloadAction<IdentityData>) {
      const identityData = action.payload;

      if (!isEqual(state[identityData.did], identityData)) {
        state[identityData.did] = merge(state[identityData.did], identityData);
      }
    },
    removeIdentity (state, action: PayloadAction<string>) {
      delete state[action.payload];
    }
  }
});

export const actions = identitiesSlice.actions;

export default identitiesSlice.reducer;
