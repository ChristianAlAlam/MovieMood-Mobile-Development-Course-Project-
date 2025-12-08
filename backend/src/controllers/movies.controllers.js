import { moviesService } from "../services/movies.services.js";

export const moviesController = {
  // Get all movies for user
  async getUserMovies(req, res) {
    try {
      const movies = await moviesService.getUserMovies(req.userId, req.query);
      res.json({
        success: true,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get movie by ID
  async getMovieById(req, res) {
    try {
      const movie = await moviesService.getMovieById(req.params.id, req.userId);
      res.json({
        success: true,
        data: movie,
      });
    } catch (error) {
      const status = error.message === "Movie not found" ? 404 : 403;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Create movie
  async createMovie(req, res) {
    try {
      const movie = await moviesService.createMovie(req.userId, req.body);
      res.status(201).json({
        success: true,
        message: "Movie created successfully",
        data: movie,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update movie
  async updateMovie(req, res) {
    try {
      const movie = await moviesService.updateMovie(
        req.params.id,
        req.userId,
        req.body
      );
      res.json({
        success: true,
        message: "Movie updated successfully",
        data: movie,
      });
    } catch (error) {
      const status = error.message === "Movie not found" ? 404 : 403;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete movie
  async deleteMovie(req, res) {
    try {
      const result = await moviesService.deleteMovie(req.params.id, req.userId);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const status = error.message === "Movie not found" ? 404 : 403;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get available years
  async getAvailableYears(req, res) {
    try {
      const years = await moviesService.getAvailableYears(req.userId);
      res.json({
        success: true,
        data: years,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const stats = await moviesService.getUserStats(req.userId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
