import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
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
    paddingTop: 10,
    paddingBottom: 15,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },

  headerCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
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

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Movie Card
  movieCard: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },

  moviePoster: {
    width: '100%',
    height: '100%',
  },

  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
  },

  movieInfo: {
    padding: 16,
  },

  timeLeft: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },

  movieTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  metaDot: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 6,
  },

  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#D4AF37',
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
});

export default styles;