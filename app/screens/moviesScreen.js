import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FiltersModal from '../components/filtersModal';
import styles from '../styles/movieStyles';

import { useEffect } from 'react';
import Header from '../components/header';
import MovieCard from '../components/movieCard';
import AddMovieModal from '../modal/addMovieModal';
import { getCurrentUser } from '../services/authService';



/**
 * MoviesScreen - Watchlist/Movie Collection
 * 
 * Features:
 * - Search movies
 * - Filter by genre, year, etc.
 * - Grid/List view toggle
 * - Movie cards with posters
 */
export default function MoviesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Adventure');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const genres = ['Action', 'Documentary', 'Sci-Fi', 'Drama', 'Comedy'];

  // Mock movies data
  const movies = [
    {
      id: '1',
      title: 'Quantumania',
      year: 2023,
      duration: '1h 58min',
      rating: 6.2,
      poster: 'https://image.tmdb.org/t/p/w500/qVygtf2vU15L2yKS4Ke44U4oMdD.jpg',
      genre: 'Action',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis augue vel pellentesque aliquet. Mauris varius dapibus vulputate. Donec nec posuere orci. Vestibulum tempor augue id molestie mollis. Aliquam magna dolor, suscipit et facilisis eget, tincidunt et eros. Pellentesque vitae.',
    },
    {
      id: '2',
      title: 'Top gun maverick',
      year: 2021,
      duration: '2h 40min',
      rating: 6.2,
      poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      genre: 'Action',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis augue vel pellentesque aliquet. Mauris varius dapibus vulputate. Donec nec posuere orci. Vestibulum tempor augue id molestie mollis. Aliquam magna dolor, suscipit et facilisis eget, tincidunt et eros. Pellentesque vitae.',
    },
    {
      id: '3',
      title: 'Ghosted',
      year: 2023,
      duration: '2h',
      rating: 6.2,
      poster: 'https://image.tmdb.org/t/p/w500/liLN69YgoovHVgmlHJ876PKi5Yi.jpg',
      genre: 'Action',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis augue vel pellentesque aliquet. Mauris varius dapibus vulputate. Donec nec posuere orci. Vestibulum tempor augue id molestie mollis. Aliquam magna dolor, suscipit et facilisis eget, tincidunt et eros. Pellentesque vitae.',
    },
    {
      id: '4',
      title: 'Fast X',
      year: 2023,
      duration: '2h 30min',
      rating: 6.2,
      poster: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
      genre: 'Action',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis augue vel pellentesque aliquet. Mauris varius dapibus vulputate. Donec nec posuere orci. Vestibulum tempor augue id molestie mollis. Aliquam magna dolor, suscipit et facilisis eget, tincidunt et eros. Pellentesque vitae.',
    },
    {
      id: '5',
      title: 'Avatar',
      year: 2022,
      duration: '3h 30min',
      rating: 6.2,
      poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      genre: 'Sci-Fi',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis augue vel pellentesque aliquet. Mauris varius dapibus vulputate. Donec nec posuere orci. Vestibulum tempor augue id molestie mollis. Aliquam magna dolor, suscipit et facilisis eget, tincidunt et eros. Pellentesque vitae.',
    },
  ];

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleMovieAdded = (newMovie) => {
    // refresh your list OR push to existing list if using state
    setMovies(prev => [...prev, newMovie]);
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
          <TouchableOpacity>
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


  useEffect(() => {
    const load = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24']}
        style={styles.gradient}
      >

      <Header 
        userAvatar={user?.avatar}
        onProfilePress={() => navigation.navigate("Profile")}
        mode="simple"
        title="Watchlist"
      />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder={selectedGenre}
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Genre Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreScroll}
          contentContainerStyle={styles.genreScrollContent}
        >
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genrePill,
                selectedGenre === genre && styles.genrePillActive,
              ]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text
                style={[
                  styles.genrePillText,
                  selectedGenre === genre && styles.genrePillTextActive,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Header with Title and Actions */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{selectedGenre} movies</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFiltersVisible(true)}
            >
              <Ionicons name="options-outline" size={22} color="#fff" />
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
          data={movies}
          key={viewMode} // re-render layout when switching
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between', paddingHorizontal: 20 } : null}
          renderItem={({ item }) =>
            viewMode === 'grid' ? (
              <MovieCard
                movie={item}
                onPress={() => handleMoviePress(item)}
              />
            ) : (
              renderMovieItem({ item })
            )
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.moviesList}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>

      {/* Filters Modal */}
      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
          setFiltersVisible(false);
        }}
      />

      {/* Add Movie Modal */}
      <AddMovieModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={handleMovieAdded}
      />

    </SafeAreaView>
  );
}