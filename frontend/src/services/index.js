import { configureStore } from '@reduxjs/toolkit';

import { channelsApi } from './channelsApi.js';
import { messagesApi } from './messagesApi.js';
import { userApi } from './userApi.js';
import channelsReduser from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';

const store = configureStore({
  reducer: {
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    channelsSlice: channelsReduser,
    messagesSlice: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(channelsApi.middleware, messagesApi.middleware, userApi.middleware),
});

export default store;
