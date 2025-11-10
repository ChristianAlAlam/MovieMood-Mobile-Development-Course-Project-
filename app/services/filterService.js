/**
 * Utility functions for filtering and sorting movies
 */

/**
 * Apply filters to a list of movies
 * @param {Array} movies - Array of movie objects
 * @param {Object} filters - Filter configuration
 * @returns {Array} Filtered and sorted movies
 */
export const applyFilters = (movies, filters) => {
  if (!movies || movies.length === 0) return [];

  let filtered = [...movies];

  // Apply genre filter
  if (filters.genres && filters.genres.length > 0) {
    filtered = filtered.filter((movie) =>
      filters.genres.includes(movie.genre)
    );
  }

  // Apply year filter
  if (filters.years && filters.years.length > 0) {
    filtered = filtered.filter((movie) =>
      filters.years.includes(movie.year.toString())
    );
  }

  // Apply rating filter
  if (filters.ratingRanges && filters.ratingRanges.length > 0) {
    filtered = filtered.filter((movie) => {
      return filters.ratingRanges.some((range) => {
        const rating = parseFloat(movie.rating);
        return rating >= range.min && rating < range.max;
      });
    });
  }

  // Apply sorting
  filtered = applySorting(filtered, filters.sort || 'newest');

  return filtered;
};

/**
 * Sort movies based on sort option
 * @param {Array} movies - Array of movie objects
 * @param {String} sortOption - Sort option ID
 * @returns {Array} Sorted movies
 */
export const applySorting = (movies, sortOption) => {
  const sorted = [...movies];

  switch (sortOption) {
    case 'newest':
      return sorted.sort((a, b) => b.year - a.year);

    case 'oldest':
      return sorted.sort((a, b) => a.year - b.year);

    case 'highest_rated':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'lowest_rated':
      return sorted.sort((a, b) => a.rating - b.rating);

    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    default:
      return sorted;
  }
};

/**
 * Combine search and filters
 * @param {Array} movies - Array of movie objects
 * @param {String} searchQuery - Search query string
 * @param {Object} filters - Filter configuration
 * @returns {Array} Filtered and sorted movies
 */
export const applySearchAndFilters = (movies, searchQuery, filters) => {
  if (!movies || movies.length === 0) return [];

  let result = [...movies];

  // Apply search first
  if (searchQuery && searchQuery.trim() !== '') {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.genre.toLowerCase().includes(lowerQuery) ||
        (movie.comment && movie.comment.toLowerCase().includes(lowerQuery)) ||
        movie.year.toString().includes(lowerQuery)
    );
  }

  // Then apply filters
  result = applyFilters(result, filters);

  return result;
};

export default {};