import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
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
  tagTypes: ['Product', 'Category'],
  // Disable automatic refetching to rely on cache
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/products',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.imageUrl || product.bgImageUrl || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
            rating: 4.5,
            description: product.description,
            subcategory: product.subcategory,
            productCode: product.productCode,
            vitamins: product.vitamins,
            minerals: product.minerals,
            dietaryFiber: product.dietaryFiber,
            antioxidants: product.antioxidants,
            healthBenefits: product.healthBenefits,
            isActive: product.isActive,
            imageUrl: product.imageUrl,
            bgImageUrl: product.bgImageUrl,
            offReference: product.offReference
          }));
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
      // Keep data cached for 5 minutes (300 seconds)
      keepUnusedDataFor: 300,
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          return {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.imageUrl || product.bgImageUrl || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
            rating: 4.5,
            description: product.description,
            subcategory: product.subcategory,
            productCode: product.productCode,
            vitamins: product.vitamins,
            minerals: product.minerals,
            dietaryFiber: product.dietaryFiber,
            antioxidants: product.antioxidants,
            healthBenefits: product.healthBenefits,
            isActive: product.isActive,
            imageUrl: product.imageUrl,
            bgImageUrl: product.bgImageUrl,
            offReference: product.offReference
          };
        }
        return null;
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 300,
    }),

    // Create new product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      // Invalidate the product list to trigger refetch
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(newProduct, { dispatch, queryFulfilled }) {
        try {
          const { data: createdProduct } = await queryFulfilled;
          // Update the cache with the new product
          dispatch(
            productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
              if (createdProduct.success && createdProduct.data) {
                const product = createdProduct.data;
                draft.push({
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  unit: product.unit,
                  image: product.imageUrl || product.bgImageUrl || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
                  rating: 4.5,
                  description: product.description,
                  subcategory: product.subcategory,
                  productCode: product.productCode,
                  vitamins: product.vitamins,
                  minerals: product.minerals,
                  dietaryFiber: product.dietaryFiber,
                  antioxidants: product.antioxidants,
                  healthBenefits: product.healthBenefits,
                  isActive: product.isActive,
                  imageUrl: product.imageUrl,
                  bgImageUrl: product.bgImageUrl,
                  offReference: product.offReference
                });
              }
            })
          );
        } catch {
          // If the mutation fails, the cache will be invalidated and refetched
        }
      },
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      // Invalidate specific product and list
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Optimistically update the product list
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
            const product = draft.find((p) => p.id === id);
            if (product) {
              Object.assign(product, {
                ...patch,
                image: patch.imageUrl || product.image,
              });
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Undo optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      // Invalidate the product list
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove from cache
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
            const index = draft.findIndex((p) => p.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Undo optimistic update on error
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;