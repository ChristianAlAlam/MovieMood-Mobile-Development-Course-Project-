import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F3F',
  },

  gradient: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },

  spotlight: {
    position: 'absolute',
    top: -100,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(232, 244, 248, 0.08)',
    opacity: 0.6,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  subGreeting: {
    fontSize: 14,
    color: '#C0C0C0',
    letterSpacing: 0.5,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  moviesScrollView: {
    marginBottom: 20,
  },

  moviesScrollContent: {
    paddingHorizontal: 20,
  },

  bottomSpacer: {
    height: 20,
  },
});

export default styles;