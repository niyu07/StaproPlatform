/**
 * モックデータ
 * 仕様書に基づいた初期データ
 */

import type {
  School,
  Mentor,
  CurriculumMaster,
  Student,
  Schedule,
  Curriculum,
  Admin,
} from "../types/database";

// 校舎マスター
export const mockSchools: School[] = [
  { id: 1, name: "出汐校" },
  { id: 2, name: "五日市校" },
  { id: 3, name: "西風新都校" },
];

// メンターマスター
export const mockMentors: Mentor[] = [
  { id: 1, name: "河村" },
  { id: 2, name: "宇田" },
  { id: 3, name: "西岡" },
];

// カリキュラムマスター
export const mockCurriculumMasters: CurriculumMaster[] = [
  { id: 1, name: "スクラッチ" },
  { id: 2, name: "マイクラ" },
  { id: 3, name: "HTML" },
  { id: 4, name: "Javascript" },
  { id: 5, name: "Unity" },
];

// 生徒
export const mockStudents: Student[] = [
  {
    user_id: 101,
    name: "田中一郎",
    grade: "小学5年生",
    email: "tanaka.ichiro@example.com",
    status: "active",
  },
  {
    user_id: 102,
    name: "木村太郎",
    grade: "中学1年生",
    email: "kimura.taro@example.com",
    status: "active",
  },
  {
    user_id: 103,
    name: "竹本花子",
    grade: "小学3年生",
    email: "takemoto.hanako@example.com",
    status: "active",
  },
];

// 授業スケジュール
// 現在日時を基準に、過去と未来のスケジュールを生成
const now = new Date();
const getDateString = (days: number, hours: number, minutes: number = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockSchedules: Schedule[] = [
  // 田中一郎のスケジュール
  {
    id: 1,
    school_id: 1, // 出汐校
    title: "スクラッチ基礎",
    mentor_id: 1, // 河村
    user_id: 101, // 田中一郎
    start_time: getDateString(1, 15, 0), // 明日15:00
    end_time: getDateString(1, 16, 30), // 明日16:30
  },
  {
    id: 2,
    school_id: 1,
    title: "HTML入門",
    mentor_id: 2, // 宇田
    user_id: 101,
    start_time: getDateString(8, 15, 0), // 1週間後15:00
    end_time: getDateString(8, 16, 30),
  },
  // 木村太郎のスケジュール
  {
    id: 3,
    school_id: 2, // 五日市校
    title: "Javascript基礎",
    mentor_id: 3, // 西岡
    user_id: 102, // 木村太郎
    start_time: getDateString(2, 17, 0), // 明後日17:00
    end_time: getDateString(2, 18, 30),
  },
  {
    id: 4,
    school_id: 2,
    title: "Unity入門",
    mentor_id: 1, // 河村
    user_id: 102,
    start_time: getDateString(9, 17, 0), // 1週間後17:00
    end_time: getDateString(9, 18, 30),
  },
  // 竹本花子のスケジュール
  {
    id: 5,
    school_id: 3, // 西風新都校
    title: "マイクラプログラミング",
    mentor_id: 2, // 宇田
    user_id: 103, // 竹本花子
    start_time: getDateString(3, 16, 0), // 3日後16:00
    end_time: getDateString(3, 17, 30),
  },
  {
    id: 6,
    school_id: 3,
    title: "スクラッチ応用",
    mentor_id: 3, // 西岡
    user_id: 103,
    start_time: getDateString(10, 16, 0), // 1週間後16:00
    end_time: getDateString(10, 17, 30),
  },
  // 過去のスケジュール（履歴用）
  {
    id: 7,
    school_id: 1,
    title: "スクラッチ基礎",
    mentor_id: 1,
    user_id: 101,
    start_time: getDateString(-7, 15, 0), // 1週間前
    end_time: getDateString(-7, 16, 30),
  },
  {
    id: 8,
    school_id: 2,
    title: "Javascript基礎",
    mentor_id: 3,
    user_id: 102,
    start_time: getDateString(-5, 17, 0), // 5日前
    end_time: getDateString(-5, 18, 30),
  },
];

// 生徒ごとのカリキュラム進行
export const mockCurriculums: Curriculum[] = [
  // 田中一郎のカリキュラム
  {
    user_id: 101,
    curriculum_id: 1, // スクラッチ
    lessons: 5,
  },
  {
    user_id: 101,
    curriculum_id: 3, // HTML
    lessons: 2,
  },
  // 木村太郎のカリキュラム
  {
    user_id: 102,
    curriculum_id: 4, // Javascript
    lessons: 8,
  },
  {
    user_id: 102,
    curriculum_id: 5, // Unity
    lessons: 3,
  },
  // 竹本花子のカリキュラム
  {
    user_id: 103,
    curriculum_id: 2, // マイクラ
    lessons: 4,
  },
  {
    user_id: 103,
    curriculum_id: 1, // スクラッチ
    lessons: 6,
  },
];

// 管理者
export const mockAdmins: Admin[] = [
  {
    login_id: "admin001",
    auth_uid: "00000000-0000-0000-0000-000000000001",
    role: "admin",
    name: "管理者1",
    email: "admin1@example.com",
  },
  {
    login_id: "admin002",
    auth_uid: "00000000-0000-0000-0000-000000000002",
    role: "admin",
    name: "管理者2",
    email: "admin2@example.com",
  },
];

// 全モックデータをまとめたオブジェクト
export const mockData = {
  schools: mockSchools,
  mentors: mockMentors,
  curriculumMasters: mockCurriculumMasters,
  students: mockStudents,
  schedules: mockSchedules,
  curriculums: mockCurriculums,
  admins: mockAdmins,
};

// ヘルパー関数: IDからデータを取得
export const getSchoolById = (id: number): School | undefined =>
  mockSchools.find((s) => s.id === id);

export const getMentorById = (id: number): Mentor | undefined =>
  mockMentors.find((m) => m.id === id);

export const getStudentById = (user_id: number): Student | undefined =>
  mockStudents.find((s) => s.user_id === user_id);

export const getCurriculumMasterById = (
  id: number,
): CurriculumMaster | undefined =>
  mockCurriculumMasters.find((c) => c.id === id);

// リレーションを含むデータを取得
export const getScheduleWithRelations = (schedule: Schedule) => ({
  ...schedule,
  school: getSchoolById(schedule.school_id),
  mentor: getMentorById(schedule.mentor_id),
  student: getStudentById(schedule.user_id),
});

export const getCurriculumWithRelations = (curriculum: Curriculum) => ({
  ...curriculum,
  student: getStudentById(curriculum.user_id),
  curriculum_master: getCurriculumMasterById(curriculum.curriculum_id),
});
