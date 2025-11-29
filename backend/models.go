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
    Comment      string `json:"comment"`
}