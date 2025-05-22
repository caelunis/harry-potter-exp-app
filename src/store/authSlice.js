import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase';
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;

export const login = (username) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const userData = { username, house: 'Gryffindor' };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      dispatch(setUser({ uid: firebaseUser.uid, ...userData }));
    }
  } catch (error) {
    dispatch(setError('Failed to log in. Please try again.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await signOut(auth);
    dispatch(clearAuth());
  } catch (error) {
    dispatch(setError('Failed to log out. Please try again.'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const startAuthListener = () => (dispatch) => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        dispatch(setUser({ uid: firebaseUser.uid, ...userDoc.data() }));
      } else {
        dispatch(setUser({ uid: firebaseUser.uid }));
      }
    } else {
      dispatch(clearAuth());
    }
  });
};

export default authSlice.reducer;