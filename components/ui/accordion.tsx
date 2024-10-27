import {
  Animated,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function Accordion({
  title,
  details,
}: {
  title: string;
  details: string;
}) {
  const [opened, setOpened] = React.useState(false);
  const [animation] = useState(new Animated.Value(0));
  function toggleAccordion() {
    if (!opened) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
    setOpened(!opened);
  }
  const detailsArray = details.split(",");
  const heightAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, detailsArray.length * 20],
  });

  return (
    <View style={{ borderRadius: 12, marginTop: 12, paddingHorizontal: 4 }}>
      <TouchableNativeFeedback onPress={toggleAccordion}>
        <View
          style={{
            padding: 16,
            paddingBottom: 8,
            borderRadius: 12,
            backgroundColor: "rgba(50, 50, 50, 1)",
          }}
        >
          <View style={styles.header}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
              {title}
            </Text>
            <AntDesign
              name={opened ? "up" : "down"}
              size={20}
              color={"white"}
              style={{ marginTop: 4 }}
            />
          </View>
          <Animated.View
            style={[
              styles.content,
              { height: heightAnimationInterpolation, marginBottom: 4 },
            ]}
          >
            {detailsArray.map((detail, index) => (
              <Text key={index} className="text-white">
                {detail.trim()}
              </Text>
            ))}
          </Animated.View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
