# 🔄 Pagination & Filtering in React Native App

This document describes the infinite scroll and sorting logic implemented in the GitHub Repository Search React Native application using Expo and Redux Toolkit Query.

---

## 🚀 Features Implemented

### Infinite Scroll Pagination

- Automatically loads more repositories when nearing the end of the list
- Uses `FlatList` for performant virtualization
- Displays a loading spinner during fetches
- Informs the user when all results are loaded

### Sorting Controls

- Sort by: `Updated`, `Stars`, `Forks`, `Help Wanted Issues`
- Toggle between ascending/descending order
- Visual feedback to highlight current sort selection
- Fully responsive layout with theme support

### Deep-Linking & State Sync

- Search query and sort state persist across navigation and refresh
- Designed to allow future URL integration (when used on web)

---

## 🧪 How to Test the Features

### 1. Infinite Scroll

1. Enter a search query (e.g., `react`)
2. Scroll near the bottom of the results list
3. A spinner appears and the next page of results loads
4. Repeats until all pages are fetched

### 2. Sorting

1. Use sort controls to switch between options like `Stars`, `Forks`, etc.
2. Observe the order change and indicator update
3. Toggle the order direction to verify responsiveness

### 3. State Persistence

1. Perform a search and sort
2. Navigate away and back (or refresh if using web)
3. Ensure the search and sort state are restored

---

## 🧰 Technical Highlights

- Pagination uses RTK Query with cursor/page tracking
- Combines pages safely with `lodash.unionBy` to avoid duplicates
- List virtualization via `FlatList`
- Sorting and state management handled with Redux slices
- Loading and error flags protect against redundant fetches

---

## 🛡 Error Handling & Accessibility

- Handles network and pagination errors gracefully
- Displays user-friendly messages for errors and empty results
- Supports keyboard navigation and screen readers (where applicable)
- Accessible sort buttons and loading indicators

---

## 📎 Related Docs

- [`README.md`](./README.md) — Project overview
- [`README.task.md`](./README.task.md) — Challenge details
- [`README.devcontainer.md`](./README.devcontainer.md) — DevContainer + Emulator setup
