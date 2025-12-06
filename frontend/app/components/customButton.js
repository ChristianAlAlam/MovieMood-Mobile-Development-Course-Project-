import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * CustomButton Component
 * 
 * A reusable button component with gradient background and shadow effects.
 * Matches the luxury MovieMood aesthetic.
 * 
 * Props:
 * @param {string} title - The text to display on the button
 * @param {function} onPress - Function to call when button is pressed
 * @param {boolean} disabled - If true, button is disabled and shows loading state
 * @param {string} loadingText - Text to show when disabled (e.g., "SIGNING IN...")
 * @param {string} variant - Button style variant: 'primary' or 'secondary'
 * @param {object} style - Additional custom styles (optional)
 */
const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loadingText = 'LOADING...',
}) => {
  
  return (
    <TouchableOpacity
      activeOpacity={0.8} // Dims to 80% when pressed
      onPress={onPress}
      disabled={disabled} // Prevents press when disabled
      style={styles.buttonWrapper} // Merge custom styles
    >
        {/*Button*/}
        <View style={styles.button}>
          {/* Button Text */}
        <Text style={styles.buttonText}>
          {disabled ? loadingText : title}
        </Text>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Wrapper around button - provides shadow effect
  buttonWrapper: {
    width: '100%',
    shadowColor: '#FFFFFF', // Gold shadow
    shadowOffset: { width: 0, height: 10 }, // Shadow below button
    shadowOpacity: 0.4,
    shadowRadius: 20, // Soft, diffused shadow
    elevation: 10, // Android shadow
  },

  // The actual button with gradient
  button: {
    height: 56, // Comfortable touch target
    borderRadius: 25, // Half of height = pill shape
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Button text styling
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 1.5, // Wide spacing for luxury feel
  },
});

export default CustomButton;