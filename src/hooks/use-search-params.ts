import { SearchRepositoriesParams } from '@/store/api/github-api';
import { useLocalSearchParams } from 'expo-router';

type ExtractSearchParamsReturnType = Required<SearchRepositoriesParams>;

export const DEFAULT_PAGE = 1;
export const DEFAULT_RESULTS_PER_PAGE = 20;
export const DEFAULT_SORT = 'updated';
export const DEFAULT_ORDER = 'desc';

const extractSearchParams = (
  params: Record<string, any>
): ExtractSearchParamsReturnType => {
  const query = typeof params.q === 'string' ? params.q : '';
  const sort = typeof params.sort === 'string' ? params.sort : DEFAULT_SORT;
  const order = typeof params.order === 'string' ? params.order : DEFAULT_ORDER;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : DEFAULT_PAGE;
  const per_page =
    typeof params.per_page === 'string'
      ? parseInt(params.per_page, 10)
      : DEFAULT_RESULTS_PER_PAGE;
  return { query, sort, order, page, per_page } as ExtractSearchParamsReturnType;
};

export const useSearchParams = () => {
  const params = useLocalSearchParams();
  return extractSearchParams(params);
};
