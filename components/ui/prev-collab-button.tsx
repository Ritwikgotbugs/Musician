import {
  Animated,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function PrevCollabButton({}: {}) {
  function onPress() {
    //open a new page here
  }
  return (
    <View
      style={{
        borderRadius: 12,
        marginTop: 12,
        marginBottom: 4,
        paddingHorizontal: 4,
      }}
    >
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "rgba(50, 50, 50, 1)",
          }}
        >
          <View style={styles.header}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
              Previous Collaborations
            </Text>
            <AntDesign
              name={"right"}
              size={20}
              color={"white"}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
