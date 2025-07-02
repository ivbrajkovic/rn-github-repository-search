import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  repositoryIds: number[];
}

const initialState: FavoritesState = {
  repositoryIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      state.repositoryIds.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.repositoryIds = state.repositoryIds.filter(id => id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
