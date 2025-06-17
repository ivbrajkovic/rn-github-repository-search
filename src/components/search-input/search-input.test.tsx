import { SearchInput } from '@/components/search-input/search-input';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    setParams: jest.fn(),
  }),
  useLocalSearchParams: () => ({ q: '' }),
}));
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<SearchInput />);
    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('should update search query on text change', () => {
    const { getByTestId } = render(<SearchInput />);
    const textInput = getByTestId('search-input');

    fireEvent.changeText(textInput, 'react');

    expect(textInput.props.value).toBe('react');
  });

  it('should clear search query when clear button is pressed', () => {
    const { getByTestId } = render(<SearchInput />);
    const textInput = getByTestId('search-input');

    // First enter some text
    fireEvent.changeText(textInput, 'react');
    expect(textInput.props.value).toBe('react');

    // Then clear it
    fireEvent.press(getByTestId('search-clear-button'));
    expect(textInput.props.value).toBe('');
  });
});
