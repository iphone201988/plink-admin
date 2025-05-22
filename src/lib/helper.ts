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

const courtType = {
  Dedicated: 1,
  Reservable: 2,
  Lighted: 3,
  Indoor: 4,
  Outdoor: 5,
  "Permanent lines": 6,
} as const;

type CourtTypeKey = keyof typeof courtType;
type CourtTypeValue = (typeof courtType)[CourtTypeKey];

export const getCourtTypeKey = (value: CourtTypeValue): CourtTypeKey | undefined =>
  Object.keys(courtType).find(
    (key) => courtType[key as CourtTypeKey] === value
  ) as CourtTypeKey | undefined;
