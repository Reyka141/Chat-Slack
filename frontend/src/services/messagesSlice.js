import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messagesSlice',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const { id } = action.payload;
      const restEntities = Object.values(state.entities).filter((e) => e.channelId !== id);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});

export const { actions } = messagesSlice;
export const selector = messagesAdapter.getSelectors((state) => state.messagesSlice);
export default messagesSlice.reducer;
