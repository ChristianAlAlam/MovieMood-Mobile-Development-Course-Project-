import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
/**
 * CustomInput Component
 * 
 * A reusable input field component with label, icon, and validation error display.
 * Matches the luxury MovieMood aesthetic with Navy/Silver/Gold colors.
 * 
 * Props:
 * @param {string} label - The label text above the input (e.g., "EMAIL")
 * @param {string} icon - Emoji icon to display on the left (e.g., "✉️")
 * @param {string} placeholder - Placeholder text inside the input
 * @param {string} value - Current value of the input (controlled by Formik)
 * @param {function} onChangeText - Function to call when text changes (Formik's handleChange)
 * @param {function} onBlur - Function to call when input loses focus (Formik's handleBlur)
 * @param {string} error - Error message to display (from Formik validation)
 * @param {boolean} touched - Whether the field has been touched (from Formik)
 * @param {boolean} secureTextEntry - If true, hides text (for passwords)
 * @param {string} keyboardType - Type of keyboard to show (e.g., 'email-address', 'default')
 * @param {string} autoCapitalize - Controls auto-capitalization ('none', 'sentences', etc.)
 * @param {boolean} showPasswordToggle - If true, shows eye icon to toggle password visibility
 */
const CustomInput = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  showPasswordToggle = false,
}) => {
  // State to control password visibility (only used if showPasswordToggle is true)
  const [showPassword, setShowPassword] = useState(false);
  // Determine if we should show the error message
  // Only show error if: field has been touched AND there is an error
  const showError = touched && error;

  return (
    <View style={styles.container}>
      {/* Label - displays above the input */}
      {/* <Text style={styles.label}>{label}</Text> */}

      {/* Input Wrapper - contains icon, input, and optional eye button */}
      <View style={[
        styles.inputWrapper,
        showError && styles.inputError // Add red border if there's an error
      ]}>
        {/* Text Input - the actual input field */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={showPasswordToggle ? !showPassword : false} 
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />

        {/* Password Toggle Button - only shows if showPasswordToggle is true */}
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color={showPassword ? '#FFFFFF' : '#7d7d7dff'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message - only displays if there's an error and field was touched */}
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container for the entire input component
  container: {
    marginBottom: 24, // Space between multiple inputs
  },

  // Label styling - small gold text above input
  label: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto-SemiBold',
    color: '#FFFFFF', // Gold
    letterSpacing: 2, // Wide spacing for luxury feel
    marginBottom: 10,
  },

  // Wrapper around the input field (contains icon + input + eye button)
  inputWrapper: {
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center',
    backgroundColor: 'transparent', // Semi-transparent navy
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF', // Silver border
    paddingHorizontal: 16,
    height: 56, // Comfortable height for input
  },

  // Red border when there's a validation error
  inputError: {
    borderColor: 'rgba(255, 100, 100, 0.6)', // Red with some transparency
  },

  // The actual text input field
  input: {
    flex: 1, // Take up remaining space
    color: '#FFFFFF', // White text
    fontSize: 15,
    fontWeight: '400',
  },

  // Error message text
  errorText: {
    color: '#FF6B6B', // Red color for errors
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
});

export default CustomInput;