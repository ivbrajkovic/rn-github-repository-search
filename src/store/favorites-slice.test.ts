import { addFavorite, favoritesReducer, removeFavorite } from './favorites-slice';

describe('favoritesSlice', () => {
  const initialState = {
    repositoryIds: [],
  };

  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add a favorite repository id', () => {
    const actual = favoritesReducer(initialState, addFavorite(123));
    expect(actual.repositoryIds).toEqual([123]);
  });

  it('should not add duplicate favorite repository ids', () => {
    const stateWithOneFavorite = {
      repositoryIds: [123],
    };
    const actual = favoritesReducer(stateWithOneFavorite, addFavorite(123));
    expect(actual.repositoryIds).toEqual([123]);
  });

  it('should add multiple different favorite repository ids', () => {
    const stateWithOneFavorite = {
      repositoryIds: [123],
    };
    const actual = favoritesReducer(stateWithOneFavorite, addFavorite(456));
    expect(actual.repositoryIds).toEqual([123, 456]);
  });

  it('should remove a favorite repository id', () => {
    const stateWithFavorites = {
      repositoryIds: [123, 456],
    };
    const actual = favoritesReducer(stateWithFavorites, removeFavorite(123));
    expect(actual.repositoryIds).toEqual([456]);
  });

  it('should not change state when removing non-existent favorite', () => {
    const stateWithFavorites = {
      repositoryIds: [123, 456],
    };
    const actual = favoritesReducer(stateWithFavorites, removeFavorite(789));
    expect(actual.repositoryIds).toEqual([123, 456]);
  });

  it('should remove favorite from empty state', () => {
    const actual = favoritesReducer(initialState, removeFavorite(123));
    expect(actual.repositoryIds).toEqual([]);
  });
});
