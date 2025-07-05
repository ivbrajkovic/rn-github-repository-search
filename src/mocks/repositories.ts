import { Repository, SearchResponse } from '@/store/api/github-api-types';

// Mock repository data
export const mockRepositories: Repository[] = [
  {
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
  },
  {
    id: 2,
    name: 'expo',
    full_name: 'expo/expo',
    description:
      'An open-source platform for making universal native apps with React, Expo Go is a client app that lets you run React Native projects without needing to build native code.',
    updated_at: '2025-06-18T14:45:00Z',
    owner: {
      login: 'expo',
      avatar_url: 'https://avatars.githubusercontent.com/u/12504344?v=4',
    },
    stargazers_count: 24000,
    forks_count: 3800,
    language: 'TypeScript',
    html_url: 'https://github.com/expo/expo',
  },
  {
    id: 3,
    name: 'redux-toolkit',
    full_name: 'reduxjs/redux-toolkit',
    description:
      'The official, opinionated, batteries-included toolset for efficient Redux development',
    updated_at: '2025-06-20T09:15:00Z',
    owner: {
      login: 'reduxjs',
      avatar_url: 'https://avatars.githubusercontent.com/u/13142323?v=4',
    },
    stargazers_count: 9800,
    forks_count: 890,
    language: 'TypeScript',
    html_url: 'https://github.com/reduxjs/redux-toolkit',
  },
  {
    id: 4,
    name: 'TypeScript',
    full_name: 'microsoft/TypeScript',
    description:
      'TypeScript is a superset of JavaScript that compiles to clean JavaScript output',
    updated_at: '2025-06-21T16:20:00Z',
    owner: {
      login: 'microsoft',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
    },
    stargazers_count: 93000,
    forks_count: 12000,
    language: 'TypeScript',
    html_url: 'https://github.com/microsoft/TypeScript',
  },
  {
    id: 5,
    name: 'react-navigation',
    full_name: 'react-navigation/react-navigation',
    description: 'Routing and navigation for your React Native apps',
    updated_at: '2025-06-19T11:10:00Z',
    owner: {
      login: 'react-navigation',
      avatar_url: 'https://avatars.githubusercontent.com/u/29647600?v=4',
    },
    stargazers_count: 22500,
    forks_count: 4800,
    language: 'TypeScript',
    html_url: 'https://github.com/react-navigation/react-navigation',
  },
];

// Helper function to generate mock search response
export const generateMockSearchResponse = (
  query: string,
  page: number = 1,
  per_page: number = 20,
  sort?: string,
  order?: string
): SearchResponse => {
  // Filter repositories based on the query
  // Simple implementation that checks if query is in name, description, or language
  const filteredRepos = mockRepositories.filter((repo) => {
    const searchQuery = query.toLowerCase();
    return (
      repo.name.toLowerCase().includes(searchQuery) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery)) ||
      (repo.language && repo.language.toLowerCase().includes(searchQuery)) ||
      repo.owner.login.toLowerCase().includes(searchQuery)
    );
  });

  // Apply sorting
  let sortedRepos = [...filteredRepos];
  if (sort) {
    sortedRepos.sort((a, b) => {
      switch (sort) {
        case 'stars':
          return order === 'asc'
            ? a.stargazers_count - b.stargazers_count
            : b.stargazers_count - a.stargazers_count;
        case 'forks':
          return order === 'asc'
            ? a.forks_count - b.forks_count
            : b.forks_count - a.forks_count;
        case 'updated':
          return order === 'asc'
            ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
            : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });
  }

  // Apply pagination
  const startIndex = (page - 1) * per_page;
  const paginatedRepos = sortedRepos.slice(startIndex, startIndex + per_page);

  return {
    total_count: filteredRepos.length,
    incomplete_results: false,
    items: paginatedRepos,
  };
};
