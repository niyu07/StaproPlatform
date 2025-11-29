package main

import (
    "encoding/json"
    "io"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
)

type School struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func getSchools() ([]School, error) {
    url := os.Getenv("SUPABASE_URL") + "/rest/v1/school?select=*"
    apiKey := os.Getenv("SUPABASE_API_KEY")

    req, _ := http.NewRequest("GET", url, nil)
    req.Header.Set("apikey", apiKey)
    req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var schools []School
    json.Unmarshal(body, &schools)
    return schools, nil
}

func main() {
    r := gin.Default()

    r.GET("/api/school", func(c *gin.Context) {
        schools, err := getSchools()
        if err != nil {
            c.JSON(500, gin.H{"error": "取得失敗"})
            return
        }
        c.JSON(200, schools)
    })

    r.Run() // :8080 で起動
}