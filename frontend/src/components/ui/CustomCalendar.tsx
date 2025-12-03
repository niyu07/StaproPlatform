import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import type { ScheduleWithRelations } from "@/types/database";

interface CustomCalendarProps {
  schedules: ScheduleWithRelations[];
  onScheduleClick?: (schedule: ScheduleWithRelations) => void;
  onDateClick?: (date: Date) => void;
}

export const CustomCalendar = ({
  schedules,
  onScheduleClick,
  onDateClick,
}: CustomCalendarProps) => {
  // スケジュールデータから最初の日付を取得して、その年月を初期表示にする
  const getInitialDate = () => {
    if (schedules.length > 0) {
      const firstSchedule = schedules[0];
      const scheduleDate = new Date(firstSchedule.start_time);
      return new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), 1);
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(getInitialDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (日曜) から 6 (土曜)
  const daysInMonth = lastDayOfMonth.getDate();

  // 今日の日付を取得
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // 指定日のスケジュールを取得
  const getSchedulesForDay = (day: number) => {
    const targetDate = new Date(year, month, day);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time);
      const scheduleYear = scheduleDate.getFullYear();
      const scheduleMonth = scheduleDate.getMonth();
      const scheduleDay = scheduleDate.getDate();
      
      return (
        scheduleYear === targetYear &&
        scheduleMonth === targetMonth &&
        scheduleDay === targetDay
      );
    });
  };

  // カレンダーの日付配列を生成
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    // 前月の空白を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 今月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDayOfWeek, daysInMonth]);

  // 月のナビゲーション
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 曜日のラベル
  const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  // 月名を取得
  const monthName = `${year}年${month + 1}月`;

  return (
    <div className="w-full">
      {/* ヘッダー: 月のナビゲーション */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[120px] text-center">
            {monthName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDayLabels.map((day, index) => (
            <div
              key={index}
              className={cn(
                "p-3 text-center text-sm font-medium",
                index === 1 && "text-blue-600", // 月曜日を青に
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[120px] border-r border-b border-border last:border-r-0"
                />
              );
            }

            const daySchedules = getSchedulesForDay(day);
            const isTodayDay = isToday(day);

            // 曜日を取得
            const dayOfWeek = new Date(year, month, day).getDay();
            const dayOfWeekName = weekDayLabels[dayOfWeek];

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[120px] border-r border-b border-border last:border-r-0 p-2",
                  "flex flex-col gap-1",
                  "cursor-pointer hover:bg-gray-50",
                )}
                onClick={(e) => {
                  // スケジュールアイテムのクリックイベントを防ぐ
                  if ((e.target as HTMLElement).closest('.schedule-item')) {
                    return;
                  }
                  if (onDateClick) {
                    const clickedDate = new Date(year, month, day);
                    onDateClick(clickedDate);
                  }
                }}
              >
                {/* 日付ラベル */}
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isTodayDay && "text-blue-600",
                  )}
                >
                  {dayOfWeekName} {day}日
                </div>

                {/* スケジュール一覧 */}
                <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                  {daySchedules.slice(0, 2).map((schedule, scheduleIndex) => {
                    const scheduleDate = new Date(schedule.start_time);
                    const timeStr = `${scheduleDate
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${scheduleDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`;

                    const studentName = schedule.student?.name || "未設定";
                    
                    return (
                      <div
                        key={scheduleIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleClick?.(schedule);
                        }}
                        className={cn(
                          "schedule-item",
                          "bg-gray-100 rounded-md px-2 py-1 text-xs cursor-pointer",
                          "hover:bg-gray-200 transition-colors",
                        )}
                      >
                        <span className="font-medium text-foreground">{timeStr}</span>
                        {" "}
                        <span className="text-muted-foreground">{studentName}</span>
                      </div>
                    );
                  })}
                  {daySchedules.length > 2 && (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      その他{daySchedules.length - 2}件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
