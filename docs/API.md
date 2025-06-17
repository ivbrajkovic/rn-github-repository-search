# 📋 API Documentation

This document provides detailed information about the API structure, implementation, and usage patterns in the GitHub Repository Search application.

## GitHub API Integration

### Base Configuration

The app uses RTK Query for efficient API management with the following configuration:

```typescript
export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com',
    prepareHeaders: (headers) => {
      // Set required GitHub API headers
      headers.set('User-Agent', 'RNGitHubRepositorySearch');

      // Add auth token if available (to increase rate limits)
      const token = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Repo'],
  endpoints: (builder) => ({
    // API endpoints defined here
  }),
});
```

### Endpoints

#### `searchRepositories`

**Purpose**: Search GitHub repositories using the GitHub Search API

**Parameters**:

- `query` (string): Search term
- `page` (number, optional): Page number (default: 1)
- `per_page` (number, optional): Results per page (default: 20)
- `sort` (string, optional): Sort criteria ('updated', 'stars', 'forks')
- `order` (string, optional): Sort order ('asc', 'desc')

**Response**: `SearchResponse` object containing:

- `total_count`: Total number of matching repositories
- `incomplete_results`: Boolean indicating if results are incomplete
- `items`: Array of `Repository` objects

**Caching Strategy**:

- Cache key based on query parameters
- Automatic cache invalidation after 5 minutes
- Supports optimistic updates for UI responsiveness

**Example Usage**:

```typescript
import { useSearchRepositoriesQuery } from '../store/api';

// In a component
const {
  data, // The response data
  isLoading, // Loading state
  isFetching, // Additional fetches (next page)
  error, // Error object if request failed
  refetch, // Function to manually refetch
} = useSearchRepositoriesQuery({
  query: 'react',
  page: 1,
  per_page: 20,
  sort: 'stars',
  order: 'desc',
});
```

### Pagination Implementation

The application implements infinite scroll pagination using RTK Query's powerful cache merging capabilities:

```typescript
searchRepositories: builder.query<SearchResponse, SearchParams>({
  query: ({ query, page = 1, per_page = 20, sort, order }) => ({
    url: '/search/repositories',
    params: {
      q: query,
      page,
      per_page,
      sort,
      order,
    },
  }),
  // Merge function to handle pagination
  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    // Create a cache key that doesn't include 'page'
    const { page, ...rest } = queryArgs;
    return `${endpointName}(${JSON.stringify(rest)})`;
  },
  // Merge incoming data with existing data
  merge: (currentCache, newItems, { arg: { page = 1 } }) => {
    // First page replaces cache, subsequent pages append
    if (page === 1) {
      return newItems;
    }

    return {
      ...newItems,
      items: [...(currentCache.items || []), ...(newItems.items || [])],
    };
  },
  // Don't refetch on arg change (handled manually)
  forceRefetch({ currentArg, previousArg }) {
    return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
  },
}),
```

## Rate Limiting Considerations

The GitHub Search API has the following rate limits:

- **Unauthenticated**: 60 requests/hour (based on IP)
- **Authenticated**: 5,000 requests/hour (with personal access token)

To mitigate rate limits during development:

1. Use the provided Mock API (see [Mock API Documentation](../src/mocks/README.md))
2. Add a GitHub token to `.env.local` to increase your rate limit:

```bash
# In your .env.local file
EXPO_PUBLIC_GITHUB_TOKEN=your_personal_access_token_here
```

> **Note:** Personal Access Tokens can be created in your [GitHub Developer Settings](https://github.com/settings/tokens). For this app, a token with the `public_repo` scope is sufficient.

The token will be automatically applied to API requests as shown in the base configuration above.

## Error Handling

The application implements comprehensive error handling for API requests:

- Network errors are captured and displayed with retry options
- Rate limit errors show a specific message with time until reset
- Empty results display a user-friendly "No results" state
- Search errors provide guidance on improving search terms

## Advanced Usage

### Custom Hooks

The application provides several custom hooks to simplify API interaction:

```typescript
// With pagination controls
const { repositories, isLoading, hasMore, loadMore, refresh } = useRepositoriesList(
  searchTerm,
  sortOptions
);

// With debounced search
const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch('');
```

---

For more details on the implementation, refer to the source code in `src/store/api/`.
