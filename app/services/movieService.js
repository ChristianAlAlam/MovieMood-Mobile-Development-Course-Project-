import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Movie Service
 * 
 * Handles all movie operations including:
 * - Create movie
 * - Read movies (all, by id, favorites, completed)
 * - Update movie
 * - Delete movie
 * - Toggle favorite
 * - Toggle completed
 * 
 * Data Storage:
 * - AsyncStorage: All movies stored locally
 */

// Storage Key
const STORAGE_KEY = '@moviemood_movies';

/**
 * Movie Data Structure:
 * {
 *   id: string (unique identifier)
 *   title: string
 *   rating: number (0-5)
 *   comment: string (user's review/description)
 *   genre: string (Action, Drama, Comedy, etc.)
 *   duration: string (e.g., "120 min", "2h 30min")
 *   poster: string (URI or emoji)
 *   year: number
 *   isFavorite: boolean
 *   isCompleted: boolean
 *   watchProgress: number (0-1, for continue watching)
 *   createdAt: string (ISO date)
 *   updatedAt: string (ISO date)
 * }
 */

/**
 * Get all movies
 * 
 * @returns {array} - Array of movie objects
 */
export const getMovies = async () => {
  try {
    const moviesJson = await AsyncStorage.getItem(STORAGE_KEY);
    const movies = moviesJson ? JSON.parse(moviesJson) : [];
    
    // Sort by creation date (newest first)
    return movies.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Get movies error:', error);
    return [];
  }
};

/**
 * Get movie by ID
 * 
 * @param {string} movieId - Movie ID
 * @returns {object|null} - Movie object or null
 */
export const getMovieById = async (movieId) => {
  try {
    const movies = await getMovies();
    return movies.find(movie => movie.id === movieId) || null;
  } catch (error) {
    console.error('Get movie by ID error:', error);
    return null;
  }
};

/**
 * Get favorite movies
 * 
 * @returns {array} - Array of favorite movies
 */
export const getFavoriteMovies = async () => {
  try {
    const movies = await getMovies();
    return movies.filter(movie => movie.isFavorite);
  } catch (error) {
    console.error('Get favorite movies error:', error);
    return [];
  }
};

/**
 * Get completed movies
 * 
 * @returns {array} - Array of completed movies
 */
export const getCompletedMovies = async () => {
  try {
    const movies = await getMovies();
    return movies.filter(movie => movie.isCompleted);
  } catch (error) {
    console.error('Get completed movies error:', error);
    return [];
  }
};

/**
 * Get movies by genre
 * 
 * @param {string} genre - Genre name
 * @returns {array} - Array of movies in that genre
 */
export const getMoviesByGenre = async (genre) => {
  try {
    const movies = await getMovies();
    return movies.filter(movie => movie.genre === genre);
  } catch (error) {
    console.error('Get movies by genre error:', error);
    return [];
  }
};

/**
 * Add new movie
 * 
 * @param {object} movieData - Movie data
 * @returns {object} - { success: boolean, message: string, movie?: object }
 */
export const addMovie = async (movieData) => {
  try {
    // Validate required fields
    if (!movieData.title || !movieData.genre) {
      return {
        success: false,
        message: 'Title and genre are required',
      };
    }

    // Get existing movies
    const movies = await getMovies();

    // Create new movie object
    const newMovie = {
      id: Date.now().toString(),
      title: movieData.title,
      rating: movieData.rating || 0,
      comment: movieData.comment || '',
      genre: movieData.genre,
      duration: movieData.duration || '',
      poster: movieData.poster || '🎬',
      year: movieData.year || new Date().getFullYear(),
      isFavorite: movieData.isFavorite || false,
      isCompleted: movieData.isCompleted || false,
      watchProgress: movieData.watchProgress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to array
    movies.push(newMovie);

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

    return {
      success: true,
      message: 'Movie added successfully!',
      movie: newMovie,
    };
  } catch (error) {
    console.error('Add movie error:', error);
    return {
      success: false,
      message: 'Failed to add movie',
    };
  }
};

/**
 * Update movie
 * 
 * @param {string} movieId - Movie ID
 * @param {object} updates - Fields to update
 * @returns {object} - { success: boolean, message: string, movie?: object }
 */
export const updateMovie = async (movieId, updates) => {
  try {
    const movies = await getMovies();
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
      return {
        success: false,
        message: 'Movie not found',
      };
    }

    // Update movie
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

    return {
      success: true,
      message: 'Movie updated successfully!',
      movie: movies[movieIndex],
    };
  } catch (error) {
    console.error('Update movie error:', error);
    return {
      success: false,
      message: 'Failed to update movie',
    };
  }
};

/**
 * Delete movie
 * 
 * @param {string} movieId - Movie ID
 * @returns {object} - { success: boolean, message: string }
 */
export const deleteMovie = async (movieId) => {
  try {
    const movies = await getMovies();
    const filteredMovies = movies.filter(m => m.id !== movieId);

    if (movies.length === filteredMovies.length) {
      return {
        success: false,
        message: 'Movie not found',
      };
    }

    // Save updated list
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMovies));

    return {
      success: true,
      message: 'Movie deleted successfully!',
    };
  } catch (error) {
    console.error('Delete movie error:', error);
    return {
      success: false,
      message: 'Failed to delete movie',
    };
  }
};

/**
 * Toggle favorite status
 * 
 * @param {string} movieId - Movie ID
 * @returns {object} - { success: boolean, isFavorite: boolean }
 */
export const toggleFavorite = async (movieId) => {
  try {
    const movies = await getMovies();
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
      return { success: false, isFavorite: false };
    }

    // Toggle favorite
    movies[movieIndex].isFavorite = !movies[movieIndex].isFavorite;
    movies[movieIndex].updatedAt = new Date().toISOString();

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

    return {
      success: true,
      isFavorite: movies[movieIndex].isFavorite,
    };
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return { success: false, isFavorite: false };
  }
};

/**
 * Toggle completed status
 * 
 * @param {string} movieId - Movie ID
 * @returns {object} - { success: boolean, isCompleted: boolean }
 */
export const toggleCompleted = async (movieId) => {
  try {
    const movies = await getMovies();
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
      return { success: false, isCompleted: false };
    }

    // Toggle completed
    movies[movieIndex].isCompleted = !movies[movieIndex].isCompleted;
    
    // If completed, set progress to 100%
    if (movies[movieIndex].isCompleted) {
      movies[movieIndex].watchProgress = 1;
    }
    
    movies[movieIndex].updatedAt = new Date().toISOString();

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

    return {
      success: true,
      isCompleted: movies[movieIndex].isCompleted,
    };
  } catch (error) {
    console.error('Toggle completed error:', error);
    return { success: false, isCompleted: false };
  }
};

/**
 * Update watch progress
 * 
 * @param {string} movieId - Movie ID
 * @param {number} progress - Progress value (0-1)
 * @returns {object} - { success: boolean }
 */
export const updateWatchProgress = async (movieId, progress) => {
  try {
    const movies = await getMovies();
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
      return { success: false };
    }

    // Update progress
    movies[movieIndex].watchProgress = Math.max(0, Math.min(1, progress));
    
    // If progress reaches 100%, mark as completed
    if (movies[movieIndex].watchProgress >= 0.99) {
      movies[movieIndex].isCompleted = true;
      movies[movieIndex].watchProgress = 1;
    }
    
    movies[movieIndex].updatedAt = new Date().toISOString();

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

    return { success: true };
  } catch (error) {
    console.error('Update watch progress error:', error);
    return { success: false };
  }
};

/**
 * Search movies
 * 
 * @param {string} query - Search query
 * @returns {array} - Matching movies
 */
export const searchMovies = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return await getMovies();
    }

    const movies = await getMovies();
    const lowerQuery = query.toLowerCase();

    return movies.filter(movie =>
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.genre.toLowerCase().includes(lowerQuery) ||
      movie.comment.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Search movies error:', error);
    return [];
  }
};

/**
 * Get movie statistics
 * 
 * @returns {object} - Stats object
 */
export const getMovieStats = async () => {
  try {
    const movies = await getMovies();
    
    const totalMovies = movies.length;
    const favorites = movies.filter(m => m.isFavorite).length;
    const completed = movies.filter(m => m.isCompleted).length;
    
    // Calculate average rating
    const ratedMovies = movies.filter(m => m.rating > 0);
    const avgRating = ratedMovies.length > 0
      ? ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length
      : 0;
    
    // Movies added this week
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = movies.filter(m =>
      new Date(m.createdAt).getTime() > weekAgo
    ).length;

    return {
      totalMovies,
      favorites,
      completed,
      avgRating: Math.round(avgRating * 10) / 10,
      thisWeek,
    };
  } catch (error) {
    console.error('Get movie stats error:', error);
    return {
      totalMovies: 0,
      favorites: 0,
      completed: 0,
      avgRating: 0,
      thisWeek: 0,
    };
  }
};

/**
 * Clear all movies (for testing)
 * WARNING: This deletes ALL movie data!
 */
export const clearAllMovies = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('All movies cleared successfully');
  } catch (error) {
    console.error('Clear movies error:', error);
  }
};