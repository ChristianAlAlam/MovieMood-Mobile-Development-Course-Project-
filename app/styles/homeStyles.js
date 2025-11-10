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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  profileAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section
  section: {
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Horizontal Scroll
  horizontalScrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },

  // Trending Card
  trendingCard: {
    width: 140,
    marginRight: 12,
    position: 'relative',
  },

  trendingPoster: {
    width: '100%',
    height: 210,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Continue Watching Card
  continueWatchingCard: {
    width: 360,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },

  continueWatchingPoster: {
    width: '100%',
    height: 200,
  },

  continueWatchingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
  },

  continueWatchingInfo: {
    padding: 16,
  },

  continueTimeLeft: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },

  continueTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Progress Bar
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

  // Bottom Spacing
  bottomSpacer: {
    height: 30,
  },
});

export default styles;