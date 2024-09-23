import { configureStore } from '@reduxjs/toolkit';

import { channelsApi } from './channelsApi.js';
import { messagesApi } from './messagesApi.js';

const store = configureStore({
  reducer: {
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(channelsApi.middleware, messagesApi.middleware),
});

export default store;
