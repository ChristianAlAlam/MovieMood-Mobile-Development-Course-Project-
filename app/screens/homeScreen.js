import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import reusable components
import Header from '../components/header';
import MovieCard from '../components/movieCard';
import SectionHeader from '../components/sectionHeader';
import StatsCard from '../components/statsCard';

// Import styles
import styles from '../styles/homeStyles';

// Import auth service
import { getCurrentUser } from '../services/authService';

/**
 * HomeScreen - Main dashboard of the app
 * 
 * Shows:
 * - User greeting
 * - Quick stats (total movies, favorites, etc.)
 * - Recent movies (horizontal scroll)
 * - Favorite movies
 * - Quick actions
 * 
 * @param {object} navigation - React Navigation object
 */
export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data - will be replaced with real data from AsyncStorage
  const [stats, setStats] = useState({
    totalMovies: 12,
    favorites: 5,
    avgRating: 4.2,
    thisWeek: 3,
  });

  // Mock recent movies - will be replaced with real data
  const [recentMovies, setRecentMovies] = useState([
    { id: '1', title: 'Inception', rating: 5, genre: 'Sci-Fi', poster: '🎬' },
    { id: '2', title: 'The Matrix', rating: 4.5, genre: 'Action', poster: '🎭' },
    { id: '3', title: 'Interstellar', rating: 5, genre: 'Sci-Fi', poster: '🚀' },
    { id: '4', title: 'The Dark Knight', rating: 4.8, genre: 'Action', poster: '🦇' },
  ]);

  // Load user data and movies on mount
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load user data and movie statistics
   */
  const loadData = async () => {
    try {
      // Get current user
      const userData = await getCurrentUser();
      setUser(userData);

      // TODO: Load movies from AsyncStorage
      // const movies = await getMovies();
      // Calculate stats from movies
      // Update state

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  /**
   * Navigate to movie details
   */
  const handleMoviePress = (movie) => {
    // TODO: Navigate to movie details screen
    console.log('Movie pressed:', movie.title);
    // navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  /**
   * Navigate to all movies
   */
  const handleSeeAllMovies = () => {
    navigation.navigate('Movies');
  };

  /**
   * Navigate to favorites
   */
  const handleSeeAllFavorites = () => {
    navigation.navigate('Favs');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent={true} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24', '#0A0A0F']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        {/* Spotlight Effect */}
        <View style={styles.spotlight} />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4AF37"
            />
          }
        >
          {/* Header Component */}
          <Header
            userName={user?.name}
            userAvatar={user?.avatar}
            onProfilePress={() => navigation.navigate('Profile')}
          />

          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
            <Text style={styles.subGreeting}>
              You have {stats.totalMovies} movies in your collection
            </Text>
          </View>

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <StatsCard
              icon="🎬"
              value={stats.totalMovies}
              label="Movies"
              color="#D4AF37"
            />
            <StatsCard
              icon="❤️"
              value={stats.favorites}
              label="Favorites"
              color="#FF6B9D"
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              icon="⭐"
              value={stats.avgRating.toFixed(1)}
              label="Avg Rating"
              color="#FFD700"
            />
            <StatsCard
              icon="📅"
              value={stats.thisWeek}
              label="This Week"
              color="#4ECDC4"
            />
          </View>

          {/* Recent Movies Section */}
          <SectionHeader
            title="Recent Movies"
            icon="🎬"
            onSeeAll={handleSeeAllMovies}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moviesScrollView}
            contentContainerStyle={styles.moviesScrollContent}
          >
            {recentMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPress={() => handleMoviePress(movie)}
              />
            ))}
          </ScrollView>

          {/* Favorites Section */}
          <SectionHeader
            title="Your Favorites"
            icon="❤️"
            onSeeAll={handleSeeAllFavorites}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moviesScrollView}
            contentContainerStyle={styles.moviesScrollContent}
          >
            {recentMovies.slice(0, 2).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPress={() => handleMoviePress(movie)}
                isFavorite
              />
            ))}
          </ScrollView>

          {/* Bottom Spacing for Tab Bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}