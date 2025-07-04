import { RootState } from '@/store/store-types';

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
  isFavorite?: boolean; // Optional for UI purposes
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

export type Meta = {
  getState: () => RootState;
};
