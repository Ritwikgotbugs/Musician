import { Pressable, Alert, View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { styled } from "nativewind";

type ProfileCardProps = {
  user: {
    name: string;
    about: string;
    totalProjects: number;
    totalCollabs: number;
    techStack: string[];
    projectStack: string[];
  };
  id: string;
  pressFunction: any;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProfileCard({ user, id, pressFunction }: ProfileCardProps) {
  return (
    <ScrollView className="h-full"
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111111",
        
      }}
    >
      <StyledView className="bg-[#111111] px-5 py-5">
        <StyledView className="bg-[#232323] pt-2 pb-4 flex-col gap-3 shadow-lg rounded-3xl">
          {/* Image Placeholder */}
          <StyledView className="flex-row justify-between items-center">
            <StyledView className="items-center mb-4 border border-[#3143B9] rounded-full p-1">
              <StyledImage
                source={{
                  uri: "https://preview.redd.it/zfohxnf8t3pa1.jpg?width=1024&format=pjpg&auto=webp&v=enabled&s=0f660e0a56476991ee3b97f2885d8c010fec5b97",
                }} // Example image URL
                className="w-24 h-24 rounded-full"
                resizeMode="contain"
              />
            </StyledView>
            <StyledView className="pr-10">
              <StyledText className="text-center text-white text-xl font-semibold mb-2">
                {user.name}
              </StyledText>

              {/* Collaboration and Project Counts */}
              <StyledView className="flex-row justify-between gap-8">
                <StyledView className="flex-col justify-center">
                  <StyledText className="text-white text-lg font-medium text-center">
                    {user.totalCollabs}
                  </StyledText>
                  <StyledText className="text-gray-400 text-xs tracking-wide">
                    Collabs
                  </StyledText>
                </StyledView>
                <StyledView className="flex-col justify-center">
                  <StyledText className="text-white text-lg font-medium text-center">
                    {user.totalProjects}
                  </StyledText>
                  <StyledText className="text-gray-400 text-xs tracking-wide">
                    Projects
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* About Section */}
          <StyledView className="flex-col justify-center items-center">
            <StyledText className="text-white font-semibold text-xl">About</StyledText>
            <StyledText className="text-gray-400 text-center p-2">
              {user.about}
            </StyledText>
          </StyledView>

          {/* Skills */}
          <StyledView className="flex-col gap-2">
            <StyledText className="text-white font-semibold">Skills</StyledText>
            <StyledView className="flex-row flex-wrap gap-2">
              {user?.techStack.map((skill, index) => (
                <StyledView
                  key={index}
                  className="bg-gray-700 rounded-md px-3"
                >
                  <StyledText className="text-white text-sm">
                    {skill}
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>

          {/* Preference */}
          <StyledView className="flex-col gap-2">
            <StyledText className="text-white font-semibold">
              Preference
            </StyledText>
            <StyledView className="flex-row flex-wrap">
              {user?.projectStack.map((preference, index) => (
                <StyledView
                  key={index}
                  className="bg-gray-700 rounded-lg px-3 m-1"
                >
                  <StyledText className="text-white text-sm">
                    {preference}
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>

          {/* Read More Button */}
          <StyledView className="items-center">
            <StyledText className="text-yellow-500 font-semibold">
              Read more
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </ScrollView>
  );
}
