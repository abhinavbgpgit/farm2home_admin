import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get token from localStorage or wherever you store it
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
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
  tagTypes: ['Category'],
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => response.data?.categories || [],
      providesTags: ['Category'],
      keepUnusedDataFor: 300,
    }),

    // Get single category by ID
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // Create new category
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

        // Update category
        updateCategory: builder.mutation({
          query: ({ id, ...data }) => ({
            url: `/categories/${id}`,
            method: 'PATCH',
            body: data,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
        }),

    // Update category status (toggle active/inactive)
    updateCategoryStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/categories/${id}/status`,
        method: 'PATCH',
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

        // Delete category
        deleteCategory: builder.mutation({
          query: (id) => ({
            url: `/categories/${id}`,
            method: 'DELETE',
            body: {},
          }),
          invalidatesTags: ['Category'],
        }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoriesApi;