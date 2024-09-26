import { configureStore } from '@reduxjs/toolkit';

import { channelsApi } from './channelsApi.js';
import { messagesApi } from './messagesApi.js';
import { userApi } from './userApi.js';

const store = configureStore({
  reducer: {
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(channelsApi.middleware, messagesApi.middleware, userApi.middleware),
});

export default store;
