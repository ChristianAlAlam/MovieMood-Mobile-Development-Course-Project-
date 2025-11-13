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
import Header from '../components/header';
import FiltersModal from '../modal/filtersModal';
import styles from '../styles/favoriteStyles';

import { applySearchAndFilters } from '../services/filterService';
import { getFavoriteMovies, toggleFavorite } from '../services/movieService';

export default function FavoritesScreen({ navigation }) {
  const [allFavorites, setAllFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    years: [],
    ratings: [],
    ratingRanges: [],
    sort: 'newest',
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const favMovies = await getFavoriteMovies();
      setAllFavorites(favMovies);
      applyFiltersToMovies(favMovies, searchQuery, activeFilters);
      setLoading(false);
    } catch (error) {
      console.error('Load favorites error:', error);
      setLoading(false);
    }
  };

  const applyFiltersToMovies = (movies, search, filters) => {
    const result = applySearchAndFilters(movies, search, filters);
    setFilteredFavorites(result);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setSearchQuery('');
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFiltersToMovies(allFavorites, query, activeFilters);
  };

  const handleFiltersApply = (filters) => {
    setActiveFilters(filters);
    applyFiltersToMovies(allFavorites, searchQuery, filters);
    setFiltersVisible(false);
  };

  const getActiveFiltersCount = () => {
    return (
      activeFilters.genres.length +
      activeFilters.years.length +
      activeFilters.ratings.length
    );
  };

  const handleToggleFavorite = async (movieId) => {
    const result = await toggleFavorite(movieId);
    if (result.success) {
      if (!result.isFavorite) {
        const updatedFavorites = allFavorites.filter((m) => m.id !== movieId);
        setAllFavorites(updatedFavorites);
        applyFiltersToMovies(updatedFavorites, searchQuery, activeFilters);
      }
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item.id)}
      >
        <Ionicons name="heart" size={20} color="#FF6B9D" />
      </TouchableOpacity>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {searchQuery || getActiveFiltersCount() > 0 ? (
        <>
          <Ionicons name="search-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters or search terms
          </Text>
          {getActiveFiltersCount() > 0 && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                setActiveFilters({
                  genres: [],
                  years: [],
                  ratings: [],
                  ratingRanges: [],
                  sort: 'newest',
                });
                setSearchQuery('');
                applyFiltersToMovies(allFavorites, '', {
                  genres: [],
                  years: [],
                  ratings: [],
                  ratingRanges: [],
                  sort: 'newest',
                });
              }}
            >
              <Text style={styles.emptyButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Ionicons name="heart-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Mark movies as favorite to see them here
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Watchlist')}
          >
            <Text style={styles.emptyButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent={true} />

      <LinearGradient colors={['#0A0A0F', '#1A1A24']} style={styles.gradient}>
        <Header
          title="My Favorites"
          iconName="heart"
          iconColor="#FF6B9D"
          itemCount={filteredFavorites.length}
          onProfilePress={() => navigation.navigate('Profile')}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search favorites..."
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
          
            {/* Header with Title and Actions */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your LoveList</Text>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.iconButton, getActiveFiltersCount() > 0 && styles.iconButtonActive]}
                onPress={() => setFiltersVisible(true)}
              >
                <Ionicons name="options-outline" size={22} color="#fff" />
                {getActiveFiltersCount() > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                <Ionicons
                  name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsAddModalVisible(true)}
              >
                <Ionicons name='add-outline' size={22} color="#FFFFFF"/>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Movies Grid */}
        <FlatList
          data={filteredFavorites}
          renderItem={({ item }) => renderMovieItem({ item })}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
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

      {/* Filters Modal */}
      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={handleFiltersApply}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}