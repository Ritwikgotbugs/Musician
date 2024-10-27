import { View, Text, Button, TextInput, Image, Dimensions } from "react-native";
import React from "react";
import { router } from "expo-router";
import CustomButton from "../components/button";
import logo from '../assets/emotions/sign.png'; // Adjust the path according to your assets structure

const SignUp = () => {
  // Get screen dimensions
  const screenHeight = Dimensions.get('window').height;

  return (
    <View className="h-full bg-[#1a1a1a]">
      {/* Full-width image covering top 30% of the screen */}
      <Image
        source={logo}
        style={{ width: '100%', height: screenHeight * 0.3 }}
        resizeMode="cover"
      />

      <View className="absolute top-1/3 w-full justify-center items-center p-6">
        <Text className="text-white text-center text-5xl font-bold mb-6">
          Musician
        </Text>
        <Text className="text-white text-center text-3xl mb-8">Sign Up</Text>
        <View className="w-full max-w-md">
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Email</Text>
            <TextInput
              className="border border-slate-600 focus:border-blue-600 bg-[#2b2b2b] rounded-xl w-full h-14 p-4 text-white text-[18px]"
              placeholder="Enter your email"
              placeholderTextColor="#888"
            />
          </View>
          <View className="mb-6">
            <Text className="text-white text-lg mb-2">Password</Text>
            <TextInput
              className="border border-slate-600 focus:border-blue-600 bg-[#2b2b2b] rounded-xl w-full h-14 p-4 text-white text-[18px]"
              placeholder="Enter your password"
              placeholderTextColor="#888"
              secureTextEntry
            />
          </View>
          <CustomButton
            onPress={() => {
              router.push("home");
            }}
            title={"Sign Up"}
          />
        </View>
        <View className="flex flex-row items-center mt-6">
          <Text className="text-white text-lg">Already a user?</Text>
          <Button
            title="Log In"
            color="#f39c12"
            onPress={() => {
              router.replace("login");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SignUp;
