import { Solar } from "lunar-javascript";
import { LunarInfo } from "../types";

export const getLunarInfo = (date: Date): LunarInfo => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    lunarMonth: `${lunar.getMonthInChinese()}月`,
    lunarDay: lunar.getDayInChinese(),
    solarTerm: lunar.getJieQi() || null,
    traditionalFestival: lunar.getFestivals()?.[0] || null,
    lunarFestival: lunar.getOtherFestivals()?.[0] || null,
    ganZhiYear: `${lunar.getYearInGanZhi()}年`,
    ganZhiMonth: `${lunar.getMonthInGanZhi()}月`,
    ganZhiDay: `${lunar.getDayInGanZhi()}日`,
    zodiac: lunar.getYearShengXiao(),
  };
};
