/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line header/header
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

// @TODO fix this
declare let module: any;

const middleware = [...getDefaultMiddleware()];

if (process.env.NODE_ENV === 'development' && logger) {
  middleware.push(logger);
}

const store = configureStore({
  middleware,
  reducer: rootReducer
});

// Reducer hot module reloading
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;

    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch

export default store;
