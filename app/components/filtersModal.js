import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
 * - Type (Movies, TV shows, Music videos, Gaming)
 * - Genre
 * - Year
 * - Country
 * - Rating
 * - Quality
 * - Sort order
 */
export default function FiltersModal({ visible, onClose, onApply }) {
  const [selectedType, setSelectedType] = useState('Movies');
  const [expandedSection, setExpandedSection] = useState('Type');

  const types = ['Movies', 'TV shows', 'Music videos', 'Gaming'];
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];
  const years = ['2023', '2022', '2021', '2020', '2019'];
  const countries = ['USA', 'UK', 'France', 'Japan', 'South Korea'];
  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const qualities = ['4K', '1080p', '720p', '480p'];
  const sortOptions = ['Most relevance', 'Newest', 'Oldest', 'Highest rated'];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleApply = () => {
    // Collect all selected filters
    const filters = {
      type: selectedType,
      // Add other filter states here
    };
    onApply(filters);
  };

  const FilterSection = ({ title, options, type = 'radio' }) => {
    const isExpanded = expandedSection === title;

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(title)}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  if (title === 'Type') setSelectedType(option);
                }}
              >
                <View
                  style={[
                    type === 'radio' ? styles.radio : styles.checkbox,
                    (title === 'Type' && selectedType === option) &&
                      styles.optionSelected,
                  ]}
                >
                  {title === 'Type' && selectedType === option && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
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
            <Text style={styles.title}>Filters</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Filters List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <FilterSection title="Type" options={types} type="radio" />
            <FilterSection title="Genre" options={genres} type="checkbox" />
            <FilterSection title="Year" options={years} type="checkbox" />
            <FilterSection title="Country" options={countries} type="checkbox" />
            <FilterSection title="Rating" options={ratings} type="checkbox" />
            <FilterSection title="Quality" options={qualities} type="checkbox" />
            <FilterSection title="Most relevance" options={sortOptions} type="radio" />
          </ScrollView>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={handleApply}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },

  optionsContainer: {
    marginTop: 12,
    gap: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  optionSelected: {
    borderColor: '#8B5CF6',
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },

  optionText: {
    fontSize: 15,
    color: '#fff',
  },

  // Done Button
  doneButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },

  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});