import prisma from "../config/database.js";

export const moviesService = {
  // Get all movies for a user
  async getUserMovies(userId, filters = {}) {
    const {
      isFavorite,
      isCompleted,
      genre,
      search,
      ratingRange, // 4-5, 3-4, 2-3, 1-2, below 1
      year,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where = { ownerId: userId };

    // Boolean filters
    if (isFavorite !== undefined) where.isFavorite = isFavorite === "true";
    if (isCompleted !== undefined) where.isCompleted = isCompleted === "true";

    // Genre filter
    if (genre) where.genre = genre;

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    // Rating range filters
    if (ratingRange) {
      where.rating = {};
      switch (ratingRange) {
        case "4-5":
          where.rating.gte = 4;
          where.rating.lte = 5;
          break;
        case "3-4":
          where.rating.gte = 3;
          where.rating.lte = 4;
          break;
        case "2-3":
          where.rating.gte = 2;
          where.rating.lte = 3;
          break;
        case "1-2":
          where.rating.gte = 1;
          where.rating.lte = 2;
          break;
        case "below-1":
          where.rating.lt = 1;
          break;
        default:
          delete where.rating; // Invalid range, ignore filter
      }
    }

    // Year filter (specific year)
    if (year) {
      where.year = parseInt(year);
    }

    // Determining sorting
    const orderBy = {};
    const validSortByFields = [
      "createdAt",
      "updatedAt",
      "title",
      "year",
      "rating",
      "watchProgress",
    ];
    const sortField = validSortByFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? "asc" : "desc";
    orderBy[sortField] = sortDirection;

    const movies = await prisma.movie.findMany({
      where,
      orderBy,
    });

    return movies;
  },

  // Get movie by ID
  async getMovieById(movieId, userId) {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    // Check if user owns this movie
    if (movie.ownerId !== userId) {
      throw new Error("Unauthorized access");
    }

    return movie;
  },

  // Create movie
  async createMovie(userId, movieData) {
    const {
      title,
      genre,
      year,
      duration,
      rating,
      comment,
      isFavorite,
      isCompleted,
      watchProgress,
      poster,
    } = movieData;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        genre,
        year: parseInt(year),
        duration: duration ? parseInt(duration) : null,
        rating: rating ? parseFloat(rating) : 0,
        comment,
        isFavorite: isFavorite || false,
        isCompleted: isCompleted || false,
        watchProgress: watchProgress ? parseFloat(watchProgress) : 0,
        poster,
        ownerId: userId,
      },
    });

    return movie;
  },

  // Update movie
  async updateMovie(movieId, userId, updateData) {
    // Check if movie exists and user owns it
    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      throw new Error("Movie not found");
    }

    if (existingMovie.ownerId !== userId) {
      throw new Error("Unauthorized access");
    }

    // Prepare update data
    const data = {};
    const {
      title,
      genre,
      year,
      duration,
      rating,
      comment,
      isFavorite,
      isCompleted,
      watchProgress,
      poster,
    } = updateData;
    if (title) data.title = title;
    if (genre) data.genre = genre;
    if (year) data.year = parseInt(year);
    if (duration !== undefined)
      data.duration = duration ? parseInt(duration) : null;
    if (rating !== undefined) data.rating = rating ? parseFloat(rating) : 0;
    if (comment !== undefined) data.comment = comment;
    if (isFavorite !== undefined) data.isFavorite = isFavorite;
    if (isCompleted !== undefined) data.isCompleted = isCompleted;
    if (watchProgress !== undefined)
      data.watchProgress = watchProgress ? parseFloat(watchProgress) : 0;
    if (poster !== undefined) data.poster = poster;

    const movie = await prisma.movie.update({
      where: { id: movieId },
      data,
    });

    return movie;
  },

  // Delete movie
  async deleteMovie(movieId, userId) {
    // Checks if movie exists and the user owns it
    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      throw new Error("Movie not found");
    }

    if (existingMovie.ownerId !== userId) {
      throw new Error("Unauthorized access");
    }

    await prisma.movie.delete({
      where: { id: movieId },
    });

    return { message: "Movie deleted successfully" };
  },

  // Get available years for filtering (useful for your app to show year options)
  async getAvailableYears(userId) {
    const years = await prisma.movie.findMany({
      where: { ownerId: userId },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    return years.map((movie) => movie.year);
  },

  // Get movie statistics for user
  async getUserStats(userId) {
    const totalMovies = await prisma.movie.count({
      where: { ownerId: userId },
    });

    const completedMovies = await prisma.movie.count({
      where: { ownerId: userId, isCompleted: true },
    });

    const favoriteMovies = await prisma.movie.count({
      where: { ownerId: userId, isFavorite: true },
    });

    const averageRating = await prisma.movie.aggregate({
      where: { ownerId: userId, rating: { gt: 0 } },
      _avg: { rating: true },
    });

    const genreDistribution = await prisma.movie.groupBy({
      by: ["genre"],
      where: { ownerId: userId },
      _count: { genre: true },
    });

    const yearDistribution = await prisma.movie.groupBy({
      by: ["year"],
      where: { ownerId: userId },
      _count: { year: true },
      orderBy: { year: "desc" },
    });

    // Rating distribution by ranges
    const excellentMovies = await prisma.movie.count({
      where: { ownerId: userId, rating: { gte: 4, lte: 5 } },
    });

    const greatMovies = await prisma.movie.count({
      where: { ownerId: userId, rating: { gte: 3, lt: 4 } },
    });

    const goodMovies = await prisma.movie.count({
      where: { ownerId: userId, rating: { gte: 2, lt: 3 } },
    });

    const averageMovies = await prisma.movie.count({
      where: { ownerId: userId, rating: { gte: 1, lt: 2 } },
    });

    const belowAverageMovies = await prisma.movie.count({
      where: { ownerId: userId, rating: { lt: 1 } },
    });

    return {
      totalMovies,
      completedMovies,
      favoriteMovies,
      averageRating: averageRating._avg.rating || 0,
      genreDistribution,
      yearDistribution,
      ratingDistribution: {
        excellent: excellentMovies, // 4-5
        great: greatMovies, // 3-4
        good: goodMovies, // 2-3
        average: averageMovies, // 1-2
        belowAverage: belowAverageMovies, // <1
      },
    };
  },
};
