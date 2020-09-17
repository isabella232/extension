import { combineReducers } from '@reduxjs/toolkit';
import accounts from './features/accounts';
import identities from './features/identities';
import network from './features/network';

const rootReducer = combineReducers({
  accounts,
  identities,
  network
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
