import React from "react";
import { View, Text } from "react-native";

export default function SkillChip({ title }: { title: string }) {
  return (
    <View
      className="m-1 px-4 py-2 bg-primary-200 rounded-lg  w-fit h-fit  justify-center"
      style={{ backgroundColor: "rgba(50, 50, 50, 1)" }}
    >
      <Text style={{ color: "white", fontWeight: 300 }}>{title}</Text>
    </View>
  );
}
