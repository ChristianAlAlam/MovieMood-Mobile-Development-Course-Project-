import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradient: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  topBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 15,
},
topBarTitle: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},

profileCenter: {
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 30,
},
profileAvatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
},
profileAvatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
},
editText: {
  color: '#C0C0C0',
  marginTop: 8,
  marginBottom: 2,
},
profileName: {
  color: '#fff',
  fontSize: 18,
  marginBottom: 15,
},
addProfileBtn: {
  paddingVertical: 8,
  paddingHorizontal: 20,
  borderRadius: 20,
  borderColor: '#fff',
  borderWidth: 1,
},
addProfileText: {
  color: '#fff',
  fontSize: 14,
},

menuList: {
  marginTop: 10,
  paddingHorizontal: 20,
},
menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 18,
  borderBottomColor: 'rgba(255,255,255,0.1)',
  borderBottomWidth: 1,
},
menuText: {
  flex: 1,
  marginLeft: 15,
  color: '#fff',
  fontSize: 15,
},
menuRightText: {
  color: '#a18cd1',
  marginRight: 10,
  fontSize: 14,
},

// Add these to your existing profileStyles.js

// Edit Modal
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  justifyContent: 'flex-end',
},

modalContent: {
  backgroundColor: '#1A1A24',
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  padding: 20,
  maxHeight: '80%',
},

modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 30,
},

modalTitle: {
  fontSize: 24,
  fontWeight: '600',
  color: '#fff',
},

modalAvatarSection: {
  alignItems: 'center',
  marginBottom: 30,
},

modalAvatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginBottom: 12,
},

modalAvatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
},

changePhotoText: {
  fontSize: 14,
  color: '#8B5CF6',
  fontWeight: '500',
},

inputGroup: {
  marginBottom: 20,
},

inputLabel: {
  fontSize: 11,
  fontWeight: '600',
  color: '#FFFFFF',
  letterSpacing: 2,
  marginBottom: 8,
},

input: {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  padding: 15,
  fontSize: 16,
  color: '#fff',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',
},

inputReadOnly: {
  fontSize: 16,
  color: 'rgba(255, 255, 255, 0.6)',
  padding: 15,
},

inputHint: {
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.4)',
  marginTop: 6,
  fontStyle: 'italic',
},

saveButton: {
  backgroundColor: '#fff',
  paddingVertical: 16,
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 20,
},

saveButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
},

});

export default styles;