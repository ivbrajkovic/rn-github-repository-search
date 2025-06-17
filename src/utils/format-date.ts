import { format } from 'date-fns/format';

export const formatDate = (dateString: string) =>
  format(new Date(dateString), 'dd/MM/yyyy HH:mm');
