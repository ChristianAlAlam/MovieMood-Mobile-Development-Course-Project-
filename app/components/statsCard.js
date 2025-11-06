import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';

/**
 * StatsCard Component
 * 
 * Displays a statistic with icon, value, and label
 * 
 * @param {string} icon - Emoji icon to display
 * @param {string|number} value - The stat value
 * @param {string} label - Label describing the stat
 * @param {string} color - Accent color for the icon (optional)
 */
const StatsCard = ({ icon, value, label, color = '#D4AF37' }) => {
  return (
    <BlurView intensity={30} style={styles.container}>
      <View style={styles.content}>
        {/* Icon with colored background */}
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Value */}
        <Text style={styles.value}>{value}</Text>

        {/* Label */}
        <Text style={styles.label}>{label}</Text>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(27, 47, 79, 0.5)',
    marginHorizontal: 5,
  },

  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    fontSize: 28,
  },

  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    color: '#C0C0C0',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default StatsCard;