import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/header";
import { getCurrentUser } from "../services/authService";
import { getFavoriteMovies, getMovies } from "../services/movieService";
import styles from "../styles/homeStyles";
import { calculateTimeLeft } from "../utils/timeUtils";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadAllMovies = async () => {
    try {
      const movie = await getMovies();
      setMovies(movie);
    } catch (error) {
      console.log("Load Movies error", error);
    }
  };

  const loadAllFavorite = async () => {
    try {
      const movie = await getFavoriteMovies();
      setFavorites(movie);
    } catch (error) {
      console.log("Load Favorite error", error);
    }
  };

  const loadInProgressMovies = async () => {
    try {
      const movie = await getMovies();
      const inProgress = movie.filter((m) => m && !m.isCompleted);
      setContinueWatching(inProgress);
    } catch (error) {
      console.log("Load In Progress error", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await loadAllMovies();
    await loadAllFavorite();
    await loadInProgressMovies();
    setRefreshing(false);
  };

  const handleMoviePress = (movie) => {
    navigation.navigate("MovieDetails", { movie });
  };

  const renderSection = (
    title,
    data,
    emptyMessage,
    navigateScreen,
    cardStyle,
    posterStyle
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(navigateScreen)}>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <Text style={{ color: "gray", textAlign: "center", marginTop: 10 }}>
          {emptyMessage}
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {data.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={cardStyle}
              onPress={() => handleMoviePress(movie)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: movie.poster }}
                style={posterStyle}
                resizeMode="cover"
              />

              {title === "Continue watching" && (
                <>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.9)"]}
                    style={styles.continueWatchingOverlay}
                  >
                    <View style={styles.continueWatchingInfo}>
                      <Text style={styles.continueTimeLeft}>
                        {calculateTimeLeft(
                          movie.duration,
                          movie.watchProgress || 0
                        )}
                      </Text>
                      <Text style={styles.continueTitle} numberOfLines={1}>
                        {movie.title}
                      </Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${(movie.watchProgress || 0) * 100}%` },
                      ]}
                    />
                  </View>
                </>
              )}

              {title !== "Continue watching" && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{movie.rating || 0}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <LinearGradient colors={["#0A0A0F", "#1A1A24"]} style={styles.gradient}>
      <StatusBar
        barStyle="default"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4AF37"
            />
          }
        >
          <Header
            mode="simple"
            title="Home"
            iconName="home"
            iconColor="#FFFFFF"
            isHome={true}
            onProfilePress={() => navigation.navigate("Profile")}
          />

          {renderSection(
            "Your Favorites",
            favorites,
            "No favorite movies yet ❤️",
            "Favorite",
            styles.trendingCard,
            styles.trendingPoster
          )}

          {renderSection(
            "Continue watching",
            continueWatching,
            "No movies in progress yet 🎬",
            "Continue",
            styles.continueWatchingCard,
            styles.continueWatchingPoster
          )}

          {renderSection(
            "Your Watchlist",
            movies,
            "No movies yet 🎬",
            "Watchlist",
            styles.trendingCard,
            styles.trendingPoster
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
