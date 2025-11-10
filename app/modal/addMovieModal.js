import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { addMovie } from '../services/movieService';

// ------------------- Validation -------------------
const MovieSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Title is too short')
    .max(100, 'Title is too long')
    .required('Title is required'),
  genre: Yup.string().required('Genre is required'),
  year: Yup.string()
    .matches(/^\d{4}$/, 'Year must be 4 digits')
    .test('valid-year', 'Year must be between 1900 and current year', (value) => {
      if (!value) return true;
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }),
  duration: Yup.string(),
  rating: Yup.number().min(0).max(10),
  comment: Yup.string().max(500),
  watchProgress: Yup.number().min(0).max(1).required(),
});

// ------------------- AddMovieModal -------------------
export default function AddMovieModal({ visible, onClose, onSuccess }) {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation'];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const initialValues = {
    title: '',
    genre: 'Action',
    year: new Date().getFullYear().toString(),
    duration: '',
    rating: 0,
    comment: '',
    poster: null,
    isFavorite: false,
    isCompleted: false,
    watchProgress: 0,
  };

  // ------------------- OMDB API -------------------
  // Get your free API key from: http://www.omdbapi.com/apikey.aspx
  const API_KEY = '17d0e9ea'; // This is the key for the API

  const searchMovies = async (query) => {
    if (!query || query.length < 2) return [];
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
      const data = await response.json();
      
      setIsSearching(false);
      
      if (data.Response === 'True') {
        return data.Search || [];
      } else if (data.Error === 'Invalid API key!') {
        Alert.alert('API Error', 'Please add a valid OMDB API key. Get one free at http://www.omdbapi.com/apikey.aspx');
        return [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
      Alert.alert('Search Error', 'Failed to search movies. Please check your internet connection.');
      return [];
    }
  };

  const getMovieDetails = async (imdbID, setFieldValue) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        // Map OMDB genre to our genre list
        const omdbGenre = data.Genre ? data.Genre.split(',')[0].trim() : 'Action';
        const matchedGenre = genres.find(g => g.toLowerCase() === omdbGenre.toLowerCase()) || 'Action';
        
        // Convert IMDB rating (0-10) to our rating system (0-10)
        const imdbRating = parseFloat(data.imdbRating) || 0;
        
        // Format duration (e.g., "142 min" to "2h 22min")
        let formattedDuration = data.Runtime || '';
        if (formattedDuration && formattedDuration !== 'N/A') {
          const minutes = parseInt(formattedDuration);
          if (!isNaN(minutes)) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            formattedDuration = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
          }
        }

        // Set all form values
        setFieldValue('title', data.Title || '');
        setFieldValue('year', data.Year || new Date().getFullYear().toString());
        setFieldValue('genre', matchedGenre);
        setFieldValue('duration', formattedDuration);
        setFieldValue('poster', data.Poster !== 'N/A' ? data.Poster : null);
        setFieldValue('rating', imdbRating);
        setFieldValue('comment', data.Plot !== 'N/A' ? data.Plot : '');
        
        // Close search results
        setSearchResults([]);
        setSearchQuery('');
        
        Alert.alert('Success', 'Movie details loaded! Review and add to your watchlist.');
      } else {
        Alert.alert('Error', 'Failed to load movie details');
      }
    } catch (error) {
      console.error('Failed to get details:', error);
      Alert.alert('Error', 'Failed to load movie details');
    }
  };

  // Debounced search
  let searchTimeout;
  const handleSearchChange = async (text) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Debounce search by 500ms
    searchTimeout = setTimeout(async () => {
      const results = await searchMovies(text);
      setSearchResults(results);
    }, 500);
  };

  // ------------------- Image Picker -------------------
  const pickImage = async (setFieldValue) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to add a poster!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setFieldValue('poster', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // ------------------- Handle Submit -------------------
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await addMovie({
        ...values,
        poster: values.poster || 'https://via.placeholder.com/300x450?text=No+Poster',
        rating: Number(values.rating),
        year: parseInt(values.year),
      });
      
      if (result.success) {
        Alert.alert('Success', 'Movie added to your watchlist!');
        resetForm();
        setSearchQuery('');
        setSearchResults([]);
        onSuccess && onSuccess(result.movie);
        onClose();
      } else {
        Alert.alert('Error', result.message || 'Failed to add movie');
      }
    } catch (error) {
      console.error('Save movie error:', error);
      Alert.alert('Error', 'Failed to add movie. Please try again.');
    }
    setSubmitting(false);
  };

  // ------------------- Render Stars -------------------
  const renderStars = (rating, setFieldValue) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // Convert 10-point to 5-star
    
    for (let i = 1; i <= 5; i++) {
      const starValue = i * 2; // 2, 4, 6, 8, 10
      stars.push(
        <TouchableOpacity key={i} onPress={() => setFieldValue('rating', starValue)}>
          <Ionicons 
            name={starValue <= rating ? 'star' : 'star-outline'} 
            size={32} 
            color="#FFD700" 
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Formik initialValues={initialValues} validationSchema={MovieSchema} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.title}>Add Movie</Text>
                  <View style={{ width: 28 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {/* ------------------- Movie Search ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>🔍 SEARCH MOVIE DATABASE</Text>
                    <View style={styles.searchContainer}>
                      <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title (e.g., Inception)..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                      />
                      {isSearching && (
                        <ActivityIndicator size="small" color="#8B5CF6" style={styles.searchLoader} />
                      )}
                    </View>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <View style={styles.searchResults}>
                        <ScrollView style={styles.searchResultsScroll} nestedScrollEnabled>
                          {searchResults.map((movie) => (
                            <TouchableOpacity
                              key={movie.imdbID}
                              style={styles.searchResultItem}
                              onPress={() => getMovieDetails(movie.imdbID, setFieldValue)}
                            >
                              {movie.Poster !== 'N/A' && (
                                <Image 
                                  source={{ uri: movie.Poster }} 
                                  style={styles.searchResultPoster}
                                />
                              )}
                              <View style={styles.searchResultInfo}>
                                <Text style={styles.searchResultTitle} numberOfLines={2}>
                                  {movie.Title}
                                </Text>
                                <Text style={styles.searchResultYear}>{movie.Year}</Text>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color="#888" />
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                    
                    {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                      <Text style={styles.noResultsText}>No movies found. Try a different search term.</Text>
                    )}
                    
                    <Text style={styles.searchHint}>
                      💡 Search for movies from OMDB database, or add manually below
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* ------------------- Poster ------------------- */}
                  <View style={styles.posterSection}>
                    <TouchableOpacity style={styles.posterButton} onPress={() => pickImage(setFieldValue)}>
                      {values.poster ? (
                        <Image source={{ uri: values.poster }} style={styles.posterImage} />
                      ) : (
                        <View style={styles.posterPlaceholder}>
                          <Ionicons name="image-outline" size={40} color="#fff" />
                          <Text style={styles.posterText}>Add Custom Poster</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {values.poster && (
                      <TouchableOpacity 
                        style={styles.removePosterButton}
                        onPress={() => setFieldValue('poster', null)}
                      >
                        <Text style={styles.removePosterText}>Remove Poster</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* ------------------- Title ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>TITLE *</Text>
                    <TextInput
                      style={[styles.input, touched.title && errors.title && styles.inputError]}
                      placeholder="Enter movie title"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={values.title}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                    />
                    {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                  </View>

                  {/* ------------------- Genre ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>GENRE *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.genreRow}>
                        {genres.map((genre) => (
                          <TouchableOpacity
                            key={genre}
                            style={[styles.genreChip, values.genre === genre && styles.genreChipActive]}
                            onPress={() => setFieldValue('genre', genre)}
                          >
                            <Text style={[styles.genreChipText, values.genre === genre && styles.genreChipTextActive]}>
                              {genre}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  {/* ------------------- Year & Duration ------------------- */}
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={styles.label}>YEAR</Text>
                      <TextInput
                        style={[styles.input, touched.year && errors.year && styles.inputError]}
                        placeholder="2024"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={values.year}
                        onChangeText={handleChange('year')}
                        onBlur={handleBlur('year')}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      {touched.year && errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>DURATION</Text>
                      <TextInput
                        style={[styles.input, touched.duration && errors.duration && styles.inputError]}
                        placeholder="2h 30min"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={values.duration}
                        onChangeText={handleChange('duration')}
                        onBlur={handleBlur('duration')}
                      />
                      {touched.duration && errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
                    </View>
                  </View>

                  {/* ------------------- Rating ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>RATING (0-10)</Text>
                    <View style={styles.starsRow}>{renderStars(values.rating, setFieldValue)}</View>
                    <Text style={styles.ratingHint}>
                      {values.rating > 0 ? `${values.rating} / 10` : 'Tap stars to rate (each star = 2 points)'}
                    </Text>
                  </View>

                  {/* ------------------- Comment ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>COMMENT / REVIEW</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, touched.comment && errors.comment && styles.inputError]}
                      placeholder="Write your thoughts about this movie..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={values.comment}
                      onChangeText={handleChange('comment')}
                      onBlur={handleBlur('comment')}
                      multiline
                      numberOfLines={4}
                    />
                    {touched.comment && errors.comment && <Text style={styles.errorText}>{errors.comment}</Text>}
                    <Text style={styles.characterCount}>{values.comment.length} / 500 characters</Text>
                  </View>

                  {/* ------------------- Watch Progress ------------------- */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>WATCH PROGRESS</Text>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={1}
                      step={0.01}
                      value={values.watchProgress}
                      minimumTrackTintColor="#8B5CF6"
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor="#fff"
                      onValueChange={(val) => setFieldValue('watchProgress', val)}
                    />
                    <Text style={styles.ratingHint}>
                      {Math.round(values.watchProgress * 100)}% watched
                      {values.watchProgress === 0 && ' (Not started)'}
                      {values.watchProgress === 1 && ' (Completed)'}
                    </Text>
                  </View>

                  {/* ------------------- Toggles ------------------- */}
                  <View style={styles.togglesRow}>
                    <TouchableOpacity 
                      style={[styles.toggleButton, values.isFavorite && styles.toggleButtonActive]}
                      onPress={() => setFieldValue('isFavorite', !values.isFavorite)}
                    >
                      <Ionicons 
                        name={values.isFavorite ? 'heart' : 'heart-outline'} 
                        size={24} 
                        color={values.isFavorite ? '#FF6B9D' : '#fff'} 
                      />
                      <Text style={styles.toggleText}>Favorite</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.toggleButton, values.isCompleted && styles.toggleButtonActive]}
                      onPress={() => {
                        setFieldValue('isCompleted', !values.isCompleted);
                        if (!values.isCompleted) {
                          setFieldValue('watchProgress', 1);
                        }
                      }}
                    >
                      <Ionicons 
                        name={values.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                        size={24} 
                        color={values.isCompleted ? '#4CAF50' : '#fff'} 
                      />
                      <Text style={styles.toggleText}>Completed</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ height: 20 }} />
                </ScrollView>

                {/* Save Button */}
                <TouchableOpacity 
                  style={[styles.saveButton, (!values.title || isSubmitting) && styles.saveButtonDisabled]} 
                  onPress={handleSubmit} 
                  disabled={!values.title || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      Add to Watchlist
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.95)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#1A1A24', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    maxHeight: '92%', 
    paddingBottom: 20 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#fff' 
  },
  scrollView: { 
    paddingHorizontal: 20 
  },
  
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#fff',
  },
  searchLoader: {
    marginLeft: 10,
  },
  searchResults: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchResultsScroll: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchResultPoster: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  searchResultYear: {
    color: '#888',
    fontSize: 13,
  },
  noResultsText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  searchHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  
  // Poster styles
  posterSection: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
  posterButton: { 
    width: 150, 
    height: 225, 
    borderRadius: 12, 
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  posterImage: { 
    width: '100%', 
    height: '100%' 
  },
  posterPlaceholder: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  posterText: { 
    color: '#fff', 
    fontSize: 14 
  },
  removePosterButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removePosterText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  
  // Input styles
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#FFFFFF', 
    letterSpacing: 2, 
    marginBottom: 10 
  },
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 16, 
    color: '#fff', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)' 
  },
  inputError: { 
    borderColor: '#FF6B6B' 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  errorText: { 
    color: '#FF6B6B', 
    fontSize: 12, 
    marginTop: 6, 
    marginLeft: 4 
  },
  characterCount: { 
    fontSize: 11, 
    color: 'rgba(255, 255, 255, 0.5)', 
    marginTop: 6, 
    textAlign: 'right' 
  },
  row: { 
    flexDirection: 'row' 
  },
  
  // Genre styles
  genreRow: { 
    flexDirection: 'row', 
    gap: 10,
    paddingVertical: 5,
  },
  genreChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)' 
  },
  genreChipActive: { 
    backgroundColor: '#8B5CF6', 
    borderColor: '#8B5CF6' 
  },
  genreChipText: { 
    color: 'rgba(255, 255, 255, 0.6)', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  genreChipTextActive: { 
    color: '#fff' 
  },
  
  // Rating styles
  starsRow: { 
    flexDirection: 'row', 
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  ratingHint: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.5)', 
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Toggle styles
  togglesRow: { 
    flexDirection: 'row', 
    gap: 15, 
    marginBottom: 20 
  },
  toggleButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)' 
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
  },
  toggleText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  
  // Save button styles
  saveButton: { 
    marginHorizontal: 20, 
    backgroundColor: '#8B5CF6', 
    paddingVertical: 16, 
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  saveButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#fff' 
  },
});