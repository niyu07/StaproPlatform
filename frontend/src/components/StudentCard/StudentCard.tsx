import type { Student, CurriculumMaster, Schedule } from "../../types/database";
import "./StudentCard.css";

import { Button } from "../Button/Button";
import { BookIcon, ClockIcon } from "../Icons";

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
    <div className="student-card">
      <div className="student-card-header">
        <h3 className="student-name">{student.name}</h3>
      </div>

      <div className="student-card-section">
        <h4 className="section-title">カリキュラム</h4>
        <div className="curriculum-badges">
          {curriculum ? (
            <span className="curriculum-badge">
              <span className="badge-icon">
                <BookIcon size={14} />
              </span>
              {curriculum.name}
            </span>
          ) : (
            <span className="no-curriculum">未設定</span>
          )}
        </div>
      </div>

      <div className="student-card-section">
        <h4 className="section-title">授業時間</h4>
        <div className="schedule-time">
          <span className="time-icon">
            <ClockIcon size={20} />
          </span>
          <span className="time-text">{formatScheduleTime(nextSchedule)}</span>
        </div>
      </div>

      <div className="student-card-section">
        <h4 className="section-title">メモ</h4>
        <div className="memo-area">
          <textarea
            className="memo-input"
            placeholder="メモ"
            rows={3}
            value={student.memo || ""}
            readOnly
          />
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={() => onDetailClick?.(student)}
      >
        詳細を見る
      </Button>
    </div>
  );
};
