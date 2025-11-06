import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

export default function CustomBlurBar({
  intensity = 80,
  tint = 'dark',
  borderRadius = 20,
  children,
}) {
  return (
    <View style={[styles.container, { borderRadius }]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <View style={[styles.goldGlow, { borderRadius }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  goldGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});
