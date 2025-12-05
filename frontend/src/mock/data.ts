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
  CurriculumDisplay,
  StudentCurriculum,
} from "../types/database";
import { scratchLessonDetails } from "./scratchLessons";

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
    memo: "スクラッチが得意。次はHTMLに挑戦したい。",
  },
  {
    user_id: 102,
    name: "木村太郎",
    grade: "中学1年生",
    email: "kimura.taro@example.com",
    status: "active",
    memo: "Javascriptの基礎を学習中。",
  },
  {
    user_id: 103,
    name: "竹本花子",
    grade: "小学3年生",
    email: "takemoto.hanako@example.com",
    status: "active",
    memo: "マイクラで建築を作るのが好き。",
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
    school_id: 1, // 出汐校
    title: "スクラッチ基礎",
    mentor_id: 1, // 河村
    user_id: 101, // 田中一郎
    start_time: getDateString(1, 15, 0), // 明日15:00
    end_time: getDateString(1, 16, 30), // 明日16:30
  },
  {
    school_id: 1,
    title: "HTML入門",
    mentor_id: 2, // 宇田
    user_id: 101,
    start_time: getDateString(8, 15, 0), // 1週間後15:00
    end_time: getDateString(8, 16, 30),
  },
  // 木村太郎のスケジュール
  {
    school_id: 2, // 五日市校
    title: "Javascript基礎",
    mentor_id: 3, // 西岡
    user_id: 102, // 木村太郎
    start_time: getDateString(2, 17, 0), // 明後日17:00
    end_time: getDateString(2, 18, 30),
  },
  {
    school_id: 2,
    title: "Unity入門",
    mentor_id: 1, // 河村
    user_id: 102,
    start_time: getDateString(9, 17, 0), // 1週間後17:00
    end_time: getDateString(9, 18, 30),
  },
  // 竹本花子のスケジュール
  {
    school_id: 3, // 西風新都校
    title: "マイクラプログラミング",
    mentor_id: 2, // 宇田
    user_id: 103, // 竹本花子
    start_time: getDateString(3, 16, 0), // 3日後16:00
    end_time: getDateString(3, 17, 30),
  },
  {
    school_id: 3,
    title: "スクラッチ応用",
    mentor_id: 3, // 西岡
    user_id: 103,
    start_time: getDateString(10, 16, 0), // 1週間後16:00
    end_time: getDateString(10, 17, 30),
  },
  // 過去のスケジュール（履歴用）
  {
    school_id: 1,
    title: "スクラッチ基礎",
    mentor_id: 1,
    user_id: 101,
    start_time: getDateString(-7, 15, 0), // 1週間前
    end_time: getDateString(-7, 16, 30),
  },
  {
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

// カリキュラム管理画面用のモックデータ
export const mockStudentCurriculums: StudentCurriculum[] = [
  // 田中一郎
  { id: 1, user_id: 101, curriculum_id: 1, lessons: 5 }, // スクラッチ
  { id: 2, user_id: 101, curriculum_id: 2, lessons: 3 }, // マイクラ
  // 木村太郎
  { id: 3, user_id: 102, curriculum_id: 3, lessons: 4 }, // HTML
  { id: 4, user_id: 102, curriculum_id: 4, lessons: 2 }, // Javascript
  // 竹本花子
  { id: 5, user_id: 103, curriculum_id: 1, lessons: 6 }, // スクラッチ
  { id: 6, user_id: 103, curriculum_id: 3, lessons: 8 }, // HTML
  { id: 7, user_id: 103, curriculum_id: 5, lessons: 1 }, // Unity
];

// 画面表示用のカリキュラム情報
export const mockCurriculumDisplays: CurriculumDisplay[] = [
  // スクラッチカリキュラム（授業回詳細データ付き）
  {
    id: "cur-scratch-101",
    userId: 101,
    name: "スクラッチ基礎",
    code: "CUR-SCRATCH-101",
    category: "スクラッチ",
    level: "初級",
    targetGrade: "小5",
    totalLessons: 24,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "スクラッチの基礎から検定問題まで学習するカリキュラムです。",
    progress: 100,
    cardStatus: "current",
    lessonDetails: scratchLessonDetails,
  },
  {
    id: "cur-scratch-103",
    userId: 103,
    name: "スクラッチ基礎",
    code: "CUR-SCRATCH-103",
    category: "スクラッチ",
    level: "初級",
    targetGrade: "中2",
    totalLessons: 24,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "スクラッチの基礎から検定問題まで学習するカリキュラムです。",
    progress: 88,
    cardStatus: "current",
    lessonDetails: scratchLessonDetails.map((lesson, index) => {
      if (index === 21) {
        return { ...lesson, progress1: 88 };
      }
      if (index < 21) {
        return { ...lesson, progress1: 100, overallProgress: 100 };
      }
      return lesson;
    }),
  },
  {
    id: "cur-17",
    userId: 103,
    name: "カリキュラム17",
    code: "CUR-17",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "HTML/CSS基礎のカリキュラム17です。",
    progress: 32,
    cardStatus: "completed",
  },
  {
    id: "cur-18",
    userId: 103,
    name: "カリキュラム18",
    code: "CUR-18",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "HTML/CSS基礎のカリキュラム18です。",
    progress: 36,
    cardStatus: "completed",
  },
  {
    id: "cur-practice",
    userId: 103,
    name: "練習問題模写",
    code: "CUR-PRACTICE",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "練習問題の模写課題です。",
    progress: 40,
    cardStatus: "completed",
  },
  {
    id: "cur-git-1",
    userId: 103,
    name: "Gitカリキュラム1",
    code: "CUR-GIT-1",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "Git基礎のカリキュラム1です。",
    progress: 42,
    cardStatus: "current",
  },
  {
    id: "cur-git-2",
    userId: 103,
    name: "Gitカリキュラム2",
    code: "CUR-GIT-2",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "Git基礎のカリキュラム2です。",
    progress: 44,
    cardStatus: "upcoming",
  },
  {
    id: "cur-portfolio-top",
    userId: 103,
    name: "自己紹介サイト制作 (トップページ)",
    code: "CUR-PORTFOLIO-TOP",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "自己紹介サイトのトップページ制作です。",
    progress: 48,
    cardStatus: "upcoming",
  },
  {
    id: "cur-portfolio-works-1",
    userId: 103,
    name: "自己紹介サイト制作 (作品紹介)",
    code: "CUR-PORTFOLIO-WORKS-1",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "自己紹介サイトの作品紹介ページ制作です。",
    progress: 52,
    cardStatus: "upcoming",
  },
  {
    id: "cur-portfolio-works-2",
    userId: 103,
    name: "自己紹介サイト制作 (作品紹介)",
    code: "CUR-PORTFOLIO-WORKS-2",
    category: "HTML",
    level: "標準",
    targetGrade: "中2",
    totalLessons: 10,
    lessonDuration: 60,
    teacherName: "担当メンター",
    enrolledCount: 1,
    status: "active",
    updatedAt: "2025-11-20",
    description: "自己紹介サイトの作品紹介ページ制作（続き）です。",
    progress: 56,
    cardStatus: "upcoming",
  },
];
