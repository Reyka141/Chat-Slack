import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channelsSlice',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: (state, { payload }) => channelsAdapter
      .updateOne(state, { id: payload.id, changes: payload.changes }),
    removeChannel: (state, { payload }) => channelsAdapter.removeOne(state, payload.id),
  },
});

export const { actions } = channelsSlice;
export const selector = channelsAdapter.getSelectors((state) => state.channelsSlice);
export default channelsSlice.reducer;
