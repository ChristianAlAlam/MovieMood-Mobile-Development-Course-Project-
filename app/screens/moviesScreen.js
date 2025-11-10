import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
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
import MovieOptionsMenu from '../components/movieOptionsMenu';
import FiltersModal from '../modal/filtersModal';
import styles from '../styles/movieStyles';

import { useEffect } from 'react';
import Header from '../components/header';
import MovieCard from '../components/movieCard';
import AddMovieModal from '../modal/addMovieModal';
import EditMovieModal from '../modal/editMovieModal';
import { getCurrentUser } from '../services/authService';
import { applySearchAndFilters } from '../services/filterService';
import { deleteMovie, getMovies, toggleCompleted, toggleFavorite } from '../services/movieService';

export default function MoviesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);


  
  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    years: [],
    ratings: [],
    ratingRanges: [],
    sort: 'newest',
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setSearchQuery('');
    setRefreshing(false);
  };

  const loadMovies = async () => {
    try {
      const movies = await getMovies();
      setAllMovies(movies);
      // Apply current filters and search
      applyFiltersToMovies(movies, searchQuery, activeFilters);
      setLoading(false);
    } catch (error) {
      console.log("Load Movies error:", error);
      setLoading(false);
    }
  };

  const handleCurrentUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleMovieAdded = (newMovie) => {
    const formatted = {
      id: Date.now().toString(),
      title: newMovie.title,
      year: newMovie.year,
      duration: newMovie.duration,
      rating: newMovie.rating,
      poster: newMovie.poster,
      genre: newMovie.genre,
      description: newMovie.comment || '',
    };
    const updatedMovies = [formatted, ...allMovies];
    setAllMovies(updatedMovies);
    applyFiltersToMovies(updatedMovies, searchQuery, activeFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFiltersToMovies(allMovies, query, activeFilters);
  };

  const applyFiltersToMovies = (movies, search, filters) => {
    const result = applySearchAndFilters(movies, search, filters);
    setFilteredMovies(result);
  };

  const handleFiltersApply = (filters) => {
    setActiveFilters(filters);
    applyFiltersToMovies(allMovies, searchQuery, filters);
    setFiltersVisible(false);
  };

  const getActiveFiltersCount = () => {
    return (
      activeFilters.genres.length +
      activeFilters.years.length +
      activeFilters.ratings.length
    );
  };

  const handleOptionsPress = (movie, event) => {
    event.stopPropagation();
    setSelectedMovie(movie);
    setOptionsMenuVisible(true);
  };

const handleOptionsUpdate = async (action, movie) => {
  console.log('Handle action:', action, 'for movie:', movie.title);

  try {
    switch (action) {
      case 'delete': {
        const result = await deleteMovie(movie.id);
        if (result.success) {
          const updatedMovies = allMovies.filter(m => m.id !== movie.id);
          setAllMovies(updatedMovies);
          applyFiltersToMovies(updatedMovies, searchQuery, activeFilters);
        } else {
          console.warn(result.message);
        }
        break;
      }

      case 'favorite': {
        const result = await toggleFavorite(movie.id);
        if (result.success) {
          const updatedMovies = allMovies.map(m =>
            m.id === movie.id ? { ...m, isFavorite: result.isFavorite } : m
          );
          setAllMovies(updatedMovies);
          applyFiltersToMovies(updatedMovies, searchQuery, activeFilters);
        } else {
          console.warn('Failed to toggle favorite');
        }
        break;
      }

      case 'completed': {
        const result = await toggleCompleted(movie.id);
        if (result.success) {
          const updatedMovies = allMovies.map(m =>
            m.id === movie.id ? { ...m, isCompleted: result.isCompleted } : m
          );
          setAllMovies(updatedMovies);
          applyFiltersToMovies(updatedMovies, searchQuery, activeFilters);
        } else {
          console.warn('Failed to toggle completed');
        }
        break;
      }

      case 'edit': {
        setEditingMovie(movie);
        setEditModalVisible(true); // ✅ open EditMovieModal, not AddMovieModal
        break;
      }


      default:
        break;
    }
  } catch (error) {
    console.error('Error handling movie action:', error);
  } finally {
    setOptionsMenuVisible(false);
  }
};



  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={viewMode === 'grid' ? styles.movieCardGrid : styles.movieCardList}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.poster }}
        style={viewMode === 'grid' ? styles.posterGrid : styles.posterList}
      />
      
      {viewMode === 'list' && (
        <View style={styles.movieInfo}>
          <View style={styles.movieHeader}>
            <View style={styles.movieTitleRow}>
              <Text style={styles.movieYear}>{item.year}</Text>
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity onPress={(e) => handleOptionsPress(item, e)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      )}
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
                applyFiltersToMovies(allMovies, '', {
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
          <Ionicons name="film-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>No Movies Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first movie to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.emptyButtonText}>Add Movie</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  useEffect(() => {
    handleCurrentUser();
    loadMovies();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24']}
        style={styles.gradient}
      >
        <Header 
          mode="simple"
          title="Watchlist"
          iconName="play-circle"
          iconColor="#FFFFFF"
          itemCount={filteredMovies.length}
          onProfilePress={() => navigation.navigate("Profile")}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
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

        {/* Header with Title and Actions */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Movies</Text>
          
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
            
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </View>

        {/* Movies List */}
        <FlatList
          data={filteredMovies}
          key={viewMode}
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between', paddingHorizontal: 20 } : null}
          renderItem={({ item }) =>
            viewMode === 'grid' ? (
              <MovieCard
                movie={item}
                onPress={() => handleMoviePress(item)}
                onOptionsPress={(e) => handleOptionsPress(item, e)}
              />
            ) : (
              renderMovieItem({ item })
            )
          }
          ListEmptyComponent={!loading && renderEmptyState}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.moviesList}
          showsVerticalScrollIndicator={false}
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

      {/* Add Movie Modal */}
      <AddMovieModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={handleMovieAdded}
      />

      {/* Movie Options Menu */}
      <MovieOptionsMenu
        visible={optionsMenuVisible}
        onClose={() => setOptionsMenuVisible(false)}
        movie={selectedMovie}
        onUpdate={handleOptionsUpdate}
      />

      <EditMovieModal
        visible={editModalVisible}
        movie={editingMovie}            // pass the movie to edit
        onClose={() => {
          setEditModalVisible(false);
          setEditingMovie(null);
        }}
        onSuccess={(updatedMovie) => {
          // Update the movies list with the edited movie
          const updatedMovies = allMovies.map(m =>
            m.id === updatedMovie.id ? updatedMovie : m
          );
          setAllMovies(updatedMovies);
          applyFiltersToMovies(updatedMovies, searchQuery, activeFilters);

          setEditModalVisible(false);
          setEditingMovie(null);
        }}
      />



    </SafeAreaView>
  );
}