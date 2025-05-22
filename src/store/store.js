import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import favoritesReducer from './favoritesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
  },
});

export default store;