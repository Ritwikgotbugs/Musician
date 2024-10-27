import React from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet,
  Image,
} from "react-native";
export default function SimpleButton({
  title,
  imgsrc,
  onPress,
}: {
  title: string;
  imgsrc: any;
  onPress?: () => void; //this is where you can take the link to their social
}) {
  return (
    <View style={{ borderRadius: 12, marginTop: 4 }}>
      <TouchableNativeFeedback onPress={onPress} style={{ borderRadius: 12 }}>
        <View
          className="w-fit h-fit"
          style={{
            padding: 16,
            alignItems: "center",
          }}
        >
          {imgsrc ? <Image source={imgsrc} style={styles.image} /> : null}
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "white",
    marginTop: 2,
  },
  image: {
    width: 24,
    height: 24,
  },
});
