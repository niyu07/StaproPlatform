import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import type {
  ScheduleWithRelations,
  Mentor,
  CurriculumMaster,
  Curriculum,
} from "@/types/database";

interface CustomScheduleDetailProps {
  date: Date;
  schedules: ScheduleWithRelations[];
  mentors: Mentor[];
  curriculumMasters: CurriculumMaster[];
  curriculums: Curriculum[];
  onClose: () => void;
}

interface GroupedSchedule {
  hour: number;
  schedules: ScheduleWithRelations[];
}

export const CustomScheduleDetail = ({
  date,
  schedules,
  mentors,
  curriculumMasters,
  curriculums,
  onClose,
}: CustomScheduleDetailProps) => {
  console.log("CustomScheduleDetail rendered with date:", date);
  console.log("Schedules count:", schedules.length);
  console.log("Mentors count:", mentors.length);
  console.log("CurriculumMasters count:", curriculumMasters.length);
  console.log("Curriculums count:", curriculums.length);

  // 指定日のスケジュールを時間ごとにグループ化
  const groupedSchedules = useMemo(() => {
    // ローカル時間で日付を比較（UTCではなく）
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    console.log("Filtering schedules for date:", {
      targetYear,
      targetMonth: targetMonth + 1,
      targetDay,
    });

    // スケジュールデータから実際に存在する年を取得
    const availableYears = new Set<number>();
    schedules.forEach(s => {
      const d = new Date(s.start_time);
      availableYears.add(d.getFullYear());
    });
    console.log("Available years in schedules:", Array.from(availableYears));

    const daySchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time);
      const scheduleYear = scheduleDate.getFullYear();
      const scheduleMonth = scheduleDate.getMonth();
      const scheduleDay = scheduleDate.getDate();
      
      const matches =
        scheduleYear === targetYear &&
        scheduleMonth === targetMonth &&
        scheduleDay === targetDay;
      
      if (matches) {
        console.log("Matched schedule:", {
          start_time: schedule.start_time,
          scheduleYear,
          scheduleMonth: scheduleMonth + 1,
          scheduleDay,
        });
      }
      
      return matches;
    });

    console.log("Filtered daySchedules count:", daySchedules.length);

    // 時間ごとにグループ化
    const grouped: GroupedSchedule[] = [];
    const hourMap = new Map<number, ScheduleWithRelations[]>();

    daySchedules.forEach((schedule) => {
      const scheduleDate = new Date(schedule.start_time);
      const hour = scheduleDate.getHours();
      if (!hourMap.has(hour)) {
        hourMap.set(hour, []);
      }
      hourMap.get(hour)!.push(schedule);
    });

    // 時間順にソート
    Array.from(hourMap.entries())
      .sort(([a], [b]) => a - b)
      .forEach(([hour, scheduleList]) => {
        grouped.push({ hour, schedules: scheduleList });
      });

    console.log("Grouped schedules:", grouped);
    return grouped;
  }, [date, schedules]);

  // メンター名を取得
  const getMentorName = (mentorId: number) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    return mentor?.name || "未設定";
  };

  // カリキュラム名を取得
  const getCurriculumName = (schedule: ScheduleWithRelations) => {
    // 生徒のカリキュラムを取得
    const curriculum = curriculums.find(
      (c) => c.user_id === schedule.user_id,
    );
    if (curriculum) {
      // カリキュラムマスターから名前を取得
      const curriculumMaster = curriculumMasters.find(
        (cm) => cm.id === curriculum.curriculum_id,
      );
      if (curriculumMaster) {
        return curriculumMaster.name;
      }
    }
    // フォールバック: タイトルから「の授業」を削除
    if (schedule.title) {
      return schedule.title.replace("の授業", "");
    }
    return "未設定";
  };

  const formatDate = (date: Date) => {
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekDays[date.getDay()];
    return `${month}月${day}日（${dayOfWeek}）`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{formatDate(date)}のスケジュール</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          {groupedSchedules.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              この日のスケジュールはありません
            </div>
          ) : (
            <div className="space-y-6">
              {groupedSchedules.map((group) => (
                <div key={group.hour} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold mb-3">
                    {group.hour}時
                  </h3>
                  <div className="space-y-4">
                    {/* メンター名のヘッダー */}
                    <div className="flex gap-4">
                      {group.schedules.map((schedule, index) => {
                        const mentorName = getMentorName(schedule.mentor_id);
                        return (
                          <div key={index} className="flex-1">
                            <div className="font-semibold text-center pb-2 border-b">
                              {mentorName}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 生徒名とカリキュラム */}
                    <div className="flex gap-4">
                      {group.schedules.map((schedule, index) => {
                        const studentName = schedule.student?.name || "未設定";
                        const curriculumName = getCurriculumName(schedule);

                        return (
                          <div key={index} className="flex-1 space-y-1">
                            <div className="font-medium text-sm">
                              {studentName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {curriculumName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

