package database

import (
	"fmt"
	"go-api/internal/config"
	"go-api/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitConnection(config *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s password=%s user=%s dbname=%s sslmode=%s", config.Host, config.Port, config.Password, config.User, config.DBName, config.SSLMode)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	DB = db

	db.AutoMigrate(&models.User{})
	db.Create(&models.User{
		Name:     "AdminLox",
		Email:    "admin_lox@sos.com",
		Password: "a8684269c4f032b6fbaac5e072554cbf",
		IsAdmin:  true,
	})
	return db, nil
}
