import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
   }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        body: data,
        url: 'login',
        method: 'POST',
      }),
    }),
    signUpUser: builder.mutation({
      query: (data) => ({
        body: data,
        url: 'signup',
        method: 'POST',
      }),
    }),
  }),
});

const {
  useLoginUserMutation,
  useSignUpUserMutation,
} = userApi;

export {
  useLoginUserMutation as loginUser,
  useSignUpUserMutation as signUpUser,
};
