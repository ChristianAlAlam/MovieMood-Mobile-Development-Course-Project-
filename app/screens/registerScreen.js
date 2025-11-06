import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Yup from 'yup';

import styles from '../styles/registerStyles.js';

// Import our reusable components
import BackButton from '../components/backButton.js';
import CustomButton from '../components/customButton.js';
import CustomInput from '../components/customInput.js';

import { registerUser } from '../services/authService.js';
/**
 * Validation Schema for Register Form
 * 
 * Defines the validation rules for all form fields using Yup.
 * - name: Required, minimum 2 characters
 * - email: Required, must be valid email format
 * - password: Required, minimum 6 characters, must contain uppercase, lowercase, and number
 * - confirmPassword: Required, must match password field
 */
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen({ navigation }) {
  
  /**
   * Handle Register Submission
   * 
   * This function is called when the form is submitted and validation passes.
   * 
   * @param {object} values - Form values (name, email, password, confirmPassword)
   * @param {object} actions - Formik actions (setSubmitting, resetForm, etc.)
   */
  const handleRegister = async (values, { setSubmitting }) => {
    try {
      // Call the register user function from authService.js
      const result = await registerUser(values);

      if(result.success){
        // Register successful! Navigate to Home Screen
        // Use reset to prevent going back to login screen
        navigation.navigate('HomeTab');
      }

      else{
        // Register Failed - show error message
        Alert.alert('Register Failed', result.message);
      }

      setSubmitting(false);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occures');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar - light content for dark background */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient - matches Landing Screen */}
      <LinearGradient
        colors={['#000000', '#090909']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        
        {/* KeyboardAvoidingView - prevents keyboard from covering inputs */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* ScrollView - allows scrolling when keyboard appears */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Allows tapping inputs when keyboard is open
          >
            {/* Back Button - navigates to previous screen */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Create account!</Text>
            </View>

            {/* Formik Form */}
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View style={styles.formContainer}>
                  
                  {/* Name Input */}
                  <CustomInput
                    label="FULL NAME"
                    icon="👤"
                    placeholder="John Doe"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={errors.name}
                    touched={touched.name}
                    autoCapitalize="words" // Capitalize each word
                  />

                  {/* Email Input */}
                  <CustomInput
                    label="EMAIL"
                    icon="✉️"
                    placeholder="your.email@example.com"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    keyboardType="email-address"
                  />

                  {/* Password Input */}
                  <CustomInput
                    label="PASSWORD"
                    icon="🔒"
                    placeholder="Create a strong password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={errors.password}
                    touched={touched.password}
                    showPasswordToggle={true} // Shows eye icon to toggle visibility
                  />

                  {/* Confirm Password Input */}
                  <CustomInput
                    label="CONFIRM PASSWORD"
                    icon="🔐"
                    placeholder="Re-enter your password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    showPasswordToggle={true}
                  />

                  {/* Register Button */}
                  <CustomButton
                    title="CREATE ACCOUNT"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    loadingText="CREATING ACCOUNT..."
                    variant="primary"
                  />

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Login Link */}
                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Login')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};