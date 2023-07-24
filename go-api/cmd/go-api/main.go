package main

import (
	"go-api/internal/config"
	"go-api/internal/database"
	"go-api/internal/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	env "github.com/joho/godotenv"
)

func main() {
	// load env data
	err := env.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	// get config
	config := config.GetConfig()

	// init database connection
	_, err = database.InitConnection(config)
	if err != nil {
		log.Fatal(err)
	}

	// init app
	app := fiber.New()

	app.Use(logger.New())

	corsSettings := cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3030",
		AllowMethods:     "GET,POST,HEAD,OPTIONS,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,X-Requested-With",
		ExposeHeaders:    "Origin",
		AllowCredentials: true,
	})
	// cors
	app.Use(corsSettings)

	// setup routes
	routes.SetupRoutes(app)

	// start app
	if os.Getenv("PORT") != "" {
		app.Listen(os.Getenv("PORT"))
	} else {
		app.Listen("0.0.0.0:5050")
	}
}
