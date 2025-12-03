import { useState, useEffect, useMemo } from "react";
import { CustomCalendar } from "@/components/ui/CustomCalendar";
import { CustomScheduleDetail } from "@/components/ui/CustomScheduleDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Schedule as ScheduleType,
  ScheduleWithRelations,
  Student,
  Mentor,
  CurriculumMaster,
  Curriculum,
  School,
} from "@/types/database";
import {
  fetchSchedules,
  fetchStudents,
  fetchMentors,
  fetchCurriculums,
  fetchCurriculumMasters,
  fetchSchools,
} from "@/lib/api";
import {
  mockSchedules,
  mockStudents,
  mockMentors,
  mockCurriculumMasters,
  mockSchools,
  getScheduleWithRelations,
} from "@/mock/data";

export const Schedule = () => {
  const [allSchedules, setAllSchedules] = useState<ScheduleWithRelations[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [curriculumMasters, setCurriculumMasters] = useState<CurriculumMaster[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 選択された校舎のスケジュールをフィルタリング
  const schedules = useMemo(() => {
    if (selectedSchoolId === null) {
      return []; // デフォルトでは何も表示しない
    }
    return allSchedules.filter((schedule) => schedule.school_id === selectedSchoolId);
  }, [allSchedules, selectedSchoolId]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // まずAPIから取得を試みる
        const [
          schedulesData,
          studentsData,
          mentorsData,
          curriculumsData,
          curriculumMastersData,
          schoolsData,
        ] = await Promise.all([
          fetchSchedules(),
          fetchStudents(),
          fetchMentors(),
          fetchCurriculums(),
          fetchCurriculumMasters(),
          fetchSchools(),
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

        setAllSchedules(schedulesWithRelations);
        setStudents(studentsData);
        setMentors(mentorsData);
        setCurriculums(curriculumsData);
        setCurriculumMasters(curriculumMastersData);
        setSchools(schoolsData);
        setUseMockData(false);
      } catch (err) {
        console.warn("API取得に失敗しました。モックデータを使用します。", err);
        // API取得に失敗した場合はモックデータを使用
        const mockSchedulesWithRelations = mockSchedules.map((schedule) =>
          getScheduleWithRelations(schedule),
        );
        setAllSchedules(mockSchedulesWithRelations);
        setStudents(mockStudents);
        setMentors(mockMentors);
        setCurriculumMasters(mockCurriculumMasters);
        setSchools(mockSchools);
        setCurriculums([]);
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

  const handleDateClick = (date: Date) => {
    console.log("handleDateClick called with date:", date);
    console.log("Setting selectedDate to:", date);
    setSelectedDate(date);
    console.log("selectedDate state updated");
  };

  const handleCloseDetail = () => {
    setSelectedDate(null);
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">スケジュール管理</h1>
          <p className="text-muted-foreground">
            授業予定の確認と日程調整リクエストの管理
          </p>
        </div>
        {schools.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">校舎:</label>
            <Select
              value={selectedSchoolId?.toString() || ""}
              onValueChange={(value) => setSelectedSchoolId(Number(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="校舎を選択" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id.toString()}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {useMockData && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          API接続に失敗したため、モックデータを表示しています。
        </div>
      )}

      {selectedSchoolId === null ? (
        <div className="flex items-center justify-center min-h-[400px] border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">校舎を選択してください</p>
        </div>
      ) : (
        <CustomCalendar
          schedules={schedules}
          onScheduleClick={handleScheduleClick}
          onDateClick={handleDateClick}
        />
      )}

      {selectedDate && (
        <CustomScheduleDetail
          date={selectedDate}
          schedules={schedules}
          mentors={mentors}
          curriculumMasters={curriculumMasters}
          curriculums={curriculums}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

