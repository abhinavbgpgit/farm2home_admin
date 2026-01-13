import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

export const farmersApi = createApi({
  reducerPath: 'farmersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://node-backend-pz3j.onrender.com/api',
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Farmer'],
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    // Get all farmers
    getFarmers: builder.query({
      query: () => '/farmers?limit=10&offset=0',
      transformResponse: (response) => response.data || [],
      providesTags: ['Farmer'],
      keepUnusedDataFor: 300,
    }),

    // Delete farmer
    deleteFarmer: builder.mutation({
      query: (id) => ({
        url: `/farmers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Farmer'],
    }),
  }),
});

export const {
  useGetFarmersQuery,
  useDeleteFarmerMutation,
} = farmersApi;