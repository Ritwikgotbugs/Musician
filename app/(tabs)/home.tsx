import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, ImageBackground } from "react-native";
import CustomButton from "~/components/button";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

// Import images for each emotion
import happyImage from '../../assets/emotions/happy.jpg';
import sadImage from '../../assets/emotions/sad.jpg';
import fearfulImage from '../../assets/emotions/fear.jpeg';
import surprisedImage from '../../assets/emotions/surprised.jpg';
import angryImage from '../../assets/emotions/angry.jpg';
import disgustedImage from '../../assets/emotions/disgusted.jpg';
import neutralImage from '../../assets/emotions/neutral.jpg';

// Emotion data
const emotions = [
  { label: "Happy", color: "#FBC02D", image: happyImage },
  { label: "Sad", color: "#42A5F5", image: sadImage },
  { label: "Fearful", color: "#7E57C2", image: fearfulImage },
  { label: "Surprised", color: "#FF7043", image: surprisedImage },
  { label: "Angry", color: "#E53935", image: angryImage },
  { label: "Disgusted", color: "#8D6E63", image: disgustedImage },
  { label: "Neutral", color: "#616161", image: neutralImage },
];

const EmotionSelection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Handle emotion selection
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  // Handle the "Detect Emotion" button press
  const handleDetectEmotion = () => {
    if (selectedEmotion) {
      router.push(`/${selectedEmotion}`);
    } else {
      Alert.alert("Error", "Please select an emotion first.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111111]">
      <View className="flex-1 flex-col">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 4, paddingTop: 5 }}>
          <View className="flex-col items-center">
            <Text className="text-2xl text-white font-bold mb-10 mt-5">
              Select an Emotion
            </Text>

            {/* Emotion Containers */}
            <View className="flex-row flex-wrap justify-between">
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion.label}
                  className={`bg-[#232323] w-[48%] h-24 rounded-3xl flex justify-center items-center mb-4 ${
                    selectedEmotion === emotion.label ? 'border-2 border-blue-500' : ''
                  }`}
                  onPress={() => handleEmotionSelect(emotion.label)}
                >
                  <ImageBackground
                    source={emotion.image}
                    className="w-full h-full rounded-3xl justify-center items-center"
                    imageStyle={{ borderRadius: 23 }}
                    resizeMode="cover"
                    
                  >
                    <Text className="text-white font-bold text-lg">
                      {emotion.label}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Detect Emotion Button */}
        <View className="w-full p-4">
          <CustomButton onPress={handleDetectEmotion} title={"Recommend Songs"} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmotionSelection;
