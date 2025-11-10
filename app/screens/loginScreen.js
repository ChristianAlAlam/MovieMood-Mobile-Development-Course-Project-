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

// Import our reusable components
import BackButton from '../components/backButton';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import { loginUser } from '../services/authService';

import styles from '../styles/loginStyles.js';
/**
 * Validation Schema for Login Form
 * 
 * Defines the validation rules using Yup:
 * - email: Must be valid email format and required
 * - password: Minimum 6 characters and required
 */
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen ({ navigation }) {

  /**
   * Handle Login Submission
   * 
   * Called when form is submitted and validation passes.
   * 
   * @param {object} values - Contains { email, password }
   * @param {object} actions - Formik actions like setSubmitting
   */
  const handleLogin = async (values, { setSubmitting }) => {
    console.log("🔵 Login button clicked");
    try {
      console.log("🟢 Email:", values.email);
      console.log("🟢 Password:", values.password);
      // Call the loginUser function from authService.js
      const result = await loginUser(values);
      console.log("🟣 Login result:", result);
      if(result.success) {
        // Login successful! Navigate to Home Screen
        // Use reset to prevent going back to login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeTab' }],
        });
      }

      
      else{
        // Login failed - show error message
        Alert.alert('Login Failed', result.message);
      }

      setSubmitting(false);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occured');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar - light text on dark background */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient - Navy theme */}
      <LinearGradient
        colors={['#000000', '#090909']}
        locations={[0, 1]}
        style={styles.gradient}
      >
        
        {/* KeyboardAvoidingView - moves content up when keyboard appears */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* ScrollView - allows scrolling when needed */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button - returns to Landing Screen */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
            </View>

            {/* Formik Form - handles form state and validation */}
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
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
                  
                  {/* Email Input - using reusable CustomInput component */}
                  <CustomInput
                    //label="EMAIL"
                    placeholder="your.email@example.com"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    keyboardType="email-address"
                  />

                  {/* Password Input - with show/hide toggle */}
                  <CustomInput
                    //label="PASSWORD"
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={errors.password}
                    touched={touched.password}
                    showPasswordToggle={true}
                  />

                  {/* Login Button - using reusable CustomButton component */}
                  <CustomButton
                    title="SIGN IN"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    loadingText="SIGNING IN..."
                  />

                  {/* Forgot Password Link */}
                  <TouchableOpacity
                    style={styles.forgotButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Divider - "OR" separator */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Register Link - navigates to Register Screen */}
                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Register')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.registerLink}>Create Account</Text>
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