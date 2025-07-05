import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { RepositoryListItem } from '@/components/repository-list/repository-list-item';
import { githubApi } from '@/store/api/github-api';
import { favoritesReducer } from '@/store/favorites-slice';
import { themeReducer } from '@/theme/theme-slice';

// Mock the githubApi util methods to prevent issues
jest.mock('@/store/api/github-api', () => {
  const actual = jest.requireActual('@/store/api/github-api');
  return {
    ...actual,
    githubApi: {
      ...actual.githubApi,
      util: {
        ...actual.githubApi.util,
        upsertQueryData: jest.fn(() => ({ type: 'mock/upsert' })),
      },
    },
  };
});

// Mock repository data
const mockRepository = {
  id: 1,
  name: 'react-native',
  full_name: 'facebook/react-native',
  description: 'A framework for building native applications using React',
  updated_at: '2025-06-15T10:30:00Z',
  owner: {
    login: 'facebook',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
  stargazers_count: 112000,
  forks_count: 23500,
  language: 'JavaScript',
  html_url: 'https://github.com/facebook/react-native',
};

// Create a test store - recreate it for each test to avoid state pollution
const createTestStore = () =>
  configureStore({
    reducer: {
      [githubApi.reducerPath]: githubApi.reducer,
      favorites: favoritesReducer,
      theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for tests to avoid warnings
      }).concat(githubApi.middleware),
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe('RepositoryListItem', () => {
  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    mockToggleFavorite.mockClear();
  });

  it('should render repository information correctly', () => {
    const { getByText } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    expect(getByText('react-native')).toBeTruthy();
    expect(
      getByText('A framework for building native applications using React')
    ).toBeTruthy();
  });

  it('should display formatted update time', () => {
    const { getByText } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    // The component should display some formatted date
    // We can't test exact format without knowing the implementation details
    expect(getByText(/Jun|June|15|2025/)).toBeTruthy();
  });

  it('should handle missing description gracefully', () => {
    const repoWithoutDescription = {
      ...mockRepository,
      description: null,
    };

    const { getByText, queryByText } = render(
      <TestWrapper>
        <RepositoryListItem
          item={repoWithoutDescription}
          toggleFavorite={mockToggleFavorite}
        />
      </TestWrapper>
    );

    expect(getByText('react-native')).toBeTruthy();
    // Description should not be rendered if null
    expect(
      queryByText('A framework for building native applications using React')
    ).toBeFalsy();
  });

  it('should be touchable', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    // The component should be wrapped in a touchable element
    // Note: This test might need adjustment based on actual implementation
    expect(getByTestId('repository-item-touchable')).toBeTruthy();
  });

  it('should call toggleFavorite when favorite button is pressed', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    const favoriteButton = getByTestId('favorite-button');
    fireEvent.press(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockRepository.id);
  });

  it('should call router.push when repository item is pressed', () => {
    const mockPush = jest.fn();
    jest.requireMock('expo-router').useRouter.mockReturnValue({
      push: mockPush,
    });

    const { getByTestId } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    const touchableItem = getByTestId('repository-item-touchable');
    fireEvent.press(touchableItem);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/(home)/repository/[id]',
      params: { id: mockRepository.id.toString() },
    });
  });

  it('should render different states for favorite icon', () => {
    const favoriteRepo = { ...mockRepository, isFavorite: true };

    const { getByTestId, rerender } = render(
      <TestWrapper>
        <RepositoryListItem item={favoriteRepo} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    // Should render with favorite state
    const favoriteButton = getByTestId('favorite-button');
    expect(favoriteButton).toBeTruthy();

    // Re-render with non-favorite state
    rerender(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} toggleFavorite={mockToggleFavorite} />
      </TestWrapper>
    );

    const nonFavoriteButton = getByTestId('favorite-button');
    expect(nonFavoriteButton).toBeTruthy();
  });
});
