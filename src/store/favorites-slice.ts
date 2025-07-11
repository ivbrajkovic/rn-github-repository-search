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
      if (!state.repositoryIds.includes(action.payload))
        state.repositoryIds.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.repositoryIds = state.repositoryIds.filter((id) => id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
