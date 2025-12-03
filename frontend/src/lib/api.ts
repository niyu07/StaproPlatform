/**
 * API呼び出し用のユーティリティ関数
 */

const resolveApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const envPort = import.meta.env.VITE_API_PORT;
    const shouldUseDevPort =
      !envPort && (hostname === "localhost" || hostname === "127.0.0.1");
    const port = envPort || (shouldUseDevPort ? "8080" : "");
    const portSegment = port ? `:${port}` : "";
    return `${protocol}//${hostname}${portSegment}`.replace(/:(80|443)$/, "");
  }

  return "http://localhost:8080";
};

const API_BASE_URL = resolveApiBaseUrl();

/**
 * スケジュール一覧を取得
 */
export const fetchSchedules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule`);
    if (!response.ok) {
      throw new Error("スケジュールの取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch schedules", error);
    throw error;
  }
};

/**
 * 生徒一覧を取得
 */
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/student`);
    if (!response.ok) {
      throw new Error("生徒の取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch students", error);
    throw error;
  }
};

/**
 * メンター一覧を取得
 */
export const fetchMentors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/mentor`);
    if (!response.ok) {
      throw new Error("メンターの取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch mentors", error);
    throw error;
  }
};

/**
 * カリキュラム一覧を取得
 */
export const fetchCurriculums = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/curriculum`);
    if (!response.ok) {
      throw new Error("カリキュラムの取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch curriculums", error);
    throw error;
  }
};

/**
 * カリキュラムマスター一覧を取得
 */
export const fetchCurriculumMasters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/curriculummaster`);
    if (!response.ok) {
      throw new Error("カリキュラムマスターの取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch curriculum masters", error);
    throw error;
  }
};

/**
 * 校舎一覧を取得
 */
export const fetchSchools = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/school`);
    if (!response.ok) {
      throw new Error("校舎の取得に失敗しました");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch schools", error);
    throw error;
  }
};
