import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * MovieCard - Grid view movie card component
 * 
 * @param {object} movie - Movie data
 * @param {function} onPress - Called when card is pressed
 * @param {function} onOptionsPress - Called when options button is pressed
 */
export default function MovieCard({ movie, onPress, onOptionsPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: movie.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      
      {/* Options Button */}
      {onOptionsPress && (
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={onOptionsPress}
          activeOpacity={0.8}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Rating Badge */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={styles.ratingText}>{movie.rating}</Text>
      </View>

      {/* Movie Info Overlay */}
      <View style={styles.infoOverlay}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.movieYear}>{movie.year}</Text>
      </View>

      {/* Status Indicators */}
      <View style={styles.statusContainer}>
        {movie.isFavorite && (
          <View style={styles.statusBadge}>
            <Ionicons name="heart" size={12} color="#FF6B9D" />
          </View>
        )}
        {movie.isCompleted && (
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2A2A3A',
  },
  poster: {
    width: '100%',
    height: 240,
    backgroundColor: '#1A1A24',
  },
  optionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoOverlay: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});