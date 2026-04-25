export interface LunarInfo {
  lunarMonth: string;
  lunarDay: string;
  solarTerm: string | null;
  traditionalFestival: string | null;
  lunarFestival: string | null;
  ganZhiYear: string;
  ganZhiMonth: string;
  ganZhiDay: string;
  zodiac: string;
}

export interface HolidayInfo {
  name: string;
  isOffDay: boolean;
}

export type HolidayMap = Record<string, HolidayInfo>;
