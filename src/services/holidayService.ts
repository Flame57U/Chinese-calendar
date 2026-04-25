import { HolidayMap } from "../types";

const yearCache: Record<number, HolidayMap> = {};

const fetchYearHolidays = async (year: number): Promise<HolidayMap> => {
  if (yearCache[year]) return yearCache[year];
  try {
    const response = await fetch(
      `https://api.jiejiariapi.com/v1/holidays/${year}`,
    );
    if (!response.ok) return {};
    const data = (await response.json()) as HolidayMap;
    yearCache[year] = data;
    return data;
  } catch {
    return {};
  }
};

export const fetchHolidaysByMonth = async (
  year: number,
  month: number,
): Promise<HolidayMap> => {
  const all = await fetchYearHolidays(year);
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return Object.fromEntries(
    Object.entries(all).filter(([d]) => d.startsWith(prefix)),
  );
};
