import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/settingsStyles';

import { deleteUserAccount } from '../services/authService';

const APP_VERSION = '1.0.0';

export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can implement theme switching logic here
    // For now, it just toggles the state
    Alert.alert(
      'Theme Changed',
      `Switched to ${!isDarkMode ? 'Dark' : 'Light'} mode`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'This is your last chance. Type "DELETE" to confirm account deletion.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Understand',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteUserAccount();
              if (result.success) {
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Landing' }],
                });
              } else {
                Alert.alert('Error', result.message || 'Failed to delete account');
              }
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Error', 'An error occurred while deleting your account');
            }
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@movietracker.com?subject=Support Request');
  };

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingsItem = ({ icon, title, onPress, rightComponent, destructive }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? '#FF4757' : '#fff'}
        />
        <Text style={[styles.settingsItemText, destructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const InfoModal = ({ visible, onClose, title, content }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent={true} />
      <LinearGradient
        colors={['#0A0A0F', '#1A1A24']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance Section */}
          <SettingsSection title="APPEARANCE">
            <SettingsItem
              icon="moon-outline"
              title="Dark Mode"
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: '#8B5CF6' }}
                  thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                />
              }
            />
          </SettingsSection>

          {/* App Info Section */}
          <SettingsSection title="APP INFO">
            <SettingsItem
              icon="information-circle-outline"
              title="About"
              onPress={() => setAboutModalVisible(true)}
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color="#888" />
              }
            />
            <SettingsItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => setPrivacyModalVisible(true)}
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color="#888" />
              }
            />
            <SettingsItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => setTermsModalVisible(true)}
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color="#888" />
              }
            />
            <SettingsItem
              icon="code-outline"
              title="Version"
              rightComponent={
                <Text style={styles.versionText}>{APP_VERSION}</Text>
              }
            />
          </SettingsSection>

          {/* Support Section */}
          <SettingsSection title="SUPPORT">
            <SettingsItem
              icon="mail-outline"
              title="Contact Support"
              onPress={handleContactSupport}
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color="#888" />
              }
            />
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection title="DANGER ZONE">
            <SettingsItem
              icon="trash-outline"
              title="Delete Account"
              onPress={handleDeleteAccount}
              destructive
              rightComponent={
                <Ionicons name="chevron-forward" size={20} color="#FF4757" />
              }
            />
          </SettingsSection>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>MovieMood</Text>
            <Text style={styles.footerSubtext}>Made with <Ionicons name="heart" size={20} color="#FF6B9D"/> for movie lovers</Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* About Modal */}
      <InfoModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
        title="About Movie Tracker"
        content={
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              MovieMood is your personal movie management companion. Keep track of movies you want to watch, mark your favorites, and never forget what you've watched.
            </Text>
            <Text style={styles.modalText}>
              Features include:
            </Text>
            <Text style={styles.bulletPoint}>• Create and manage your watchlist</Text>
            <Text style={styles.bulletPoint}>• Mark movies as favorites</Text>
            <Text style={styles.bulletPoint}>• Track your watching progress</Text>
            <Text style={styles.bulletPoint}>• Search and filter your collection</Text>
            <Text style={styles.bulletPoint}>• Beautiful, intuitive interface</Text>
            <Text style={[styles.modalText, { marginTop: 20 }]}>
              Version {APP_VERSION}
            </Text>
            <Text style={styles.modalText}>
              © 2025 MovieMood. All rights reserved.
            </Text>
          </View>
        }
      />

      {/* Privacy Policy Modal */}
      <InfoModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        title="Privacy Policy"
        content={
          <View style={styles.modalBody}>
            <Text style={styles.modalHeading}>Last Updated: November 2025</Text>
            
            <Text style={styles.modalSubheading}>1. Information We Collect</Text>
            <Text style={styles.modalText}>
              We collect information you provide directly to us, including your name, email address, and movie preferences.
            </Text>

            <Text style={styles.modalSubheading}>2. How We Use Your Information</Text>
            <Text style={styles.modalText}>
              We use the information we collect to provide, maintain, and improve our services, including to personalize your experience.
            </Text>

            <Text style={styles.modalSubheading}>3. Data Storage</Text>
            <Text style={styles.modalText}>
              Your data is stored securely on your device using AsyncStorage. We do not transmit your personal movie data to external servers.
            </Text>

            <Text style={styles.modalSubheading}>4. Your Rights</Text>
            <Text style={styles.modalText}>
              You have the right to access, update, or delete your personal information at any time through the app settings.
            </Text>

            <Text style={styles.modalSubheading}>5. Contact Us</Text>
            <Text style={styles.modalText}>
              If you have any questions about this Privacy Policy, please contact us at support@movietracker.com
            </Text>
          </View>
        }
      />

      {/* Terms of Service Modal */}
      <InfoModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        title="Terms of Service"
        content={
          <View style={styles.modalBody}>
            <Text style={styles.modalHeading}>Last Updated: November 2025</Text>

            <Text style={styles.modalSubheading}>1. Acceptance of Terms</Text>
            <Text style={styles.modalText}>
              By accessing and using Movie Tracker, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>

            <Text style={styles.modalSubheading}>2. Use License</Text>
            <Text style={styles.modalText}>
              Permission is granted to use Movie Tracker for personal, non-commercial purposes.
            </Text>

            <Text style={styles.modalSubheading}>3. User Account</Text>
            <Text style={styles.modalText}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </Text>

            <Text style={styles.modalSubheading}>4. Content</Text>
            <Text style={styles.modalText}>
              You retain all rights to the content you add to your watchlist. However, you grant us the right to store and process this data to provide the service.
            </Text>

            <Text style={styles.modalSubheading}>5. Termination</Text>
            <Text style={styles.modalText}>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </Text>

            <Text style={styles.modalSubheading}>6. Changes to Terms</Text>
            <Text style={styles.modalText}>
              We reserve the right to modify or replace these Terms at any time. Continued use of the app after changes constitutes acceptance of the new Terms.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}