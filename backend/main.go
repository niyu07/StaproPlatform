// Package main provides the backend API server for the Stapro Platform.
package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginUser struct {
	Name     string
	Role     string
	Password string
}

var staticUsers = map[string]loginUser{
	"admin@example.com": {
		Name:     "管理者ユーザー",
		Role:     "admin",
		Password: "admin123",
	},
	"teacher@example.com": {
		Name:     "講師ユーザー",
		Role:     "teacher",
		Password: "teacher123",
	},
	"student@example.com": {
		Name:     "生徒ユーザー",
		Role:     "student",
		Password: "student123",
	},
}

const (
	loginErrorMessage = "メールアドレスまたはパスワードが正しくありません"
	maxEmailLength    = 254
	maxPasswordLength = 72
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
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("failed to close response body: %v", err)
		}
	}()

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
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("failed to close response body: %v", err)
		}
	}()

	return io.ReadAll(resp.Body)
}

func resolveAllowedOrigins() []string {
	origins := strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")
	var cleaned []string
	for _, origin := range origins {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			cleaned = append(cleaned, trimmed)
		}
	}
	if len(cleaned) == 0 {
		return []string{"http://localhost:5173"}
	}
	return cleaned
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     resolveAllowedOrigins(),
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/api/login", handleLogin)
	r.POST("/api/logout", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})

	// 校舎一覧
	r.GET("/api/school", func(c *gin.Context) {
		body, err := fetchFromSupabase("school")
		if err != nil {
			c.JSON(500, gin.H{"error": "取得失敗"})
			return
		}
		var data []School
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
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
		if err := json.Unmarshal(body, &data); err != nil {
			c.JSON(500, gin.H{"error": "JSONパース失敗"})
			return
		}
		c.JSON(200, data)
	})

	if err := r.Run(); err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}

func handleLogin(c *gin.Context) {
	var req loginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": loginErrorMessage})
		return
	}

	emailRaw := strings.TrimSpace(req.Email)
	if emailRaw == "" || len(emailRaw) > maxEmailLength {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": loginErrorMessage})
		return
	}
	if _, err := mail.ParseAddress(emailRaw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": loginErrorMessage})
		return
	}

	password := req.Password
	if strings.TrimSpace(password) == "" || len(password) > maxPasswordLength {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": loginErrorMessage})
		return
	}

	email := strings.ToLower(emailRaw)
	user, ok := staticUsers[email]
	if !ok || user.Password != password {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": loginErrorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"email":   email,
		"name":    user.Name,
		"role":    user.Role,
	})
}
