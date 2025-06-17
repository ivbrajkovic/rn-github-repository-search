# 📃 Mobile Code Challenge Summary

This document outlines how the implementation aligns with the original challenge prompt and acceptance criteria, and provides detailed instructions for installation, usage, feature functionality, testing, and mocking.

---

## 🔗 Challenge Description Summary

> Build a mobile app that allows users to search GitHub repositories via the GitHub Search API and view details per repository.

---

## ✅ Acceptance Criteria Checklist

| #   | Requirement                                                 | Status |
| --- | ----------------------------------------------------------- | ------ |
| 1   | User can enter text into a search bar and initiate a search | ✅     |
| 2   | Results are shown in a scrollable list                      | ✅     |
| 3   | Each item displays repo name + last update time             | ✅     |
| 4   | List dynamically updates based on search                    | ✅     |
| 5   | Results sorted descending by last update                    | ✅     |
| 6   | Tapping repo navigates to detail screen                     | ✅     |
| 7   | Detail screen shows name, time, owner, description          | ✅     |
| 8   | Uses GitHub Search API                                      | ✅     |
| 9   | App runs on standard iOS/Android emulator                   | ✅     |
| 10  | Source code committed to public repository                  | ✅     |
| 11  | Repo link available for review                              | ✅     |

---

## 🚀 Bonus Implementations

The following enhancements go beyond the requirements and are included:

- [x] **Debounced input** for performance (300ms delay to minimize API calls)
- [x] **Redux Toolkit + RTK Query** for global state and API caching
- [x] **Loading, error, and empty states** with visual feedback
- [x] **Theming** (light/dark) with themed components and system preference detection
- [x] **Responsive layout** for different screen sizes
- [x] **Pull to refresh** on results with haptic feedback
- [x] **File-based navigation with Expo Router**
- [x] **Code typed in TypeScript with full safety**
- [x] **Infinite scroll** for seamless user experience (20 items per page)
- [x] **Optimistic cache updates** for faster interactions

---

## 🛠️ Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/rn-github-repository-search.git
   cd rn-github-repository-search
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Run the app on an emulator:
   - For Android: `pnpm android`
   - For iOS: `pnpm ios`
   - For web preview: `pnpm web`

---

## 📖 Feature Explanations

### Search Functionality

- Users can enter text into the search bar to query GitHub repositories
- The input is debounced (300ms) for performance, ensuring minimal API calls
- Real-time results update as you type
- Advanced sorting options (stars, forks, last update)

### Scrollable List

- Results are displayed in a scrollable list using `FlatList` for efficient rendering
- Infinite scroll is implemented to load more results as the user scrolls
- Pull-to-refresh provides a way to reload the latest data
- Each item displays repository name and last update time

### Repository Details

- Tapping on a repository navigates to a detail screen showing:
  - Repository name
  - Last update time
  - Owner information with avatar
  - Full description
  - Statistics (stars, forks, etc.)

### User Interface

- Light and dark theme support with system preference detection
- Responsive design works on various screen sizes
- Graceful error states with retry options
- Loading states with skeleton loaders

### Developer Experience

- Mock API for offline development without GitHub rate limits
- Full TypeScript coverage for type safety
- RTK Query for efficient data fetching and caching
- Hot reload support for fast development iteration

---

## 🧪 Testing and Mocking

### Unit Tests

- The project includes unit tests for hooks and components
- Run tests using:
  ```bash
  pnpm test
  ```

### Mocking

- Mock data is used to simulate API responses for testing
- Mock files are located in `src/mocks/`
- Switch to mock API to avoid rate limits during development:

```tsx
// Replace real API hook with mock version
import { useSearchRepositoriesMockQuery } from '../store/api/mock-api';

const { data, isLoading, error } = useSearchRepositoriesMockQuery({
  query: 'react',
  page: 1,
  per_page: 20,
  sort: 'stars',
  order: 'desc',
});
```

---

## 📚 Related Documentation

For more detailed information about specific aspects of the application:

- [Architecture Overview](ARCHITECTURE.md) - Project structure and design patterns
- [API Reference](API.md) - Detailed API integration guide
- [Pagination & Filtering](PAGINATION-FILTERING.md) - Deep dive into infinite scroll implementation
- [Development Setup](DEVCONTAINER.md) - DevContainer and emulator configuration

---

This implementation fully satisfies and exceeds all the defined acceptance criteria for the challenge.
