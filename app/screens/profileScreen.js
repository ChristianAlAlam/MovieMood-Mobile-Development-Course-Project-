import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import styles
import styles from '../styles/profileStyles';

// Import auth service
import { getCurrentUser, logoutUser, updateUserProfile } from '../services/authService';

/**
 * ProfileScreen - User profile management
 * 
 * Features:
 * - View user information
 * - Edit name
 * - Change avatar (using ImagePicker)
 * - View stats
 * - Logout
 * 
 * @param {object} navigation - React Navigation object
 */
export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Load current user data
   */
  const loadUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setEditedName(userData?.name || '');
      setLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      setLoading(false);
    }
  };

  /**
   * Pick image from gallery
   */
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to change your avatar!'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled) {
        // Update avatar
        await handleUpdateProfile({ avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  /**
   * Take photo with camera
   */
  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera permissions to take a photo!'
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Update avatar
        await handleUpdateProfile({ avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  /**
   * Show avatar options
   */
  const showAvatarOptions = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  /**
   * Update user profile
   */
  const handleUpdateProfile = async (updates) => {
    setSaving(true);
    try {
      const result = await updateUserProfile(updates);
      
      if (result.success) {
        setUser(result.user);
        Alert.alert('Success', 'Profile updated successfully!');
        setEditMode(false);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
    setSaving(false);
  };

  /**
   * Save name changes
   */
  const handleSaveName = async () => {
    if (editedName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Name must be at least 2 characters');
      return;
    }
    await handleUpdateProfile({ name: editedName });
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditMode(false);
  };

  /**
   * Logout user
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            // Reset navigation to Landing screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            });
          },
        },
      ]
    );
  };

  // Show loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24', '#0A0A0F']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        {/* Spotlight Effect */}
        <View style={styles.spotlight} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={showAvatarOptions}
              activeOpacity={0.8}
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={60} color="#C0C0C0" />
                </View>
              )}
              
              {/* Camera Icon Overlay */}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#0B1F3F" />
              </View>
            </TouchableOpacity>

            <Text style={styles.avatarHint}>Tap to change avatar</Text>
          </View>

          {/* User Info Section */}
          <View style={styles.infoSection}>
            {/* Name Field */}
            <View style={styles.infoCard}>
              <Text style={styles.label}>NAME</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(192, 192, 192, 0.4)"
                  autoFocus
                />
              ) : (
                <Text style={styles.value}>{user?.name}</Text>
              )}
            </View>

            {/* Email Field (Read-only) */}
            <View style={styles.infoCard}>
              <Text style={styles.label}>EMAIL</Text>
              <Text style={styles.value}>{user?.email}</Text>
              <Text style={styles.hint}>Email cannot be changed</Text>
            </View>

            {/* Member Since */}
            <View style={styles.infoCard}>
              <Text style={styles.label}>MEMBER SINCE</Text>
              <Text style={styles.value}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {editMode ? (
              <>
                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveName}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4ECDC4', '#44A08D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Save Changes</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Edit Button */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditMode(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#C0C0C0', '#D4AF37', '#C0C0C0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="create-outline" size={24} color="#0B1F3F" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.8}
                >
                  <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Bottom Spacing for Tab Bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}