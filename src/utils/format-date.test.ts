import { formatDate } from '@/utils/format-date';

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const dateString = '2025-06-15T10:30:00Z';
    const formatted = formatDate(dateString);

    expect(formatted).toBe('15/06/2025 10:30');
  });

  it('should handle different date formats', () => {
    const dateString = '2025-12-25T23:59:59Z';
    const formatted = formatDate(dateString);

    expect(formatted).toBe('25/12/2025 23:59');
  });

  it('should handle ISO date strings', () => {
    const dateString = '2025-01-01T00:00:00.000Z';
    const formatted = formatDate(dateString);

    expect(formatted).toBe('01/01/2025 00:00');
  });
});
