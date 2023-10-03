import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import React from "react";
import { theme } from "../theme";

const { width, height } = Dimensions.get("window");

export default function Loading() {
  return (
    <View
      style={{ width, height }}
      className="flex-row absolute justify-center items-center"
    >
      <ActivityIndicator color={theme.background} size="large" />
    </View>
  );
}
