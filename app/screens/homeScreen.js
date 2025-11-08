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

// Import styles
import styles from '../styles/homeStyles';

// Import auth service
import Header from '../components/header';
import { getCurrentUser } from '../services/authService';

/**
 * HomeScreen - Netflix-style Movie Dashboard
 * 
 * Features:
 * - Top trending movies (horizontal scroll with posters)
 * - Continue watching section
 * - New releases
 * - Minimal header with profile and menu
 */
export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - will be replaced with real data from AsyncStorage
  const trendingMovies = [
    { 
      id: '1', 
      title: 'The Citadel', 
      poster: 'https://image.tmdb.org/t/p/w500/qVygtf2vU15L2yKS4Ke44U4oMdD.jpg',
      rating: 4.5 
    },
    { 
      id: '2', 
      title: 'Love Again', 
      poster: 'https://image.tmdb.org/t/p/w500/yQ7Ajbr3Wd6VJtrthANyUaqZq3B.jpg',
      rating: 4.0 
    },
    { 
      id: '3', 
      title: 'Avatar 2', 
      poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      rating: 4.8 
    },
  ];

  const continueWatching = {
    id: '4',
    title: 'Mission: Impossible - The Final Reckoning',
    poster: 'https://images.ui8.net/uploads/frame-59_1699887134739.jpg',
    progress: 0.6, // 60% watched
    timeLeft: '50 min left',
  };

  const newReleases = [
    { 
      id: '5', 
      title: 'Oppenheimer', 
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      rating: 5.0 
    },
    { 
      id: '6', 
      title: 'Barbie', 
      poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
      rating: 4.3 
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMoviePress = (movie) => {
    console.log('Movie pressed:', movie.title);
    // TODO: Navigate to movie details
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24']}
        location={[0, 1]}
        style={styles.gradient}
      >
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
          <Header 
            userAvatar={user?.avatar}
            onProfilePress={() => navigation.navigate("Profile")}
            mode="simple"
            title="Home"
          />

          {/* Top Trending Movies */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Favorites</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {trendingMovies.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.trendingCard}
                  onPress={() => handleMoviePress(movie)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: movie.poster }}
                    style={styles.trendingPoster}
                    resizeMode="cover"
                  />
                  {/* Rating Badge */}
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{movie.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Continue Watching */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue watching</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Continue')}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.continueWatchingCard}
              onPress={() => handleMoviePress(continueWatching)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: continueWatching.poster }}
                style={styles.continueWatchingPoster}
                resizeMode="cover"
              />
              
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.continueWatchingOverlay}
              >
                <View style={styles.continueWatchingInfo}>
                  <Text style={styles.continueTimeLeft}>{continueWatching.timeLeft}</Text>
                  <Text style={styles.continueTitle}>{continueWatching.title}</Text>
                </View>
              </LinearGradient>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${continueWatching.progress * 100}%` }]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* New Released */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Watchlist</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Watchlist')}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {newReleases.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.trendingCard}
                  onPress={() => handleMoviePress(movie)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: movie.poster }}
                    style={styles.trendingPoster}
                    resizeMode="cover"
                  />
                  {/* Rating Badge */}
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{movie.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Bottom Spacing for Tab Bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}