import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Header Component
 * 
 * Displays user info and actions at the top of the screen
 * 
 * @param {string} userName - User's name for greeting
 * @param {string} userAvatar - URI of user's avatar image
 * @param {function} onProfilePress - Callback when profile is pressed
 * @param {function} onNotificationPress - Callback for notifications (optional)
 * @param {function} onSettingsPress - Callback for settings (optional)
 */
const Header = ({
  userName,
  userAvatar,
  onProfilePress,
  onNotificationPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Side - Profile Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#C0C0C0" />
          </View>
        )}
      </TouchableOpacity>

      {/* Center - App Logo/Title */}
      <View style={styles.centerContainer}>
        <Text style={styles.appTitle}>MovieMood</Text>
      </View>

      {/* Right Side - Action Icons */}
      <View style={styles.actionsContainer}>
        {/* Notification Icon (Optional) */}
        {onNotificationPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#C0C0C0" />
            {/* Notification Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Settings Icon (Optional) */}
        {onSettingsPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },

  // Avatar Section
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(27, 47, 79, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Center Section
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },

  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#C0C0C0',
    letterSpacing: 2,
  },

  // Actions Section
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Notification Badge
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;