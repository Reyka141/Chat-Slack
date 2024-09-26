import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const channelsApi = createApi({
  reducerPath: 'tasks',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/channels',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('userId'); // Получаем токен из localStorage при каждом запросе

      if (token) {
        // Добавляем токен в заголовки запроса
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers; // Возвращаем изменённые заголовки
    },
  }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '',
    }),
    addChannel: builder.mutation({
      query: (text) => ({
        method: 'POST',
        body: text,
      }),
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: id,
        body: { name },
        method: 'PATCH',
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: id,
        method: 'DELETE',
      }),
    }),
  }),
});

const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useRemoveChannelMutation,
  useRenameChannelMutation,
} = channelsApi;

export {
  useGetChannelsQuery as getChannels,
  useAddChannelMutation as addChannel,
  useRenameChannelMutation as renameChannel,
  useRemoveChannelMutation as removeChannel,
};
