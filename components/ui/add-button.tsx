import React, { useState } from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  Modal,
  Button,
  ImageBackground,
  TextInput,
} from "react-native";
import SimpleButton from "./simple-button";
import { Shrink } from "lucide-react-native";

export default function AddButton() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };
  return (
    <View className="rounded-lg m-1">
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          "rgba(255, 255, 255, 0.1)",
          true,
          1000
        )}
        onPress={() => {
          toggleModal();
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: "rgba(49, 67, 185, 1)",
          }}
        >
          <Text style={{ color: "white", fontWeight: 300 }}>Add +</Text>
        </View>
      </TouchableNativeFeedback>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="justify-center  border-5 border-white bg-secondary-100 rounded-lg mx-16 p-6"
            style={{ borderWidth: 2, borderColor: "white" }}
          >
            <Text className="text-white" style={{ fontSize: 20 }}>
              Add a new skill
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                margin: 10,
                padding: 10,
                borderRadius: 10,
                color: "black",
              }}
              placeholder="Enter skill"
              onChangeText={(text) => {
                // Handle text input changes here
                text = text;
              }}
            />
            <View className="justify-evenly">
              <SimpleButton title="Add" imgsrc={null} onPress={toggleModal} />
              <SimpleButton title="Close" imgsrc={null} onPress={toggleModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
