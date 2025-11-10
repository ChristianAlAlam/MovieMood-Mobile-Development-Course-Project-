import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import ContinueWatchingScreen from '../screens/continueWatchingScreen';
import FavoritesScreen from '../screens/favoritesScreen';
import HomeScreen from '../screens/homeScreen';
import MoviesScreen from '../screens/moviesScreen';

const Tab = createBottomTabNavigator();

/**
 * Custom Tab Bar Background with Glass/Frosted Effect
 */
const CustomTabBarBackground = () => {
  return (
    <View style={styles.blurContainer}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};

/**
 * HomeTabs - Bottom Tab Navigation with Glass Effect
 * 
 * Features:
 * - Frosted glass/blur background
 * - Rounded corners
 * - Floating appearance
 * - Minimal 4-icon layout
 */
export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Hide labels for minimal look
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,   
          // backgroundColor: 'rgba(255,255,255,0.2)',
          borderTopWidth: 0,
          position: 'absolute',
        },
        tabBarBackground: () => <CustomTabBarBackground />,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let iconSize = 28;
          let materialName;

          // Map routes to icons (Netflix style)
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Continue') {
            materialName = focused ? 'movie-filter' : 'movie-filter-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return (
            <View style={styles.iconContainer}>
              {iconName ? <Ionicons name={iconName} size={iconSize} color={color}/>
              : <MaterialCommunityIcons name={materialName} size={iconSize} color={color}/>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Watchlist" component={MoviesScreen} />
      <Tab.Screen name="Continue" component={ContinueWatchingScreen} />
      <Tab.Screen name="Favorite" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 15, 20, 0.7)',
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
