import api from "./api";

/**
 * Movie Service - API version
 *
 * Connects to Express backend for movie operations
 */

/**
 * Get all movies for current user
 */

export const getMovies = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/movies?${params}` : "/movies";

    const response = await api.get(url);

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get movies error:", error);
    return [];
  }
};

/**
 * Get a single movie by ID
 */

export const getMovieById = async (movieId) => {
  try {
    const response = await api.get(`/movies/${movieId}`);

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get movie by id error:", error);
    return [];
  }
};

/**
 * Create a new movie
 */

export const createMovie = async (movieData) => {
  try {
    const response = await api.post("/movies", movieData);

    if (response.data.success) {
      return {
        success: true,
        message: "Movie added successfully",
        movie: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to create a movie",
    };
  } catch (error) {
    console.error("Create movie error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create a movie",
    };
  }
};

/**
 * Updated a movie
 */

export const updateMovie = async (movieId, updateData) => {
  try {
    const response = await api.put(`/movies/${movieId}`, updateData);

    if (response.data.success) {
      return {
        success: true,
        message: "Movie updated successfully",
        movie: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to update movie",
    };
  } catch (error) {
    console.error("Update movie error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update movie",
    };
  }
};

/**
 * Delete a movie
 */

export const deleteMovie = async (movieId) => {
  try {
    const response = await api.delete(`/movies/${movieId}`);

    if (response.data.success) {
      return {
        success: true,
        message: "Movie deleted successfully",
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to delete movie",
    };
  } catch (error) {
    console.error("Delete movie error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete movie",
    };
  }
};

/**
 * Get favorite movies
 */
export const getFavoriteMovies = async () => {
  try {
    const response = await api.get("/movies?isFavorite=true");

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get favorites error:", error);
    return [];
  }
};

/**
 * Get completed movies
 */
export const getCompletedMovies = async () => {
  try {
    const response = await api.get("/movies?isCompleted=true");

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get completed movies error:", error);
    return [];
  }
};

/**
 * Get in-progress movies (not completed)
 */
export const getInProgressMovies = async () => {
  try {
    const response = await api.get("/movies?isCompleted=false");

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get in-progress movies error:", error);
    return [];
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  try {
    const response = await api.get("/movies/stats");

    if (response.data.success) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Get stats error:", error);
    return null;
  }
};

/**
 * Get available years for filtering
 */
export const getAvailableYears = async () => {
  try {
    const response = await api.get("/movies/years");

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get years error:", error);
    return [];
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (movieId, currentStatus) => {
  try {
    const newStatus = !currentStatus;
    return await updateMovie(movieId, {
      isFavorite: newStatus,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return { success: false, message: "Failed to update favorite status" };
  }
};

/**
 * Toggle completed status
 */
export const toggleCompleted = async (movieId, currentStatus) => {
  try {
    const newStatus = !currentStatus;
    return await updateMovie(movieId, {
      isCompleted: newStatus,
      watchProgress: newStatus ? 1 : 0,
    });
  } catch (error) {
    console.error("Toggle completed error:", error);
    return {
      success: false,
      message: "Failed to update completion status",
    };
  }
};

/**
 * Update watch progress
 */
export const updateWatchProgress = async (
  movieId,
  progress,
  isCompleted = false
) => {
  try {
    return await updateMovie(movieId, {
      watchProgress: progress,
      isCompleted: isCompleted || progress >= 1,
    });
  } catch (error) {
    console.error("Update progress error:", error);
    return { success: false, message: "Failed to update progress" };
  }
};

export default {};
