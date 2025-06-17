import { mockGithubApi } from '@/store/api/mock-github-api';

describe('Mock GitHub API', () => {
  describe('searchRepositoriesMock endpoint', () => {
    it('should have the correct endpoint name and hooks', () => {
      expect(mockGithubApi.endpoints.searchRepositoriesMock).toBeDefined();
      expect(mockGithubApi.endpoints.searchRepositoriesMock.useQuery).toBeDefined();
      expect(mockGithubApi.endpoints.searchRepositoriesMock.useLazyQuery).toBeDefined();
    });

    it('should export the correct hook functions', () => {
      expect(typeof mockGithubApi.endpoints.searchRepositoriesMock.useQuery).toBe(
        'function'
      );
      expect(typeof mockGithubApi.endpoints.searchRepositoriesMock.useLazyQuery).toBe(
        'function'
      );
    });
  });
});
