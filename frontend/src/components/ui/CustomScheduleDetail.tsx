import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";
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

interface MentorGroup {
  mentorId: number;
  mentorName: string;
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
  const sidebarWidth = useSidebarWidth();
  
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


  const formatDate = (date: Date) => {
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekDays[date.getDay()];
    return `${month}月${day}日（${dayOfWeek}）`;
  };

  // サイドバーがある場合、モーダルを中央に配置するためのスタイル
  const modalStyle = useMemo(() => {
    if (sidebarWidth > 0) {
      // サイドバーの幅を考慮して、モーダルを中央に配置
      return {
        left: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
      };
    }
    return {};
  }, [sidebarWidth]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" 
      style={modalStyle}
    >
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
            <div className="space-y-4">
              {groupedSchedules.map((group) => (
                <div 
                  key={group.hour} 
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {group.hour}時
                  </h3>
                  {(() => {
                    // 先生ごとにグループ化
                    const mentorMap = new Map<number, MentorGroup>();
                    
                    group.schedules.forEach((schedule) => {
                      const mentorId = schedule.mentor_id;
                      if (!mentorMap.has(mentorId)) {
                        mentorMap.set(mentorId, {
                          mentorId,
                          mentorName: getMentorName(mentorId),
                          schedules: [],
                        });
                      }
                      mentorMap.get(mentorId)!.schedules.push(schedule);
                    });

                    const mentorGroups = Array.from(mentorMap.values());

                    return (
                      <div className="flex gap-2">
                        {mentorGroups.map((mentorGroup, mentorIndex) => (
                          <div 
                            key={mentorIndex} 
                            className="flex-1 border border-gray-300 rounded-md bg-white p-3"
                          >
                            {/* 先生名 */}
                            <div className="text-center font-semibold pb-2 mb-2 border-b border-gray-200">
                              {mentorGroup.mentorName}
                            </div>
                            {/* 生徒名とカリキュラム */}
                            <div className="space-y-2">
                              {mentorGroup.schedules.map((schedule, scheduleIndex) => {
                                const studentName = schedule.student?.name || "未設定";
                                
                                return (
                                  <div key={scheduleIndex} className="space-y-1">
                                    <div className="font-medium text-sm">
                                      {studentName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      カリキュラム名（開発予定）
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

