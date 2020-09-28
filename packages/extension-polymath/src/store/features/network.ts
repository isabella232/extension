/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';
import { defaultNetwork } from '../../constants';
import { NetworkName } from '../../types';

type State = NetworkName;
const initialState: State = defaultNetwork;

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetwork (state, action: PayloadAction<NetworkName>) {
      return action.payload;
    }
  }
});

export const actions = networkSlice.actions;

export default networkSlice.reducer;
