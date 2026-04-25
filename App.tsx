import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { fetchHolidaysByMonth } from "./src/services/holidayService";
import { getLunarInfo } from "./src/services/lunarService";
import { HolidayMap } from "./src/types";

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<HolidayMap>({});
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    let cancelled = false;
    const targetMonths = [
      month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 },
      { y: year, m: month },
      month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 },
    ];

    const load = async () => {
      setLoading(true);
      const responses = await Promise.all(
        targetMonths.map(({ y, m }) => fetchHolidaysByMonth(y, m)),
      );

      if (!cancelled) {
        setHolidays((prev) => ({
          ...prev,
          ...Object.assign({}, ...responses),
        }));
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [month, year]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [days]);

  const selectedLunar = useMemo(
    () => getLunarInfo(selectedDate),
    [selectedDate],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#f4f6fb" }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: 16,
          gap: 14,
          borderWidth: 1,
          borderColor: "#e6e9f0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              selectable
              style={{ fontSize: 28, fontWeight: "800", color: "#101828" }}
            >
              {format(currentDate, "yyyy年MM月")}
            </Text>
            <Text
              selectable
              style={{ marginTop: 4, color: "#667085", fontSize: 13 }}
            >
              {selectedLunar.ganZhiYear} · {selectedLunar.zodiac}年 ·{" "}
              {selectedLunar.ganZhiMonth}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {loading ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : null}
            <Pressable
              onPress={() => setCurrentDate(subMonths(currentDate, 1))}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                borderWidth: 1,
                borderColor: "#d0d5dd",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#344054" }}>‹</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDate(now);
              }}
              style={{
                backgroundColor: "#111827",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ color: "#ffffff", fontWeight: "700", fontSize: 12 }}
              >
                今天
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setCurrentDate(addMonths(currentDate, 1))}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                borderWidth: 1,
                borderColor: "#d0d5dd",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#344054" }}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 4 }}>
          {WEEK_LABELS.map((label, index) => (
            <Text
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                color: index === 0 || index === 6 ? "#dc2626" : "#667085",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {label}
            </Text>
          ))}
        </View>

        <View style={{ gap: 4 }}>
          {weeks.map((week, rowIndex) => (
            <View
              key={`week-${rowIndex}`}
              style={{ flexDirection: "row", gap: 4 }}
            >
              {week.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const holiday = holidays[dateKey];
                const lunar = getLunarInfo(day);
                const selected = isSameDay(day, selectedDate);
                const outMonth = !isSameMonth(day, currentDate);
                const today = isToday(day);
                const dayOfWeek = day.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <Pressable
                    key={dateKey}
                    onPress={() => setSelectedDate(day)}
                    style={{
                      flex: 1,
                      minHeight: 62,
                      borderRadius: 12,
                      paddingVertical: 6,
                      paddingHorizontal: 5,
                      backgroundColor: selected
                        ? "#1d4ed8"
                        : holiday?.isOffDay
                          ? "rgb(255, 237, 213)"
                          : "#f8fafc",
                      borderWidth: 1,
                      borderColor: selected ? "#1e40af" : "#e2e8f0",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: "800",
                        color: selected
                          ? "#ffffff"
                          : outMonth
                            ? "#98a2b3"
                            : today
                              ? "#2563eb"
                              : holiday && !holiday.isOffDay
                                ? "#000000"
                                : isWeekend || holiday?.isOffDay
                                  ? "#dc2626"
                                  : "#111827",
                      }}
                    >
                      {format(day, "d")}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginTop: 2,
                        textAlign: "center",
                        fontSize: 10,
                        color: selected ? "#dbeafe" : "#475467",
                      }}
                    >
                      {holiday?.name || lunar.solarTerm || lunar.lunarDay}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: 16,
          gap: 10,
          borderWidth: 1,
          borderColor: "#e6e9f0",
        }}
      >
        <Text
          selectable
          style={{ fontSize: 22, fontWeight: "800", color: "#111827" }}
        >
          {format(selectedDate, "yyyy年M月d日 EEEE", { locale: zhCN })}
        </Text>
        <Text selectable style={{ color: "#334155", fontSize: 15 }}>
          农历：{selectedLunar.lunarMonth}
          {selectedLunar.lunarDay}
        </Text>
        <Text selectable style={{ color: "#334155", fontSize: 15 }}>
          干支：{selectedLunar.ganZhiYear} {selectedLunar.ganZhiMonth}{" "}
          {selectedLunar.ganZhiDay}
        </Text>
        <Text selectable style={{ color: "#334155", fontSize: 15 }}>
          节气/节日：
          {selectedLunar.solarTerm ||
            selectedLunar.traditionalFestival ||
            selectedLunar.lunarFestival ||
            "暂无"}
        </Text>
        {holidays[format(selectedDate, "yyyy-MM-dd")] ? (
          <View
            style={{
              marginTop: 4,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: holidays[format(selectedDate, "yyyy-MM-dd")]
                .isOffDay
                ? "#ea580c"
                : "#0f766e",
            }}
          >
            <Text selectable style={{ color: "#ffffff", fontWeight: "700" }}>
              {holidays[format(selectedDate, "yyyy-MM-dd")].name} ·
              {holidays[format(selectedDate, "yyyy-MM-dd")].isOffDay
                ? " 休息日"
                : " 调休工作日"}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
