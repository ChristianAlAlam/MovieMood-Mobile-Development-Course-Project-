import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import EditMovieModal from "../modal/editMovieModal";
import {
  deleteMovie,
  getMovieById,
  toggleCompleted,
  toggleFavorite,
} from "../services/movieService";
import styles from "../styles/movieDetailsStyles";

export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId, movie: initialMovie } = route.params || {};
  const { width, height } = Dimensions.get("window");
  const [movie, setMovie] = useState(initialMovie || null);
  const [loading, setLoading] = useState(!initialMovie);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!initialMovie && movieId) {
      loadMovie();
    } else {
      setLoading(false);
    }
  }, [movieId]);

  const loadMovie = async () => {
    try {
      const movieData = await getMovieById(movieId);
      setMovie(movieData);
      setLoading(false);
    } catch (error) {
      console.error("Load movie error:", error);
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    const id = movieId || movie?.id;
    if (!id) return;

    console.log("Toggling favorite for movie:", id);

    const result = await toggleFavorite(id, movie.isFavorite);

    if (result.success) {
      setMovie((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    } else {
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const handleToggleCompleted = async () => {
    const id = movieId || movie?.id;

    if (!id) return;

    console.log("Toggling completed for movie:", id);

    const result = await toggleCompleted(id, movie.isCompleted);

    if (result.success) {
      const newStatus = !movie.isCompleted;
      setMovie((prev) => ({
        ...prev,
        isCompleted: newStatus,
        watchProgress: newStatus ? 1 : 0,
      }));
    } else {
      Alert.alert("Error", "Failed to updated completion status.");
    }
  };

  const handleDelete = () => {
    const id = movieId || movie?.id;
    if (!id) {
      Alert.alert("Error", "Movie ID not found");
      return;
    }

    Alert.alert("Delete Movie", "Are you sure you want to delete this movie?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await deleteMovie(id);
            console.log("Delete result:", result);

            if (result.success) {
              Alert.alert("Deleted", "Movie was deleted successfully.");
              navigation.goBack();
            } else {
              Alert.alert("Error", result.message || "Failed to delete movie.");
            }
          } catch (error) {
            console.error("Error deleting movie:", error);
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    setSelectedMovie(movie); // Pass the current movie
    setEditVisible(true); // Show the modal
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const renderDescription = () => {
    if (!movie.comment) return null;

    const maxLength = 150;
    const needsTruncation = movie.comment.length > maxLength;
    const displayText =
      showFullDescription || !needsTruncation
        ? movie.comment
        : movie.comment.substring(0, maxLength) + "...";

    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {displayText}
          {needsTruncation && (
            <Text
              style={styles.moreText}
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              {" "}
              {showFullDescription ? "less" : "more"}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="default"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground
        source={{ uri: movie.poster }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeContent} edges={["top", "bottom"]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Actions - Back and Side Buttons Row */}
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>

              {/* Side Buttons */}
              <View style={styles.sideActions}>
                <TouchableOpacity
                  style={styles.sideButton}
                  onPress={handleToggleFavorite}
                >
                  <BlurView
                    intensity={35}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons
                    name={movie.isFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color={movie.isFavorite ? "#FF6B9D" : "#fff"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sideButton}
                  onPress={handleDelete}
                >
                  <BlurView
                    intensity={35}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sideButton}
                  onPress={handleEdit}
                >
                  <BlurView
                    intensity={35}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons name="pencil-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Spacer to push floating card to bottom */}
            <View style={{ flex: 1, minHeight: height * 0.4 }} />

            {/* ✅ FLOATING GLASS CARD */}
            <View style={styles.floatingCard}>
              <BlurView
                intensity={35}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.title}>{movie.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{movie.genre}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{movie.year}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{movie.duration}</Text>
              </View>

              <View style={styles.ratingRow}>
                {renderStars(movie.rating)}
                <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
              </View>

              {renderDescription()}

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  movie.isCompleted && styles.completeButtonActive,
                ]}
                onPress={handleToggleCompleted}
              >
                <Text style={styles.completeButtonText}>
                  {movie.isCompleted ? "Completed ✓" : "Mark as Completed"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

      <EditMovieModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        movie={selectedMovie}
        onSuccess={(updatedMovie) => {
          // Update the movie state in the details screen
          setMovie(updatedMovie);
          // Optionally, if you have a list in the previous screen, you can pass back params or refresh
        }}
      />
    </View>
  );
}
