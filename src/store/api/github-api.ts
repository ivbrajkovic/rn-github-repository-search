import {
  BASE_URL,
  DEFAULT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_RESULTS_PER_PAGE,
  DEFAULT_SORT,
} from '@/store/api/github-api-constants';
import {
  Meta,
  Repository,
  SearchRepositoriesParams,
  SearchResponse,
} from '@/store/api/github-api-types';
import { RootState } from '@/store/store-types';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import unionBy from 'lodash/unionBy';

const baseQueryWithConfig = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    // GitHub API recommends including a user-agent
    headers.set('User-Agent', 'RNGitHubRepositorySearch');

    // Add auth token if available (to increase rate limits)
    const token = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
    if (token) headers.set('Authorization', `Bearer ${token}`);

    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  Meta & FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithConfig(args, api, extraOptions);

  // Enhance the meta object with typed getState
  return {
    ...result,
    meta: {
      ...result.meta,
      getState: api.getState as () => RootState,
    } as Meta & FetchBaseQueryMeta,
  };
};

// Define the API with proper type
export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery,
  tagTypes: ['Repo'],
  endpoints: (builder) => ({
    searchRepositories: builder.query<SearchResponse, SearchRepositoriesParams>({
      query: ({ query, page, per_page, sort, order }) => {
        const q = query;
        const otherParams = new URLSearchParams({
          page: String(page || DEFAULT_PAGE),
          per_page: String(per_page || DEFAULT_RESULTS_PER_PAGE),
          sort: sort || DEFAULT_SORT,
          order: order || DEFAULT_ORDER,
        });
        return {
          url: `/search/repositories?q=${q}&${otherParams.toString()}`,
          headers: { Accept: 'application/vnd.github.v3+json' },
        };
      },
      // Adding serializeQueryArgs to handle pagination properly
      serializeQueryArgs: ({ queryArgs }) => {
        // Only use the query for cache key, ignore pagination params
        return { query: queryArgs.query };
      },
      // Merge incoming items with existing ones
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page && arg.page > 1) {
          return {
            ...newItems, // Use latest metadata (total_count, etc.)
            // unionBy creates a union of arrays, with duplicates identified by 'id'
            // Items from the second array (newItems) take precedence over the first
            items: unionBy(newItems.items, currentCache.items, 'id'),
          };
        }
        // Otherwise return new response (first page or new search)
        return newItems;
      },
      // Only refetch when forceRefetch is true or arguments change
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.query !== previousArg?.query ||
          currentArg?.page !== previousArg?.page ||
          currentArg?.per_page !== previousArg?.per_page ||
          currentArg?.sort !== previousArg?.sort ||
          currentArg?.order !== previousArg?.order
        );
      },
      keepUnusedDataFor: 300, // Keep data for 5 minutes
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Repo' as const, id })),
              { type: 'Repo' as const, id: 'LIST' },
            ]
          : [{ type: 'Repo' as const, id: 'LIST' }],
      transformResponse: (
        response: SearchResponse,
        { getState }: Meta & FetchBaseQueryMeta
      ): SearchResponse => {
        const favoriteSet = new Set(getState().favorites.repositoryIds);
        return {
          ...response,
          items: response.items.map((item) => {
            // Transform the response to include isFavorite flag
            const isFavorite = favoriteSet.has(item.id);
            return { ...item, isFavorite };
          }),
        };
      },
    }),

    repoById: builder.query<Repository, number>({
      query: (id) => `/repositories/${id}`,
      keepUnusedDataFor: 600, // Keep data for 10 minutes
      providesTags: (_result, _error, id) => [{ type: 'Repo' as const, id }],
    }),

    getRepositoriesByIds: builder.query<Repository[], number[]>({
      queryFn: async (
        ids: number[],
        api,
        _extraOptions,
        fetchWithBQ
      ): Promise<{ data: Repository[] } | { error: any }> => {
        if (ids.length === 0) {
          return { data: [] };
        }

        // Use Promise.all to fetch all repositories concurrently.
        const results = await Promise.all(
          ids.map((id) => fetchWithBQ(`/repositories/${id}`))
        );

        // Check for errors in the results.
        const failedResult = results.find((result) => result.error);
        if (failedResult && failedResult.error) {
          return {
            error: failedResult.error,
          };
        }

        // Extract the data from the results and add isFavorite flag
        const favoriteSet = new Set(
          (api.getState() as RootState).favorites.repositoryIds
        );
        const data = results.map((result) => {
          const repo = result.data as Repository;
          return {
            ...repo,
            // Add isFavorite flag based on the favorites state
            isFavorite: favoriteSet.has(repo.id),
          };
        });

        return { data };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Repo' as const, id }))] : [],
    }),
  }),
});

export const {
  useSearchRepositoriesQuery,
  useLazySearchRepositoriesQuery,
  useRepoByIdQuery,
  useGetRepositoriesByIdsQuery,
} = githubApi;
