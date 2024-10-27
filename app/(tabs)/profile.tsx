import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons'; 

interface SongHistory {
  prompt: string;
  uri: string;
  date: string;
}

const ProfilePage = () => {
  const [songHistory, setSongHistory] = useState<SongHistory[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false); 
  const [playingUri, setPlayingUri] = useState<string | null>(null); 
  const [sound, setSound] = useState<Audio.Sound | null>(null); 
  const [isPlaying, setIsPlaying] = useState<boolean>(false); 

  const fetchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('generatedMusicHistory');
      if (history) {
        setSongHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();

   
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory(); 
    setRefreshing(false);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('generatedMusicHistory');
      setSongHistory([]);
      Alert.alert('Success', 'History cleared.');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  
  const stopCurrentSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null); // Clear sound object once unloaded
    }
  };

  // Function to play or pause a song
  const handlePlayPause = async (uri: string) => {
    // If the selected song is already playing, pause it
    if (playingUri === uri && isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
      return;
    }

    // If another song is playing, stop it first
    if (playingUri && playingUri !== uri) {
      await stopCurrentSound();
    }

    // Load and play the new song
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setPlayingUri(uri);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  return (
    <SafeAreaView className="bg-[#111111] h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> 
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 bg-[#111111] px-4 pt-8">
          <View className="items-center">
            <Text className="text-white text-3xl font-bold">Profile</Text>
          </View>
          
          <View className="items-center my-6">
            <View
              className="rounded-full mb-1"
              style={{ borderColor: "rgba(49, 67, 185, 1)", borderWidth: 1 }}
            >
              <Image
                source={{ uri: "https://github.com/shadcn.png" }}
                className="w-32 h-32 rounded-full"
              />
            </View>
            <Text className="text-3xl font-bold text-white">
              Ritwik Sharma
            </Text>
          </View>

          <View className="flex-1">
            {songHistory.length > 0 ? (
              <View>
                <Text className="text-white text-xl mb-4">Generated Music History</Text>
                {songHistory.map((song, index) => (
                  <View key={index} className="flex-row items-center justify-between mb-4 bg-[#222] p-4 rounded-lg">
                    <View>
                      <Text className="text-white text-ellipsis mr-5">Prompt: {song.prompt}</Text>
                      <Text className="text-white">Date: {new Date(song.date).toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handlePlayPause(song.uri)}>
                      {playingUri === song.uri && isPlaying ? (
                        <AntDesign name="pausecircle" size={32} color="white" />
                      ) : (
                        <AntDesign name="playcircleo" size={32} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-white text-lg">No history available</Text>
            )}
          </View>

          {/* Clear History button at the bottom */}
          <TouchableOpacity onPress={clearHistory} className="bg-red-500 p-3 rounded-lg mt-4 mb-6">
            <Text className="text-white text-center">Clear History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
