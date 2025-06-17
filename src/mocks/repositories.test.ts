import { generateMockSearchResponse, mockRepositories } from '@/mocks/repositories';

describe('Mock Repository Data', () => {
  describe('generateMockSearchResponse', () => {
    it('should return all repositories when query matches everything', () => {
      const response = generateMockSearchResponse('', 1, 10);

      expect(response).toEqual({
        total_count: expect.any(Number),
        incomplete_results: false,
        items: expect.any(Array),
      });
      expect(response.items.length).toBeLessThanOrEqual(10);
    });

    it('should filter repositories by query', () => {
      const response = generateMockSearchResponse('react', 1, 10);

      expect(
        response.items.every(
          (repo) =>
            repo.name.toLowerCase().includes('react') ||
            (repo.description && repo.description.toLowerCase().includes('react')) ||
            (repo.language && repo.language.toLowerCase().includes('react')) ||
            repo.owner.login.toLowerCase().includes('react')
        )
      ).toBe(true);
    });

    it('should sort repositories by stars in descending order', () => {
      const response = generateMockSearchResponse('', 1, 10, 'stars', 'desc');

      for (let i = 0; i < response.items.length - 1; i++) {
        expect(response.items[i].stargazers_count).toBeGreaterThanOrEqual(
          response.items[i + 1].stargazers_count
        );
      }
    });

    it('should sort repositories by stars in ascending order', () => {
      const response = generateMockSearchResponse('', 1, 10, 'stars', 'asc');

      for (let i = 0; i < response.items.length - 1; i++) {
        expect(response.items[i].stargazers_count).toBeLessThanOrEqual(
          response.items[i + 1].stargazers_count
        );
      }
    });

    it('should handle pagination correctly', () => {
      const page1 = generateMockSearchResponse('', 1, 2);
      const page2 = generateMockSearchResponse('', 2, 2);

      expect(page1.items.length).toBe(2);
      expect(page2.items.length).toBeGreaterThan(0);

      // Items should be different between pages
      expect(page1.items[0].id).not.toBe(page2.items[0].id);
    });

    it('should return correct total count', () => {
      const response = generateMockSearchResponse('react');

      expect(response.total_count).toBeGreaterThan(0);
      expect(response.total_count).toBe(
        mockRepositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes('react') ||
            (repo.description && repo.description.toLowerCase().includes('react')) ||
            (repo.language && repo.language.toLowerCase().includes('react')) ||
            repo.owner.login.toLowerCase().includes('react')
        ).length
      );
    });
  });

  describe('mockRepositories', () => {
    it('should have valid repository structure', () => {
      mockRepositories.forEach((repo) => {
        expect(repo).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          full_name: expect.any(String),
          updated_at: expect.any(String),
          owner: {
            login: expect.any(String),
            avatar_url: expect.any(String),
          },
          stargazers_count: expect.any(Number),
          forks_count: expect.any(Number),
          language: expect.any(String),
          html_url: expect.any(String),
        });
      });
    });

    it('should have unique repository IDs', () => {
      const ids = mockRepositories.map((repo) => repo.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
