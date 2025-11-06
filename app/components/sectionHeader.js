import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * SectionHeader Component
 * 
 * Displays a section title with optional "See All" button
 * 
 * @param {string} title - Section title
 * @param {string} icon - Emoji icon (optional)
 * @param {function} onSeeAll - Callback for "See All" button (optional)
 */
const SectionHeader = ({ title, icon, onSeeAll }) => {
  return (
    <View style={styles.container}>
      {/* Left Side - Title with Icon */}
      <View style={styles.titleContainer}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right Side - See All Button */}
      {onSeeAll && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="arrow-forward" size={16} color="#D4AF37" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  icon: {
    fontSize: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  seeAllText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
  },
});

export default SectionHeader;