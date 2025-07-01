import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import unionBy from 'lodash/unionBy';

export type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
};

export type SearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
};

export type SearchRepositoriesParams = {
  query: string;
  page?: number;
  per_page?: number;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_RESULTS_PER_PAGE = 20;
export const DEFAULT_SORT = 'updated';
export const DEFAULT_ORDER = 'desc';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com',
    prepareHeaders: (headers) => {
      // GitHub API recommends including a user-agent
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
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
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
    }),

    repoById: builder.query<Repository, number>({
      query: (id) => `/repositories/${id}`,
      keepUnusedDataFor: 600, // Keep data for 10 minutes
      providesTags: (_result, _error, id) => [{ type: 'Repo' as const, id }],
    }),
  }),
});

export const {
  useSearchRepositoriesQuery,
  useLazySearchRepositoriesQuery,
  useRepoByIdQuery,
} = githubApi;
