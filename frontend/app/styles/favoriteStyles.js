import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const CARD_WIDTH = (width - 60) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#0A0A0F',
  },

  gradient: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    marginBottom: 5,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
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

  // Grid
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  // Movie Card
  movieCard: {
    width: CARD_WIDTH,
    position: 'relative',
  },

  moviePoster: {
    width: '100%',
    height: CARD_WIDTH * 1.5, // 2:3 aspect ratio
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  movieInfo: {
    marginTop: 8,
  },

  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Empty State
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
    marginBottom: 30,
  },

  emptyButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
});

export default styles;