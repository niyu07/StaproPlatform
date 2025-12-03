import { useState, useEffect } from "react";
import { CustomCalendar } from "@/components/ui/CustomCalendar";
import type {
  Schedule as ScheduleType,
  ScheduleWithRelations,
  Student,
} from "@/types/database";
import { fetchSchedules, fetchStudents } from "@/lib/api";
import {
  mockSchedules,
  mockStudents,
  getScheduleWithRelations,
} from "@/mock/data";

export const Schedule = () => {
  const [schedules, setSchedules] = useState<ScheduleWithRelations[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // まずAPIから取得を試みる
        const [schedulesData, studentsData] = await Promise.all([
          fetchSchedules(),
          fetchStudents(),
        ]);

        // スケジュールにリレーション情報を追加
        const schedulesWithRelations: ScheduleWithRelations[] =
          schedulesData.map((schedule: ScheduleType) => {
            const scheduleWithRelations = getScheduleWithRelations(schedule);
            // 実際のAPIから取得した生徒データを使用
            const student = studentsData.find(
              (s: Student) => s.user_id === schedule.user_id,
            );
            return {
              ...scheduleWithRelations,
              student: student || scheduleWithRelations.student,
            };
          });

        setSchedules(schedulesWithRelations);
        setStudents(studentsData);
        setUseMockData(false);
      } catch (err) {
        console.warn("API取得に失敗しました。モックデータを使用します。", err);
        // API取得に失敗した場合はモックデータを使用
        const mockSchedulesWithRelations = mockSchedules.map((schedule) =>
          getScheduleWithRelations(schedule),
        );
        setSchedules(mockSchedulesWithRelations);
        setStudents(mockStudents);
        setUseMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleScheduleClick = (schedule: ScheduleWithRelations) => {
    console.log("Schedule clicked:", schedule);
    // 将来的にモーダルや詳細表示を実装する場合はここで処理
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">スケジュール管理</h1>
        <p className="text-muted-foreground">
          授業予定の確認と日程調整リクエストの管理
        </p>
      </div>

      {useMockData && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          API接続に失敗したため、モックデータを表示しています。
        </div>
      )}

      <CustomCalendar
        schedules={schedules}
        onScheduleClick={handleScheduleClick}
      />
    </div>
  );
};

