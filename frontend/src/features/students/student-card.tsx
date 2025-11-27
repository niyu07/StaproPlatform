import type { Student, CurriculumMaster, Schedule } from "../../types/database";

import { Button } from "../../components/ui/button";
import { BookIcon, ClockIcon } from "../../components/ui/icons";
import { SectionTitle } from "../../components/ui/section-title";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  curriculum?: CurriculumMaster;
  nextSchedule?: Schedule;
  onDetailClick?: (student: Student) => void;
}

export const StudentCard = ({
  student,
  curriculum,
  nextSchedule,
  onDetailClick,
}: StudentCardProps) => {
  // 次回授業時間をフォーマット
  const formatScheduleTime = (schedule?: Schedule) => {
    if (!schedule) return "未定";
    const date = new Date(schedule.start_time);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-foreground m-0">
          {student.name}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle>カリキュラム</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {curriculum ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              <span className="text-base flex items-center text-primary">
                <BookIcon size={14} />
              </span>
              {curriculum.name}
            </span>
          ) : (
            <span className="text-muted-foreground">未設定</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle>授業時間</SectionTitle>
        <div className="flex items-center gap-3">
          <span className="text-xl flex items-center text-muted-foreground">
            <ClockIcon size={20} />
          </span>
          <span className="text-lg font-medium text-foreground">
            {formatScheduleTime(nextSchedule)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle>メモ</SectionTitle>
        <div className="w-full">
          <textarea
            className={cn(
              "w-full p-4 border border-border rounded-lg text-sm font-inherit resize-none",
              "bg-muted text-foreground",
              "focus:outline-none focus:border-ring focus:bg-background",
              "placeholder:text-muted-foreground",
            )}
            placeholder="メモ"
            rows={3}
            value={student.memo || ""}
            readOnly
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onDetailClick?.(student)}
      >
        詳細を見る
      </Button>
    </div>
  );
};
