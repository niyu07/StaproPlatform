/**
 * データベース型定義
 * Supabaseデータベースのテーブル構造を定義
 */

// 校舎マスター
export interface School {
  id: number;
  name: string;
}

// メンターマスター
export interface Mentor {
  id: number;
  name: string;
}

// カリキュラムマスター
export interface CurriculumMaster {
  id: number;
  name: string;
}

// 生徒
export interface Student {
  user_id: number;
  name: string;
  grade: string;
  email: string;
  status: "active" | "inactive";
  memo?: string;
}

// 授業スケジュール
export interface Schedule {
  school_id: number;
  title: string;
  mentor_id: number;
  user_id: number;
  start_time: string; // ISO 8601形式の文字列
  end_time: string; // ISO 8601形式の文字列
}

// 生徒ごとのカリキュラム進行（データベース用）
export interface Curriculum {
  user_id: number;
  curriculum_id: number;
  lessons: number;
}

// カリキュラム管理画面用の型定義
export type CurriculumStatus = "active" | "draft" | "archived";

// 授業回ごとの詳細データ
export interface LessonDetail {
  lessonNumber: number; // 第○回
  date?: string; // 実施日付
  teacher?: string; // 担当
  goal: string; // 授業の目標
  subItem1?: string; // 小項目1
  description1?: string; // 説明1
  problem1?: string; // 問題1
  progress1?: number; // 進捗1%
  progress2?: number; // 進捗2%（問題1の進捗など）
  subItem2?: string; // 小項目2
  description2?: string; // 説明2
  problem2?: string; // 問題2
  progress3?: number; // 進捗3%（小項目2の進捗など）
  progress4?: number; // 進捗4%（問題2の進捗など）
  subItem3?: string; // 小項目3
  description3?: string; // 説明3
  problem3?: string; // 問題3
  progress5?: number; // 進捗5%（小項目3の進捗など）
  progress6?: number; // 進捗6%
  progress7?: number; // 進捗7%
  progress8?: number; // 進捗8%
  homework?: string; // 宿題
  conversation?: string; // 会話した内容
  overallProgress?: number; // その回の全体進捗
}

// 画面用に整形したカリキュラム表示用データ
export interface CurriculumDisplay {
  id: string;
  // 生徒ID（画面上の紐付け用）
  userId?: number;
  name: string;
  code: string;
  category: string;
  level: string;
  targetGrade: string;
  totalLessons: number;
  lessonDuration: number;
  teacherName: string;
  enrolledCount: number;
  status: CurriculumStatus;
  updatedAt: string;
  description: string;
  // 進捗パーセンテージ（0-100）
  progress: number;
  // カードの状態（完了済み/進行中 / 現在 / 未開始）
  cardStatus: "completed" | "current" | "upcoming";
  // 授業回ごとの詳細データ（オプショナル）
  lessonDetails?: LessonDetail[];
}

// 生徒ごとのカリキュラムマスタ紐付け
export interface StudentCurriculum {
  id: number;
  user_id: number;
  curriculum_id: number;
  lessons: number;
}

// 管理者
export interface Admin {
  login_id: string;
  auth_uid: string; // UUID形式
  role: "admin";
  name: string;
  email: string;
}

// リレーションを含む拡張型
export interface ScheduleWithRelations extends Schedule {
  school?: School;
  mentor?: Mentor;
  student?: Student;
}

export interface CurriculumWithRelations extends Curriculum {
  student?: Student;
  curriculum_master?: CurriculumMaster;
}
