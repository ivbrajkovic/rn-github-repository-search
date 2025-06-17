# 🧪 Mock GitHub API

This directory contains mock implementations of the GitHub API for testing and development purposes. These mocks are particularly useful when working with GitHub's API rate limits or developing offline.

## Available Mocks

### searchRepositoriesMock

A mock implementation of the `searchRepositories` endpoint that returns realistic but fake data instead of making actual API calls. The mock:

- Simulates network latency (configurable)
- Handles pagination, sorting and filtering
- Provides consistent data for testing
- Never hits rate limits

## Usage

```tsx
// Import the mock query hooks
import {
  useSearchRepositoriesMockQuery,
  useLazySearchRepositoriesMockQuery,
} from '../store/api';

// Use exactly the same way as the real API
const { data, isLoading, error } = useSearchRepositoriesMockQuery({
  query: 'react',
  page: 1,
  per_page: 20,
  sort: 'stars',
  order: 'desc',
});

// Or with the lazy version
const [trigger, { data, isLoading }] = useLazySearchRepositoriesMockQuery();

// Call it later
trigger({ query: 'typescript' });
```

## Mock Data Structure

The mock data includes several popular repositories related to React Native, TypeScript, and other technologies. Each repository follows the GitHub API schema:

```typescript
interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    // other owner properties...
  };
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string;
  // additional properties...
}
```

You can add more mock repositories by editing `src/mock/repositories.ts`.

## Mock Features

The mock implementation supports:

- **Text search**: Filtering by name, description, language, and owner
- **Pagination**: Proper handling of page and per_page parameters
- **Sorting**: By stars, forks, updated date
- **Ordering**: Ascending or descending
- **Simulated delays**: Configurable network latency

## Switching Between Real and Mock API

To switch between the real API and the mock API in your components, simply change the import:

```tsx
// For real API
import { useSearchRepositoriesQuery } from '../store/api';

// For mock API
import { useSearchRepositoriesMockQuery } from '../store/api';
```

## Testing with Mocks

The mock API is particularly useful for testing UI components:

```tsx
// In your test file
import { render, screen } from '@testing-library/react-native';
import { RepositoryList } from './RepositoryList';
import * as api from '../store/api';

// Mock the API hook
jest.spyOn(api, 'useSearchRepositoriesQuery').mockImplementation(() => ({
  data: {
    items: [
      /* mock repositories */
    ],
    total_count: 100,
    incomplete_results: false,
  },
  isLoading: false,
  isFetching: false,
  error: undefined,
  refetch: jest.fn(),
}));

test('renders repository list correctly', () => {
  render(<RepositoryList searchTerm="react" />);
  // Your test assertions here
});
```

---

This mock API implementation enables reliable testing and development without worrying about GitHub API rate limits.
