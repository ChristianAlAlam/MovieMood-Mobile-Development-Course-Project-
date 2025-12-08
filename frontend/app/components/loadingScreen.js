import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingScreen({
  spinnerColor = "#8B5CF6",
  backgroundColor = "rgba(0,0,0,0.9)",
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={spinnerColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
