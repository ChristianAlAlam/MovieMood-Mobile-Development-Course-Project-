import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F3F',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B1F3F',
    justifyContent: 'center',
    alignItems: 'center',
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

  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#D4AF37',
    position: 'relative',
  },

  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(27, 47, 79, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0B1F3F',
  },

  avatarHint: {
    marginTop: 10,
    fontSize: 12,
    color: '#C0C0C0',
    fontStyle: 'italic',
  },

  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  infoCard: {
    backgroundColor: 'rgba(27, 47, 79, 0.5)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.2)',
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 8,
  },

  value: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
  },

  input: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    paddingBottom: 5,
  },

  hint: {
    fontSize: 11,
    color: '#C0C0C0',
    marginTop: 5,
    fontStyle: 'italic',
  },

  actionsSection: {
    paddingHorizontal: 20,
  },

  editButton: {
    marginBottom: 15,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  saveButton: {
    marginBottom: 15,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  buttonGradient: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1F3F',
    letterSpacing: 1,
  },

  cancelButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.3)',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C0C0C0',
    letterSpacing: 1,
  },

  logoutButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },

  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6B6B',
    letterSpacing: 1,
  },

  bottomSpacer: {
    height: 20,
  },
});

export default styles;