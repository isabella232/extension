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
      const networkName = action.payload;

      if (!isEqual(state, networkName)) {
        state = networkName;
      }
    }
  }
});

export const actions = networkSlice.actions;

export default networkSlice.reducer;
