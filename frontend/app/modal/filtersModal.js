import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

/**
 * FiltersModal Component
 * 
 * Modal for filtering movies by:
 * - Genre
 * - Year
 * - Rating
 * - Sort order
 */
export default function FiltersModal({ visible, onClose, onApply, initialFilters = {} }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [expandedSection, setExpandedSection] = useState(null);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Documentary'];
  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  const ratingRanges = [
    { label: '4-5 Excellent', min: 4, max: 5.1 }, // I added .1 so 5 can be included
    { label: '3-4 Great', min: 3, max: 4.1 },
    { label: '2-3 Good', min: 2, max: 3.1 },
    { label: '1-2 Average', min: 1, max: 2.1 },
    { label: 'Below 1', min: 0, max: 1 },
  ];
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'highest_rated', label: 'Highest Rated' },
    { id: 'lowest_rated', label: 'Lowest Rated' },
    { id: 'title_asc', label: 'Title (A-Z)' },
    { id: 'title_desc', label: 'Title (Z-A)' },
  ];

  // Load initial filters when modal opens
  useEffect(() => {
    if (visible && initialFilters) {
      setSelectedGenres(initialFilters.genres || []);
      setSelectedYears(initialFilters.years || []);
      setSelectedRatings(initialFilters.ratings || []);
      setSelectedSort(initialFilters.sort || 'newest');
    }
  }, [visible, initialFilters]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleYear = (year) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating.label) 
        ? prev.filter(r => r !== rating.label)
        : [...prev, rating.label]
    );
  };

  const handleClearAll = () => {
    setSelectedGenres([]);
    setSelectedYears([]);
    setSelectedRatings([]);
    setSelectedSort('newest');
  };

  const handleApply = () => {
    const filters = {
      genres: selectedGenres,
      years: selectedYears,
      ratings: selectedRatings,
      ratingRanges: ratingRanges.filter(r => selectedRatings.includes(r.label)),
      sort: selectedSort,
    };
    onApply(filters);
  };

  const getActiveFiltersCount = () => {
    return selectedGenres.length + selectedYears.length + selectedRatings.length;
  };

  const GenreSection = () => {
    const isExpanded = expandedSection === 'Genre';
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('Genre')}
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Genre</Text>
            {selectedGenres.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{selectedGenres.length}</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={styles.option}
                onPress={() => toggleGenre(genre)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedGenres.includes(genre) && styles.checkboxSelected,
                  ]}
                >
                  {selectedGenres.includes(genre) && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.optionText}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const YearSection = () => {
    const isExpanded = expandedSection === 'Year';
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('Year')}
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Year</Text>
            {selectedYears.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{selectedYears.length}</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={styles.option}
                onPress={() => toggleYear(year)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedYears.includes(year) && styles.checkboxSelected,
                  ]}
                >
                  {selectedYears.includes(year) && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.optionText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const RatingSection = () => {
    const isExpanded = expandedSection === 'Rating';
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('Rating')}
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Rating</Text>
            {selectedRatings.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{selectedRatings.length}</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {ratingRanges.map((rating) => (
              <TouchableOpacity
                key={rating.label}
                style={styles.option}
                onPress={() => toggleRating(rating)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedRatings.includes(rating.label) && styles.checkboxSelected,
                  ]}
                >
                  {selectedRatings.includes(rating.label) && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.optionText}>{rating.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const SortSection = () => {
    const isExpanded = expandedSection === 'Sort';
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('Sort')}
        >
          <Text style={styles.sectionTitle}>Sort By</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => setSelectedSort(option.id)}
              >
                <View
                  style={[
                    styles.radio,
                    selectedSort === option.id && styles.radioSelected,
                  ]}
                >
                  {selectedSort === option.id && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Filters</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Filters List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <GenreSection />
            <YearSection />
            <RatingSection />
            <SortSection />
            
            {/* Bottom spacing */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#1A1A24',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },

  headerBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  clearText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },

  scrollView: {
    paddingHorizontal: 20,
  },

  // Section
  section: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A34',
    padding: 16,
    borderRadius: 12,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },

  badge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  optionsContainer: {
    marginTop: 12,
    gap: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: '#8B5CF6',
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },

  optionText: {
    fontSize: 15,
    color: '#fff',
  },

  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  applyButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});