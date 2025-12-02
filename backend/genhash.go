package main

import (
    "fmt"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    passwords := []string{"admin123", "teacher123", "student123"}
    for _, p := range passwords {
        hash, err := bcrypt.GenerateFromPassword([]byte(p), bcrypt.DefaultCost)
        if err != nil {
            panic(err)
        }
        fmt.Printf("%s:%s\n", p, hash)
    }
}
