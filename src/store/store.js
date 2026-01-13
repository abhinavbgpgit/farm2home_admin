import { configureStore } from '@reduxjs/toolkit';
import { categoriesApi } from './api/categoriesApi';
import { productsApi } from './api/productsApi';
import { farmersApi } from './api/farmersApi';

export const store = configureStore({
  reducer: {
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [farmersApi.reducerPath]: farmersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoriesApi.middleware, productsApi.middleware, farmersApi.middleware),
});