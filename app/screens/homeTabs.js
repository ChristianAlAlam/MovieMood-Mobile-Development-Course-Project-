import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import CustomAddButton from '../components/customAddButton';
import CustomBlurBar from '../components/customBlurBar';

import AddMovieScreen from '../screens/addMovieScreen';
import FavoritesScreen from '../screens/favoritesScreen';
import HomeScreen from '../screens/homeScreen';
import MoviesScreen from '../screens/moviesScreen';
import ProfileScreen from '../screens/profileScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarBackground: () => <CustomBlurBar />,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          left: 20,
          right: 20,
          height: 60,
          borderTopWidth: 0,
          backgroundColor: 'rgba(11, 31, 63, 0.6)',
          elevation: 10,
          overflow: 'visible',   // allow icon to float above
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Inter_18pt-Bold',
          marginTop: 3,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Movies: 'film-outline',
            Add: 'add',
            Favs: 'star-outline',
            Profile: 'person-outline',
          };

          if (route.name === 'Add') size = 32; // make the icon bigger inside the circle

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Movies" component={MoviesScreen} />
      <Tab.Screen
        name="Add"
        component={AddMovieScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <CustomAddButton {...props} />, // use custom button
          tabBarIcon: () => null, // Hide default icon so only custom button shows
        }}
      />
      <Tab.Screen name="Favs" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
});
