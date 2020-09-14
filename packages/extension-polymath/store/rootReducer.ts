import { combineReducers } from '@reduxjs/toolkit';
import accounts from './features/accounts';
import identities from './features/identities';

const rootReducer = combineReducers({
  accounts,
  identities
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
