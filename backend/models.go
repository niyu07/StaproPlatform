package main

// School（校舎）
type School struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

// Mentor（メンター）
type Mentor struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

// CurriculumMaster（カリキュラムの種類）
type CurriculumMaster struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

// Student（生徒）
type Student struct {
    UserID int    `json:"user_id"`
    Name   string `json:"name"`
    Grade  string `json:"grade"`
    Email  string `json:"email"`
    Status string `json:"status"`
}

// Curriculum（生徒ごとのカリキュラム進行）
type Curriculum struct {
    ID           int    `json:"id"`
    UserID       int    `json:"user_id"`
    CurriculumID int    `json:"curriculum_id"`
    Lessons      int    `json:"lessons"`
}

// Schedule（授業スケジュール）
type Schedule struct {
    ID        int    `json:"id"`
    SchoolID  int    `json:"school_id"`
    Title     string `json:"title"`
    MentorID  int    `json:"mentor_id"`
    UserID    int    `json:"user_id"`
    StartTime string `json:"start_time"`
    EndTime   string `json:"end_time"`
}

// CurriculumLesson（レッスン）
type CurriculumLesson struct {
    ID           int    `json:"id"`
    CurriculumID int    `json:"curriculum_id"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    PageRange    string `json:"page_range"`
    DisplayOrder int    `json:"display_order"`
}

// StudentLessonProgress（生徒のレッスン進捗）
type StudentLessonProgress struct {
    ID                int    `json:"id"`
    UserID            int    `json:"user_id"`
    LessonID          int    `json:"lesson_id"`
    Status            string `json:"status"`
    NextPage          string `json:"next_page"`
    InstructorComment string `json:"instructor_comment"`
    CompletedAt       string `json:"completed_at"`
    CreatedAt         string `json:"created_at"`
    UpdatedAt         string `json:"updated_at"`
}
    Comment      string `json:"comment"`
}