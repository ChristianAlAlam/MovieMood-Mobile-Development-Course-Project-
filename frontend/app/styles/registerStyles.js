import { Dimensions, StyleSheet } from "react-native";

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    // backgroundColor: '#0B1F3F', // Deep Navy
  },
  
  // Gradient background
  gradient: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },
  
  // Keyboard avoiding view
  keyboardView: {
    flex: 1,
  },
  
  // Scroll content
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header Section
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // "CREATE ACCOUNT" text
  welcomeText: {
    fontSize: 32,
    fontWeight: '300',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  
  // Form container
  formContainer: {
    flex: 1,
    width: '100%',
  },
  
  // Divider section
  dividerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  
  dividerText: {
    color: '#C0C0C0',
    fontSize: 12,
    marginHorizontal: 16,
    letterSpacing: 2,
  },
  
  // Login link section
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  
  loginText: {
    color: '#E8F4F8',
    fontSize: 14,
  },
  
  loginLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default styles;