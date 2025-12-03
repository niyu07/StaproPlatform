// import文から未使用のCard, CardContent, Buttonを削除
import {
  mockMentors,
  mockSchedules,
  mockSchools,
  mockStudents,
  mockCurriculums,
  mockCurriculumMasters,
} from "@/mock/data";
import { useMemo, useState } from "react";

// メンターごとの担当生徒情報
interface MentorWithStudents {
  name: string;
  school: string;
  count: number;
  students: {
    name: string;
    subject: string;
  }[];
}

// 校舎ごとの次回スケジュール情報
interface SchoolSchedule {
  school: string;
  time: string;
  students: {
    name: string;
    subject: string;
  }[];
}

export default function Dashboard() {
  // メンター絞り込み用 校舎選択状態
  const [mentorSchoolId, setMentorSchoolId] = useState<number | "all">("all");
  // 現在時刻以降のスケジュールのみ取得
  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return mockSchedules
      .filter((schedule) => new Date(schedule.end_time) > now)
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
  }, []);

  // メンターごとの担当生徒を集計（校舎絞り込み対応）
  const mentorsWithStudents: MentorWithStudents[] = useMemo(() => {
    // 校舎で絞り込む場合、該当校舎のスケジュールのみ対象
    const filteredSchedules =
      mentorSchoolId === "all"
        ? upcomingSchedules
        : upcomingSchedules.filter((s) => s.school_id === mentorSchoolId);

    return mockMentors.map((mentor) => {
      // このメンターが担当する今後のスケジュール
      const mentorSchedules = filteredSchedules.filter(
        (s) => s.mentor_id === mentor.id
      );

      // 担当生徒のユニークなuser_idを取得
      const studentIds = [...new Set(mentorSchedules.map((s) => s.user_id))];

      // 生徒情報を取得
      const students = studentIds.map((userId) => {
        const student = mockStudents.find((s) => s.user_id === userId);
        // 生徒のカリキュラムを取得
        const studentCurriculums = mockCurriculums.filter(
          (c) => c.user_id === userId
        );
        const curriculumNames = studentCurriculums
          .map((c) => {
            const master = mockCurriculumMasters.find(
              (m) => m.id === c.curriculum_id
            );
            return master?.name;
          })
          .filter(Boolean)
          .join("/");

        return {
          name: student?.name || "不明",
          subject: curriculumNames || "未設定",
        };
      });

      // メンターの主な校舎を取得（最も多くスケジュールがある校舎）
      const schoolCounts: Record<number, number> = {};
      mentorSchedules.forEach((s) => {
        schoolCounts[s.school_id] = (schoolCounts[s.school_id] || 0) + 1;
      });
      const mainSchoolId = Object.entries(schoolCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0];
      const mainSchool = mockSchools.find((s) => s.id === Number(mainSchoolId));

      return {
        name: mentor.name,
        school: mainSchool?.name || "未設定",
        count: students.length,
        students,
      };
    });
  }, [upcomingSchedules, mentorSchoolId]);

  // 校舎ごとの次回スケジュールを取得（常に全校舎表示）
  const schoolSchedules: SchoolSchedule[] = useMemo(() => {
    return mockSchools.map((school) => {
      // この校舎の今後のスケジュール
      const schoolUpcoming = upcomingSchedules.filter(
        (s) => s.school_id === school.id
      );

      // 最も近い開始時刻を取得
      const nextSchedule = schoolUpcoming[0];
      const nextTime = nextSchedule ? new Date(nextSchedule.start_time) : null;

      // 同じ時間帯のスケジュールをグループ化
      const sameTimeSchedules = nextTime
        ? schoolUpcoming.filter((s) => {
            const startTime = new Date(s.start_time);
            return (
              startTime.getHours() === nextTime.getHours() &&
              startTime.getMinutes() === nextTime.getMinutes() &&
              startTime.toDateString() === nextTime.toDateString()
            );
          })
        : [];

      // 生徒情報を取得
      const students = sameTimeSchedules.map((schedule) => {
        const student = mockStudents.find(
          (s) => s.user_id === schedule.user_id
        );
        return {
          name: student?.name || "不明",
          subject: schedule.title,
        };
      });

      // 時刻表示をフォーマット
      const formatTime = (date: Date | null) => {
        if (!date) return "予定なし";
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${month}/${day} ${hours}:${minutes}`;
      };

      return {
        school: school.name,
        time: formatTime(nextTime),
        students,
      };
    });
  }, [upcomingSchedules]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      {/* メンター別担当生徒 校舎絞り込み付き */}
      <div>
        <div className="flex items-center mb-3 gap-4">
          <h2 className="text-lg font-semibold">メンター別担当生徒</h2>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={mentorSchoolId}
            onChange={(e) => {
              const val = e.target.value;
              setMentorSchoolId(val === "all" ? "all" : Number(val));
            }}
          >
            <option value="all">全校舎</option>
            {mockSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentorsWithStudents
            .filter((mentor) => mentor.count > 0)
            .map((mentor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow border p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {mentor.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base">{mentor.name}</div>
                    <div className="text-xs text-gray-500">
                      {mentor.school} | 担当 {mentor.count}名
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {mentor.students.map((s, i) => (
                    <div
                      key={i}
                      className="border rounded-xl px-3 py-2 bg-gray-50 flex flex-col"
                    >
                      <span className="font-medium text-sm text-gray-800">
                        {s.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {s.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 校舎別次回スケジュール（常に全校舎表示） */}
      <div>
        <h2 className="text-lg font-semibold mb-3">校舎別次回スケジュール</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schoolSchedules.map((sched, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow border p-5 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base">{sched.school}</span>
                <span className="bg-blue-600 text-white text-xs rounded-lg px-3 py-1 font-semibold">
                  次 {sched.time}から
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {sched.students.length > 0 ? (
                  sched.students.map((s, i) => (
                    <div
                      key={i}
                      className="border rounded-xl px-3 py-2 bg-blue-50 flex flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-blue-900">
                          {s.name}
                        </span>
                        <span className="text-xs text-blue-700 font-bold">
                          {sched.time.split(" ")[1]}
                        </span>
                      </div>
                      <span className="text-xs text-blue-700 mt-1">
                        {s.subject}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">予定なし</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
