import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '../components/customButton.js';
import { useAppFonts } from '../styles/base/fonts.js';
import styles from "../styles/landingStyles.js";

const { width, height } = Dimensions.get('window');

// Floating Particle Component
const FloatingParticle = ({ delay, duration, startX }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          left: startX,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

export default function LandingScreen({ navigation }) {

    const fontsLoaded = useAppFonts();

    // Animation values - these control our animations
    const fadeAnim = useRef(new Animated.Value(0)).current; // Starts invisible
    const titleSlideAnim = useRef(new Animated.Value(-50)).current; // Starts above
    const taglineAnim = useRef(new Animated.Value(0)).current; // Starts invisible
    const cardFloatAnim = useRef(new Animated.Value(0)).current; // For floating
    const buttonSlideAnim = useRef(new Animated.Value(50)).current; // Starts below
    const buttonPulseAnim = useRef(new Animated.Value(1)).current; // For pulse effect

    useEffect(() => {
        // Sequential entrance animations (one after another)
        Animated.sequence([
        // 1. Title fades in and slides down
        Animated.parallel([
            Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            }),
            Animated.timing(titleSlideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            }),
        ]),
        
        // 2. Tagline fades in
        Animated.timing(taglineAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }),
        
        // 3. Button slides up
        Animated.timing(buttonSlideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }),
        ]).start();

        // Continuous floating animation for cards (loops forever)
        Animated.loop(
        Animated.sequence([
            Animated.timing(cardFloatAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            }),
            Animated.timing(cardFloatAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
            }),
        ])
        ).start();

        // Continuous pulse animation for button (loops forever)
        Animated.loop(
        Animated.sequence([
            Animated.timing(buttonPulseAnim, {
            toValue: 1.03,
            duration: 2000,
            useNativeDriver: true,
            }),
            Animated.timing(buttonPulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            }),
        ])
        ).start();
    }, []);

    if (!fontsLoaded) return null;

    // Function to handle "Get Started" button press
    const handleGetStarted = () => {
        console.log('Get Started Pressed!')
        navigation.navigate('Register')
    }

    // Function to handle "Already a Member" button press
    const handleAlreadyMember = () => {
        console.log('Already a Memeber pressed!')
        navigation.navigate('Login')
    }

    return (
        
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            {/*Status Bar - makes the top bar (time, battery) light colored*/}
            <StatusBar
                barStyle="default"
                backgroundColor="transparent"
                translucent={false}
            />
            {/* Background Gradient - creates the dark, luxurious background */}
            <ImageBackground
                source={require('../../assets/images/landingBackground.jpeg')}
                style={styles.background}
                resizeMode="cover"
            >

            {Array.from({ length: 12 }).map((_, i) => (
            <FloatingParticle
                key={i}
                delay={i * 500}
                duration={6000 + i * 500}
                startX={Math.random() * width}
            />
            ))}

            {/* Content Container - holds the main content of the screen */}
            <View style={styles.content}>

                {/* Hero Section - contains the app title with gradient text */}
                <Animated.View 
                    style={[
                    styles.heroSection,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: titleSlideAnim }],
                    },
                    ]}
                >
                        <Text style={styles.title}>MOVIEMOOD</Text>
                        <Text style={styles.subtitle}>Start Watching Movies for Every Mood</Text>
                </Animated.View>
                
                {/*Call to Action Buttons*/}
                <Animated.View 
                    style={[
                    styles.ctaContainer,
                    {
                        transform: [{ translateY: buttonSlideAnim }],
                    },
                    ]}
                >
                    {/* Primary Button - "Get Started"*/}
                    <CustomButton
                        title="BEGIN YOUR COLLECTION"
                        onPress={handleGetStarted}
                    />

                    {/* Secondary Button - "Already a Member"*/}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleAlreadyMember}
                        style={styles.secondaryButton}
                    >
                        <Text style={styles.secondaryButtonText}>Already a Member?</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            </ImageBackground>
        </SafeAreaView>
    );
};
