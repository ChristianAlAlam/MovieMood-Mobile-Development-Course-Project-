import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "../services/authService";

/**
 * Header Component
 *
 * Unified elegant header used across screens.
 * Includes:
 * - Avatar (left)
 * - Screen title & optional icon
 * - Item count (right)
 */
const Header = ({
  title,
  ionIconName,
  materialCommunityIconName,
  iconColor,
  itemCount,
  onProfilePress,
  isHome,
}) => {
  const [user, setUser] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (error) {
      console.error("Load Current User error:", error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Left: Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#C0C0C0" />
          </View>
        )}
      </TouchableOpacity>

      {/* Center: Icon + Title */}
      <View style={styles.centerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Right: Movie Count */}
      {isHome ? (
        <Text style={styles.headerCount}> </Text>
      ) : (
        <Text style={styles.headerCount}>{itemCount} movies</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },

  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(27, 47, 79, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  centerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },

  headerCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
});

export default Header;
