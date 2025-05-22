import { createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: { characters: [], spells: [] },
    loading: true,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      state.loading = false;
    },
    addFavorite: (state, action) => {
      const { type, item } = action.payload;
      state.favorites[type] = [...state.favorites[type], item];
    },
    removeFavorite: (state, action) => {
      const { type, id } = action.payload;
      state.favorites[type] = state.favorites[type].filter(item => item.id !== id);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, setLoading, setError } = favoritesSlice.actions;

export const fetchFavorites = (uid) => async (dispatch) => {
  if (!uid) {
    dispatch(setFavorites({ characters: [], spells: [] }));
    dispatch(setLoading(false));
    return;
  }
  try {
    dispatch(setLoading(true));
    const favoritesDocRef = doc(db, 'users', uid, 'favorites', 'data');
    const favoritesDoc = await getDoc(favoritesDocRef);
    if (favoritesDoc.exists()) {
      dispatch(setFavorites(favoritesDoc.data()));
    } else {
      const initialFavorites = { characters: [], spells: [] };
      await setDoc(favoritesDocRef, initialFavorites);
      dispatch(setFavorites(initialFavorites));
    }
  } catch (error) {
    dispatch(setError('Failed to load favorites.'));
    console.error('Error fetching favorites:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveFavorite = (uid, type, item) => async (dispatch) => {
  if (!uid) return;
  try {
    dispatch(setLoading(true));
    const favoritesDocRef = doc(db, 'users', uid, 'favorites', 'data');
    await updateDoc(favoritesDocRef, {
      [type]: arrayUnion(item),
    });
    dispatch(addFavorite({ type, item }));
  } catch (error) {
    dispatch(setError('Failed to add favorite.'));
    console.error('Error adding favorite:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeFavoriteFromStore = (uid, type, id) => async (dispatch) => {
  if (!uid) return;
  try {
    dispatch(setLoading(true));
    const favoritesDocRef = doc(db, 'users', uid, 'favorites', 'data');
    const favorites = await getDoc(favoritesDocRef);
    const itemToRemove = favorites.data()[type].find(item => item.id === id);
    if (itemToRemove) {
      await updateDoc(favoritesDocRef, {
        [type]: arrayRemove(itemToRemove),
      });
      dispatch(removeFavorite({ type, id }));
    }
  } catch (error) {
    dispatch(setError('Failed to remove favorite.'));
    console.error('Error removing favorite:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const isFavorite = (type, id) => (state) => {
  return state.favorites[type].some(item => item.id === id);
};

export default favoritesSlice.reducer;