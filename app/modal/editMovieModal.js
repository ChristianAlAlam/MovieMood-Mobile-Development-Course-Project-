import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
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
  View
} from 'react-native';
import * as Yup from 'yup';
import { updateMovie } from '../services/movieService';

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
  duration: Yup.string()
    .matches(/^(\d+\s?(min|h|hours?|minutes?))?$/i, 'Invalid duration format'),
  rating: Yup.number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5'),
  comment: Yup.string().max(500, 'Comment is too long (max 500 characters)'),
});

export default function EditMovieModal({ visible, onClose, movie, onSuccess }) {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary'];

  if (!movie) return null;

  const pickImage = async (setFieldValue) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions!');
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
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await updateMovie(movie.id, {
        ...values,
        rating: Number(values.rating),
      });

      if (result.success) {
        Alert.alert('Success', 'Movie updated successfully!');
        onSuccess && onSuccess(result.movie);
        onClose();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Update movie error:', error);
      Alert.alert('Error', 'Failed to update movie');
    }
    setSubmitting(false);
  };

  const renderStars = (rating, setFieldValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setFieldValue('rating', i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#FFD700"
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Formik
            initialValues={{
              title: movie.title || '',
              genre: movie.genre || 'Action',
              year: movie.year?.toString() || new Date().getFullYear().toString(),
              duration: movie.duration || '',
              rating: movie.rating || 0,
              comment: movie.comment || '',
              poster: movie.poster || null,
              watchProgress: movie.watchProgress || 0,
              isFavorite: movie.isFavorite || false,
              isCompleted: movie.isCompleted || false,
            }}
            validationSchema={MovieSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.title}>Edit Movie</Text>
                  <View style={{ width: 28 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.posterSection}>
                    <TouchableOpacity
                      style={styles.posterButton}
                      onPress={() => pickImage(setFieldValue)}
                    >
                      {values.poster ? (
                        <Image source={{ uri: values.poster }} style={styles.posterImage} />
                      ) : (
                        <View style={styles.posterPlaceholder}>
                          <Ionicons name="image-outline" size={40} color="#fff" />
                          <Text style={styles.posterText}>Change Poster</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>TITLE *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.title && errors.title && styles.inputError,
                      ]}
                      placeholder="Enter movie title"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={values.title}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                    />
                    {touched.title && errors.title && (
                      <Text style={styles.errorText}>{errors.title}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>GENRE *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.genreRow}>
                        {genres.map((genre) => (
                          <TouchableOpacity
                            key={genre}
                            style={[
                              styles.genreChip,
                              values.genre === genre && styles.genreChipActive,
                            ]}
                            onPress={() => setFieldValue('genre', genre)}
                          >
                            <Text
                              style={[
                                styles.genreChipText,
                                values.genre === genre && styles.genreChipTextActive,
                              ]}
                            >
                              {genre}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={styles.label}>YEAR</Text>
                      <TextInput
                        style={[
                          styles.input,
                          touched.year && errors.year && styles.inputError,
                        ]}
                        placeholder="2024"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={values.year}
                        onChangeText={handleChange('year')}
                        onBlur={handleBlur('year')}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      {touched.year && errors.year && (
                        <Text style={styles.errorText}>{errors.year}</Text>
                      )}
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>DURATION</Text>
                      <TextInput
                        style={[
                          styles.input,
                          touched.duration && errors.duration && styles.inputError,
                        ]}
                        placeholder="120 min"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={values.duration}
                        onChangeText={handleChange('duration')}
                        onBlur={handleBlur('duration')}
                      />
                      {touched.duration && errors.duration && (
                        <Text style={styles.errorText}>{errors.duration}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>RATING</Text>
                    <View style={styles.starsRow}>
                      {renderStars(values.rating, setFieldValue)}
                    </View>
                    <Text style={styles.ratingHint}>
                      {values.rating > 0 ? `${values.rating} / 5 stars` : 'Tap to rate'}
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>COMMENT / REVIEW</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        touched.comment && errors.comment && styles.inputError,
                      ]}
                      placeholder="Write your thoughts..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={values.comment}
                      onChangeText={handleChange('comment')}
                      onBlur={handleBlur('comment')}
                      multiline
                      numberOfLines={4}
                    />
                    {touched.comment && errors.comment && (
                      <Text style={styles.errorText}>{errors.comment}</Text>
                    )}
                    <Text style={styles.characterCount}>
                      {values.comment.length} / 500 characters
                    </Text>
                  </View>

                  {/* Watch Progress */}
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
                    </Text>
                  </View>

                  <View style={styles.togglesRow}>
                    <TouchableOpacity
                      style={styles.toggleButton}
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
                      style={styles.toggleButton}
                      onPress={() => setFieldValue('isCompleted', !values.isCompleted)}
                    >
                      <Ionicons
                        name={
                          values.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'
                        }
                        size={24}
                        color={values.isCompleted ? '#4ECDC4' : '#fff'}
                      />
                      <Text style={styles.toggleText}>Completed</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ height: 20 }} />
                </ScrollView>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A24',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  posterSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  posterButton: {
    width: 150,
    height: 225,
    borderRadius: 12,
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  posterText: {
    color: '#fff',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 6,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
  },
  genreRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genreChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  genreChipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  genreChipTextActive: {
    color: '#fff',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
  },
  togglesRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});