import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
/**
 * BackButton Component
 * 
 * A reusable back button with arrow and text.
 * Used for navigation to go back to previous screen.
 * 
 * Props:
 * @param {function} onPress - Function to call when button is pressed (usually navigation.goBack())
 * @param {string} text - Text to display next to arrow (default: "Back")
 */
const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7} // Slight opacity change on press
    >
      {/* Arrow Icon */}
      <Ionicons name="chevron-back" size={26} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Container - horizontal layout
  container: {
    flexDirection: 'row', // Arrow and text side by side
    alignItems: 'center',
    marginBottom: 30, // Space below back button
  },

  // Arrow styling
  arrow: {
    fontSize: 28,
    color: '#FFFFFF', // Silver
    marginRight: 8, // Space between arrow and text
  },
});

export default BackButton;