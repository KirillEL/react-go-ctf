package routes

import (
	"go-api/internal/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)
	api.Get("/user", controllers.GetUser)
	api.Post("/logout", controllers.PostLogout)
	api.Get("/search", controllers.Search, controllers.Logout)
	api.Get("/logout", controllers.Logout)

}
