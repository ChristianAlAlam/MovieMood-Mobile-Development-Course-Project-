import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * MovieCard Component
 * 
 * Displays a movie with poster, title, rating, and genre
 * 
 * @param {object} movie - Movie data object
 * @param {string} movie.id - Movie ID
 * @param {string} movie.title - Movie title
 * @param {number} movie.rating - Movie rating (0-5)
 * @param {string} movie.genre - Movie genre
 * @param {string} movie.poster - Movie poster (emoji or URI)
 * @param {function} onPress - Callback when card is pressed
 * @param {boolean} isFavorite - Whether movie is favorited
 */
const MovieCard = ({ movie, onPress, isFavorite = false }) => {
  /**
   * Render star rating
   */
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={12}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <BlurView intensity={30} style={styles.card}>
        {/* Poster Section */}
        <View style={styles.posterContainer}>
          <Text style={styles.poster}>{movie.poster}</Text>
          
          {/* Favorite Badge */}
          {isFavorite && (
            <View style={styles.favoriteBadge}>
              <Ionicons name="heart" size={16} color="#FF6B9D" />
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {movie.title}
          </Text>

          {/* Genre Badge */}
          <View style={styles.genreBadge}>
            <Text style={styles.genre}>{movie.genre}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(movie.rating)}</View>
            <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },

  card: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(27, 47, 79, 0.5)',
  },

  // Poster Section
  posterContainer: {
    height: 200,
    backgroundColor: 'rgba(11, 31, 63, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  poster: {
    fontSize: 80,
  },

  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info Section
  infoContainer: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  genreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },

  genre: {
    fontSize: 10,
    color: '#D4AF37',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  stars: {
    flexDirection: 'row',
    gap: 2,
  },

  ratingText: {
    fontSize: 12,
    color: '#C0C0C0',
    fontWeight: '600',
  },
});

export default MovieCard;