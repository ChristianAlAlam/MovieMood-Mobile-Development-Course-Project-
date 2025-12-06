import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFill,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: '#fff',
    fontSize: 16,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Top Actions
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  topButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Side Actions
  sideActions: {
    flexDirection: 'column',
    gap: 15,
  },

  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  metaDot: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 8,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  descriptionContainer: {
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },

  moreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  floatingCard: {
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },

  completeButton: {
    marginTop: 20,
    paddingVertical: 20,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  completeButtonActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.35)',
    borderColor: '#4ECDC4',
    borderWidth: 1,
  },

  completeButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;