export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function clearToken(): void {
    localStorage.clear();
}

export function setToken(token: Record<string, string>): void {
    Object.entries(token).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
}

export const formatISODate = (isoDateString:any) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', {
      month: 'short', // Abbreviated month name (e.g., "Mar")
      day: 'numeric', // Numeric day (e.g., "19")
      year: 'numeric' // Full year (e.g., "2025")
  });
};