import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
    ...StyleSheet.absoluteFill
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },

  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Movies List
  moviesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  movieCard: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 12,
  },

  moviePoster: {
    width: 100,
    height: 140,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  movieTitleRow: {
    flex: 1,
  },

  movieYear: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },

  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  ratingText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },

  movieCardGrid: {
  width: '48%',
  marginBottom: 16,
},

movieCardList: {
  width: '100%',
  flexDirection: 'row',
  marginBottom: 16,
  alignItems: 'center',
},

posterGrid: {
  width: '100%',
  height: 200,
  borderRadius: 12,
},

posterList: {
  width: 120,
  height: 180,
  borderRadius: 12,
  marginRight: 12,
},

// Update searchBar to have icons
searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 25,
  paddingHorizontal: 15,
  paddingVertical: 12,
  gap: 10,
},

searchInput: {
  flex: 1,
  fontSize: 15,
  color: '#fff',
},

// Add empty state styles
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 100,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: '#fff',
  marginTop: 20,
  marginBottom: 8,
},

emptySubtitle: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.6)',
  textAlign: 'center',
},
});

export default styles;