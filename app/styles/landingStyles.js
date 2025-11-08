import { Dimensions, StyleSheet } from 'react-native';
const { width, height } =  Dimensions.get('window');

const styles = StyleSheet.create({
    //main container that fills the entire screen
    container:{
        flex: 1
    },
    
    //image background style to cover the entire screen
    background: {
        flex: 1,
        ...StyleSheet.absoluteFill,
    },

    //content container style
    content: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

//============ TITLE SECTION ============//
    heroSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    title: {
        fontSize: 56,
        fontFamily: 'Roboto',
        color: '#FFFFFF',
    },

    subtitle: {
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#FFFFFF',
        opacity: 0.9,
    },

//============ Call to Action Buttons ============
    ctaContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 20, //space between buttons
        paddingBottom: 10, //space from bottom of screen
        width: '100%',
    },

    buttonWrapper: {
        width: width * 0.85, //85% of screen width
        shadowColor: '#FFFFFF',
        elevation: 10, //Android shadow
    },
  
  // Secondary button (text link)
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-18pt-SemiBold',
    color: '#7d7d7dff',
    textDecorationLine: 'underline',
  },

});

export default styles;