import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container - full screen
  container: {
    flex: 1,
    // backgroundColor: '#0B1F3F', // Navy fallback color
  },
  
  // Gradient background
  gradient: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },
  
  // Spotlight effect - creates glow at top
  spotlight: {
    position: 'absolute',
    top: -100,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(232, 244, 248, 0.08)', // Ice blue glow
    opacity: 0.6,
  },
  
  // Keyboard avoiding view
  keyboardView: {
    flex: 1,
  },
  
  // Scroll view content
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
  
  // "WELCOME BACK" text
  welcomeText: {
    fontSize: 32,
    fontFamily: 'Roboto',
    color: '#FFFFFF', 
    justifyContent: 'center',
  },
  
  // Form container
  formContainer: {
    flex: 1,
    width: '100%',
  },
  
  // Forgot Password button
  forgotButton: {
    alignSelf: 'center', // Align to right
    marginTop: 20, // Spacing between forgot button and sign in
  },
  
  forgotText: {
    color: '#7d7d7dff', // Silver
    fontSize: 13,
    textDecorationLine: 'underline',
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
  
  // Register link section
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  
  registerText: {
    color: '#E8F4F8',
    fontSize: 14,
  },
  
  registerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default styles;