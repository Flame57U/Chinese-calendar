declare module "lunar-javascript" {
  export class Solar {
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getJieQi(): string | null;
    getFestivals(): string[];
    getOtherFestivals(): string[];
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getYearShengXiao(): string;
  }
}
