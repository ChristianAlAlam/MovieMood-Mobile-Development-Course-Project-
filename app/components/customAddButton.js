// components/CustomAddButton.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomAddButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      <View style={styles.button}>
        {/* Thin 75% gold arc ring */}
        <View style={styles.arcRing} />
        {/* Gold + icon */}
        <Ionicons name="add" size={34} color="#D4AF37" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    overflow: 'visible',
  },
  button: {
    width: 55,
    height: 55,
    borderRadius: 34,
    backgroundColor: '#0B1F3F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

    // Glow + depth
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  arcRing: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],  // rotate arc to desired direction
  },
});
