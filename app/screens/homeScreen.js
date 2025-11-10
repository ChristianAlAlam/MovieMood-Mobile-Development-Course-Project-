import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/header';
import { getCurrentUser } from '../services/authService';
import { getFavoriteMovies, getMovies } from '../services/movieService';
import styles from '../styles/homeStyles';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadAllMovies = async () => {
    try {
      const movie = await getMovies();
      setMovies(movie);
    } catch (error) {
      console.log('Load Movies error', error);
    }
  };

  const loadAllFavorite = async () => {
    try {
      const movie = await getFavoriteMovies();
      setFavorites(movie);
    } catch (error) {
      console.log('Load Favorite error', error);
    }
  };

  const loadInProgressMovies = async () => {
    try {
      const movie = await getMovies();
      const inProgress = movie.filter((m) => m && !m.isCompleted);
      const moviesWithProgress = inProgress.map((m) => ({
        ...m,
        watchProgress: m.watchProgress || 0.3,
        timeLeft: m.timeLeft || calculateTimeLeft(m.duration, m.watchProgress || 0.3),
      }));
      setContinueWatching(moviesWithProgress);
    } catch (error) {
      console.log('Load In Progress error', error);
    }
  };

  const calculateTimeLeft = (duration, progress) => {
    if (!duration) return 'Continue watching';
    const matches = duration.match(/(\d+)h?\s*(\d+)?m?/i);
    if (!matches) return 'Continue watching';

    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    const totalMinutes = hours * 60 + minutes;
    const remainingMinutes = Math.round(totalMinutes * (1 - progress));

    if (remainingMinutes < 1) return 'Almost done';
    if (remainingMinutes < 60) return `${remainingMinutes} min left`;

    const remHours = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;
    return remMins > 0 ? `${remHours}h ${remMins}m left` : `${remHours}h left`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await loadAllMovies();
    await loadAllFavorite();
    await loadInProgressMovies();
    setRefreshing(false);
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const renderSection = (title, data, emptyMessage, navigateScreen, cardStyle, posterStyle) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(navigateScreen)}>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <Text style={{ color: 'gray', textAlign: 'center', marginTop: 10 }}>
          {emptyMessage}
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {data.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={cardStyle}
              onPress={() => handleMoviePress(movie)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: movie.poster }}
                style={posterStyle}
                resizeMode="cover"
              />

              {/* Optional overlays for continue watching */}
              {title === 'Continue watching' && (
                <>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.continueWatchingOverlay}
                  >
                    <View style={styles.continueWatchingInfo}>
                      <Text style={styles.continueTimeLeft}>
                        {movie.timeLeft || 'Continue'}
                      </Text>
                      <Text style={styles.continueTitle} numberOfLines={1}>
                        {movie.title}
                      </Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${(movie.watchProgress || 0) * 100}%` },
                      ]}
                    />
                  </View>
                </>
              )}

              {/* Rating badge for other sections */}
              {title !== 'Continue watching' && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{movie.rating}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#0A0A0F', '#1A1A24']} location={[0, 1]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
        >
          <Header
            mode="simple"
            title="Home"
            iconName="home"
            iconColor="#FFFFFF"
            isHome={true}
            onProfilePress={() => navigation.navigate('Profile')}
          />

          {renderSection(
            'Your Favorites',
            favorites,
            'No favorite movies yet ❤️',
            'Favorite',
            styles.trendingCard,
            styles.trendingPoster
          )}

          {renderSection(
            'Continue watching',
            continueWatching,
            'No movies in progress yet 🎬',
            'Continue',
            styles.continueWatchingCard,
            styles.continueWatchingPoster
          )}

          {renderSection(
            'Your Watchlist',
            movies,
            'No movies yet 🎬',
            'Watchlist',
            styles.trendingCard,
            styles.trendingPoster
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
