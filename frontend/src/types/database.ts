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
}

// 授業スケジュール
export interface Schedule {
  id: number;
  school_id: number;
  title: string;
  mentor_id: number;
  user_id: number;
  start_time: string; // ISO 8601形式の文字列
  end_time: string; // ISO 8601形式の文字列
}

// 生徒ごとのカリキュラム進行
export interface Curriculum {
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
