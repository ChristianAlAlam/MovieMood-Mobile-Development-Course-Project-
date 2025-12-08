import express from "express";
import { moviesController } from "../controllers/movies.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All movie routes require authentication
router.use(authMiddleware);

// Movie CRUD
router.get("/", moviesController.getUserMovies);
router.get("/stats", moviesController.getUserStats);
router.get("/years", moviesController.getAvailableYears);
router.get("/:id", moviesController.getMovieById);
router.post("/", moviesController.createMovie);
router.put("/:id", moviesController.updateMovie);
router.delete("/:id", moviesController.deleteMovie);

export default router;
