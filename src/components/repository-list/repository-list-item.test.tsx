import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { RepositoryListItem } from '@/components/repository-list/repository-list-item';
import { githubApi } from '@/store/api/github-api';

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

// Create a test store
const testStore = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={testStore}>{children}</Provider>
);

describe('RepositoryListItem', () => {
  it('should render repository information correctly', () => {
    const { getByText } = render(
      <TestWrapper>
        <RepositoryListItem item={mockRepository} />
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
        <RepositoryListItem item={mockRepository} />
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
        <RepositoryListItem item={repoWithoutDescription} />
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
        <RepositoryListItem item={mockRepository} />
      </TestWrapper>
    );

    // The component should be wrapped in a touchable element
    // Note: This test might need adjustment based on actual implementation
    expect(getByTestId('repository-item-touchable')).toBeTruthy();
  });
});
