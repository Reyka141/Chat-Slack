import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

export const fetchChannels = createAsyncThunk(
  'tasks/fetchChannels',
  async () => {
    const token = localStorage.getItem('userId');
    const response = await axios.get(routes.channelsPath(), { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, channelsAdapter.addMany);
  },
});

export const { action } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;