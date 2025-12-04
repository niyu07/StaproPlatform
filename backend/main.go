// Package main provides the backend API server for the Stapro Platform.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/time/rate"
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginUser struct {
	Name         string
	Role         string
	PasswordHash string
}

var staticUsers = map[string]loginUser{
	"admin@example.com": {
		Name:         "管理者ユーザー",
		Role:         "admin",
		PasswordHash: "$2a$10$p5MmKREkYC.6ohwGEMfWKep/PcmauP3hYne/4QfUyw/HGcJe7UzO.",
	},
	"teacher@example.com": {
		Name:         "講師ユーザー",
		Role:         "teacher",
		PasswordHash: "$2a$10$egofAWeF49PluFLJTITz2eTfTVSEUClpJ2NdoD2aO8.SFzZJCI1yS",
	},
	"student@example.com": {
		Name:         "生徒ユーザー",
		Role:         "student",
		PasswordHash: "$2a$10$WhtQoePHVfNbo5RdgE.TauHlp8vXSHf2SOes2x4ngUiutEIo6mgLS",
	},
}

const (
	loginErrorMessage          = "メールアドレスまたはパスワードが正しくありません"
	loginRateLimitErrorMessage = "ログイン試行が多すぎます。しばらくしてから再度お試しください。"
	maxEmailLength             = 254
	maxPasswordLength          = 72
	loginRateLimitMaxRequests  = 5
	loginRateLimitWindow       = time.Minute
)

// 汎用的なSupabaseデータ取得関数
func fetchFromSupabase(tableName string) ([]byte, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	apiKey := os.Getenv("SUPABASE_API_KEY")

	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_URL environment variable is not set")
	}
	if apiKey == "" {
		return nil, fmt.Errorf("SUPABASE_API_KEY environment variable is not set")
	}

	url := supabaseURL + "/rest/v1/" + tableName + "?select=*"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("apikey", apiKey)
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to execute request: %v", err)
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("failed to close response body: %v", err)
		}
	}()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return nil, fmt.Errorf("supabase API returned status %d: %s", resp.StatusCode, string(body))
	}

	return io.ReadAll(resp.Body)
}

// ソート付きでSupabaseデータ取得
func fetchFromSupabaseWithOrder(tableName string, orderBy string) ([]byte, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	apiKey := os.Getenv("SUPABASE_API_KEY")

	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_URL environment variable is not set")
	}
	if apiKey == "" {
		return nil, fmt.Errorf("SUPABASE_API_KEY environment variable is not set")
	}

	url := supabaseURL + "/rest/v1/" + tableName + "?select=*&order=" + orderBy

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("apikey", apiKey)
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to execute request: %v", err)
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("failed to close response body: %v", err)
		}
	}()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return nil, fmt.Errorf("supabase API returned status %d: %s", resp.StatusCode, string(body))
	}

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

type ipRateLimiter struct {
	mu          sync.Mutex
	clients     map[string]*rate.Limiter
	maxRequests int
	window      time.Duration
}

func newIPRateLimiter(maxRequests int, window time.Duration) *ipRateLimiter {
	if maxRequests <= 0 {
		maxRequests = 1
	}
	if window <= 0 {
		window = time.Minute
	}
	return &ipRateLimiter{
		clients:     make(map[string]*rate.Limiter),
		maxRequests: maxRequests,
		window:      window,
	}
}

func (l *ipRateLimiter) getLimiter(ip string) *rate.Limiter {
	l.mu.Lock()
	defer l.mu.Unlock()

	limiter, exists := l.clients[ip]
	if !exists {
		perRequest := l.window / time.Duration(l.maxRequests)
		if perRequest <= 0 {
			perRequest = time.Minute / time.Duration(l.maxRequests)
		}
		limiter = rate.NewLimiter(rate.Every(perRequest), l.maxRequests)
		l.clients[ip] = limiter
	}
	return limiter
}

func (l *ipRateLimiter) allow(ip string) bool {
	return l.getLimiter(ip).Allow()
}

func rateLimitMiddleware(l *ipRateLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !l.allow(c.ClientIP()) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": loginRateLimitErrorMessage,
			})
			return
		}
		c.Next()
	}
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     resolveAllowedOrigins(),
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	loginLimiter := newIPRateLimiter(loginRateLimitMaxRequests, loginRateLimitWindow)
	r.POST("/api/login", rateLimitMiddleware(loginLimiter), handleLogin)
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
			log.Printf("Failed to fetch student: %v", err)
			c.JSON(500, gin.H{"error": "取得失敗", "details": err.Error()})
			return
		}
		var data []Student
		if err := json.Unmarshal(body, &data); err != nil {
			log.Printf("Failed to parse student JSON: %v, body: %s", err, string(body))
			c.JSON(500, gin.H{"error": "JSONパース失敗", "details": err.Error()})
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
			log.Printf("Failed to fetch schedule: %v", err)
			c.JSON(500, gin.H{"error": "取得失敗", "details": err.Error()})
			return
		}
		var data []Schedule
		if err := json.Unmarshal(body, &data); err != nil {
			log.Printf("Failed to parse schedule JSON: %v, body: %s", err, string(body))
			c.JSON(500, gin.H{"error": "JSONパース失敗", "details": err.Error()})
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

	if err := r.Run("0.0.0.0:8080"); err != nil {
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
	if !ok || bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) != nil {
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
