import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/continueWatchingStyles";

import Header from "../components/header";
import FiltersModal from "../modal/filtersModal";
import { applySearchAndFilters } from "../services/filterService";
import { getMovies } from "../services/movieService";
import { calculateTimeLeft } from "../utils/timeUtils";

export default function ContinueWatchingScreen({ navigation }) {
  const [allInProgress, setAllInProgress] = useState([]);
  const [filteredContinueWatching, setFilteredContinueWatching] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    years: [],
    ratings: [],
    ratingRanges: [],
    sort: "newest",
  });

  useEffect(() => {
    loadInProgressMovies();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadInProgressMovies();
    });
    return unsubscribe;
  }, [navigation]);

  const loadInProgressMovies = async () => {
    try {
      const allMovies = await getMovies();
      const inProgress = allMovies.filter((m) => !m.isCompleted);
      setAllInProgress(inProgress);
      applyFiltersToMovies(inProgress, searchQuery, activeFilters);
      setLoading(false);
    } catch (error) {
      console.error("Load in progress movies error:", error);
      setLoading(false);
    }
  };

  const applyFiltersToMovies = (movies, search, filters) => {
    const result = applySearchAndFilters(movies, search, filters);
    setFilteredContinueWatching(result);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInProgressMovies();
    setSearchQuery("");
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFiltersToMovies(allInProgress, query, activeFilters);
  };

  const handleFiltersApply = (filters) => {
    setActiveFilters(filters);
    applyFiltersToMovies(allInProgress, searchQuery, filters);
    setFiltersVisible(false);
  };

  const getActiveFiltersCount = () => {
    return (
      activeFilters.genres.length +
      activeFilters.years.length +
      activeFilters.ratings.length
    );
  };

  const handleMoviePress = (movie) => {
    navigation.navigate("MovieDetails", { movie });
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.movieGradient}
      >
        <View style={styles.movieInfo}>
          {item.watchProgress > 0 && (
            <Text style={styles.timeLeft}>
              {calculateTimeLeft(item.duration, item.watchProgress)}
            </Text>
          )}
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.year}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.genre}</Text>
          </View>
        </View>
      </LinearGradient>

      {item.watchProgress > 0 && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${item.watchProgress * 100}%` },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {searchQuery || getActiveFiltersCount() > 0 ? (
        <>
          <Ionicons
            name="search-outline"
            size={80}
            color="rgba(255, 255, 255, 0.3)"
          />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters or search terms
          </Text>
          {getActiveFiltersCount() > 0 && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                setActiveFilters({
                  genres: [],
                  years: [],
                  ratings: [],
                  ratingRanges: [],
                  sort: "newest",
                });
                setSearchQuery("");
                applyFiltersToMovies(allInProgress, "", {
                  genres: [],
                  years: [],
                  ratings: [],
                  ratingRanges: [],
                  sort: "newest",
                });
              }}
            >
              <Text style={styles.emptyButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Ionicons
            name="checkmark-circle-outline"
            size={80}
            color="rgba(255, 255, 255, 0.3)"
          />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            You've completed all your movies
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("Watchlist")}
          >
            <Text style={styles.emptyButtonText}>Add More Movies</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle="default"
        backgroundColor="transparent"
        translucent={true}
      />

      <LinearGradient colors={["#0A0A0F", "#1A1A24"]} style={styles.gradient}>
        <Header
          title="Continue Watching"
          materialCommunityIconName="movie-filter-outline"
          iconColor="#FFFFFF"
          itemCount={filteredContinueWatching.length}
          onProfilePress={() => navigation.navigate("Profile")}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search incomplete movies..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Header with Title and Actions */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Ongoing List</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  getActiveFiltersCount() > 0 && styles.iconButtonActive,
                ]}
                onPress={() => setFiltersVisible(true)}
              >
                <Ionicons name="options-outline" size={22} color="#fff" />
                {getActiveFiltersCount() > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {getActiveFiltersCount()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Movies List */}
        <FlatList
          data={filteredContinueWatching}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading && renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4AF37"
            />
          }
        />
      </LinearGradient>

      {/* Filters Modal */}
      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={handleFiltersApply}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}
