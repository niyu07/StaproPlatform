package main

import (
    "encoding/json"
    "io"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
)

// 汎用的なSupabaseデータ取得関数
func fetchFromSupabase(tableName string) ([]byte, error) {
    url := os.Getenv("SUPABASE_URL") + "/rest/v1/" + tableName + "?select=*"
    apiKey := os.Getenv("SUPABASE_API_KEY")

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }
    req.Header.Set("apikey", apiKey)
    req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}

// ソート付きでSupabaseデータ取得
func fetchFromSupabaseWithOrder(tableName string, orderBy string) ([]byte, error) {
    url := os.Getenv("SUPABASE_URL") + "/rest/v1/" + tableName + "?select=*&order=" + orderBy
    apiKey := os.Getenv("SUPABASE_API_KEY")

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }
    req.Header.Set("apikey", apiKey)
    req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}

func main() {
    r := gin.Default()

    // 校舎一覧
    r.GET("/api/school", func(c *gin.Context) {
        body, err := fetchFromSupabase("school")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []School
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // メンター一覧
    r.GET("/api/mentor", func(c *gin.Context) {
        body, err := fetchFromSupabase("mentor")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []Mentor
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // カリキュラムマスター一覧
    r.GET("/api/curriculummaster", func(c *gin.Context) {
        body, err := fetchFromSupabase("curriculummaster")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []CurriculumMaster
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // 生徒一覧
    r.GET("/api/student", func(c *gin.Context) {
        body, err := fetchFromSupabase("student")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []Student
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // カリキュラム進行一覧
    r.GET("/api/curriculum", func(c *gin.Context) {
        body, err := fetchFromSupabase("curriculum")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []Curriculum
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // スケジュール一覧
    r.GET("/api/schedule", func(c *gin.Context) {
        body, err := fetchFromSupabase("schedule")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []Schedule
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // カリキュラムレッスン一覧（curriculum_id, display_order順）
    r.GET("/api/curriculumlesson", func(c *gin.Context) {
        body, err := fetchFromSupabaseWithOrder("curriculumlesson", "curriculum_id,display_order")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []CurriculumLesson
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    // 生徒レッスン進捗一覧（user_id, lesson_id順）
    r.GET("/api/studentlessonprogress", func(c *gin.Context) {
        body, err := fetchFromSupabaseWithOrder("studentlessonprogress", "user_id,lesson_id")
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        var data []StudentLessonProgress
        json.Unmarshal(body, &data)
        c.JSON(200, data)
    })

    r.Run() // :8080 で起動
}