const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const exportCsv = (
  filename: string,
  headers: string[],
  rows: Array<Array<unknown>>,
) => {
  if (typeof window === 'undefined') return;

  const normalizedRows = rows.map((row) => row.map(escapeCsvValue).join(','));
  const csvContent = [headers.map(escapeCsvValue).join(','), ...normalizedRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCsvBlob = (filename: string, blob: Blob) => {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
