import { generateMockSearchResponse } from '../../mocks/repositories';
import { githubApi, SearchRepositoriesParams, SearchResponse } from './github-api';

// Create a mock API extension
export const mockGithubApi = githubApi.injectEndpoints({
  endpoints: (builder) => ({
    searchRepositoriesMock: builder.query<SearchResponse, SearchRepositoriesParams>({
      // Mock query implementation that uses our mock data
      queryFn: (params) => {
        const { query, page, per_page, sort, order } = params;

        try {
          // Generate mock response using our helper
          const response = generateMockSearchResponse(query, page, per_page, sort, order);

          return { data: response };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      // Reuse the same caching and merging logic from the real endpoint
      serializeQueryArgs: ({ queryArgs }) => {
        return { query: queryArgs.query };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page && arg.page > 1) {
          return {
            ...newItems,
            items: [...currentCache.items, ...newItems.items],
          };
        }
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.query !== previousArg?.query ||
          currentArg?.page !== previousArg?.page ||
          currentArg?.per_page !== previousArg?.per_page ||
          currentArg?.sort !== previousArg?.sort ||
          currentArg?.order !== previousArg?.order
        );
      },
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Repo' as const, id })),
              { type: 'Repo' as const, id: 'LIST' },
            ]
          : [{ type: 'Repo' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

// Export the hooks for using the mock endpoint
export const { useSearchRepositoriesMockQuery, useLazySearchRepositoriesMockQuery } =
  mockGithubApi;
