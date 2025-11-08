import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/continueWatchingStyles';

import { getMovies } from '../services/movieService';

/**
 * ContinueWatchingScreen - Shows all incomplete movies
 * 
 * Features:
 * - Search incomplete movies
 * - Filter movies with watchProgress < 1
 * - Show progress bar and time left
 * - Navigate to movie details
 */
export default function ContinueWatchingScreen({ navigation }) {
  const [allInProgress, setAllInProgress] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInProgressMovies();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadInProgressMovies();
    });
    return unsubscribe;
  }, [navigation]);

  const loadInProgressMovies = async () => {
    try {
      const allMovies = await getMovies();
      // Filter movies that are NOT completed
      const inProgress = allMovies.filter((m) => !m.isCompleted);
      setAllInProgress(inProgress);
      setFilteredMovies(inProgress);
      setLoading(false);
    } catch (error) {
      console.error('Load in progress movies error:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInProgressMovies();
    setSearchQuery('');
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredMovies(allInProgress);
      return;
    }

    // Search within incomplete movies
    const lowerQuery = query.toLowerCase();
    const results = allInProgress.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.genre.toLowerCase().includes(lowerQuery) ||
        (movie.comment && movie.comment.toLowerCase().includes(lowerQuery))
    );
    setFilteredMovies(results);
  };

  const calculateTimeLeft = (duration, progress) => {
    const match = duration.match(/(\d+)/);
    if (!match) return 'Time left';

    const totalMinutes = parseInt(match[0]);
    const remainingMinutes = Math.ceil(totalMinutes * (1 - progress));

    if (remainingMinutes < 60) {
      return `${remainingMinutes} min left`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}min left` : `${hours}h left`;
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.movieGradient}
      >
        <View style={styles.movieInfo}>
          {item.watchProgress > 0 && (
            <Text style={styles.timeLeft}>
              {calculateTimeLeft(item.duration, item.watchProgress)}
            </Text>
          )}
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.year}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.genre}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Progress Bar */}
      {item.watchProgress > 0 && (
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${item.watchProgress * 100}%` }]}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {searchQuery ? (
        <>
          <Ionicons name="search-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching with different keywords
          </Text>
        </>
      ) : (
        <>
          <Ionicons
            name="checkmark-circle-outline"
            size={80}
            color="rgba(255, 255, 255, 0.3)"
          />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            You've completed all your movies
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Movies')}
          >
            <Text style={styles.emptyButtonText}>Add More Movies</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#0A0A0F', '#1A1A24']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="play-circle" size={28} color="#D4AF37" />
            <Text style={styles.headerTitle}>Continue Watching</Text>
          </View>
          <Text style={styles.headerCount}>{filteredMovies.length} movies</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search incomplete movies..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Movies List */}
        <FlatList
          data={filteredMovies}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading && renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4AF37"
            />
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
}