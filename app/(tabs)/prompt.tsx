import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, Animated, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import CustomButton from '~/components/button';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const playIcon = require('~/assets/play.png');
const pauseIcon = require('~/assets/pause.png');
const sampleImage = require('~/assets/emotions/audio-bg.jpg');

const Detect: React.FC = () => {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<string>('0%');
  const [promptState, setPromptState] = useState<string>('');
  const [finalPrompt, setFinalPrompt] = useState<string>(''); // New state for final prompt

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.addListener(({ value }) => {
      const calculatedPercentage = Math.floor(value);
      setPercentage(`${calculatedPercentage}%`);
    });

    return () => {
      progress.removeAllListeners();
    };
  }, [progress]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleGenerateMusic = async () => {
    const currentPrompt = promptState;

    if (!currentPrompt) {
      Alert.alert('Error', 'Please provide a prompt.');
      return;
    }

    setLoading(true);
    startLoadingAnimation();
    setFinalPrompt(currentPrompt);

    try {
      const response = await fetch('https://147d-34-126-159-211.ngrok-free.app/generate_music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          const uri = `${FileSystem.documentDirectory}generated_music.wav`;

          if (base64Audio) {
            await FileSystem.writeAsStringAsync(uri, base64Audio, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setAudioUri(uri);
            await saveGeneratedMusic(currentPrompt, uri); // Save generated music
            Alert.alert('Success', 'Music generated successfully!');
          } else {
            Alert.alert('Error', 'Failed to process audio file. Please try again.');
          }
        };

        reader.readAsDataURL(audioBlob);
      } else {
        Alert.alert('Error', 'Failed to generate music. Please try again.');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      resetLoadingAnimation();
    }
  };

  const saveGeneratedMusic = async (prompt: string, uri: string) => {
    try {
      const history = await AsyncStorage.getItem('generatedMusicHistory');
      const songHistory = history ? JSON.parse(history) : [];
      const newEntry = {
        prompt,
        uri,
        date: new Date().toISOString(),
      };
      songHistory.push(newEntry);
      await AsyncStorage.setItem('generatedMusicHistory', JSON.stringify(songHistory));
    } catch (error) {
      console.error('Error saving music history:', error);
    }
  };

  const handlePlayPauseMusic = async () => {
    if (audioUri) {
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        if (!sound) {
          const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
          setSound(newSound);
          await newSound.playAsync();
          setIsPlaying(true);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    }
  };

  const startLoadingAnimation = () => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 50000,
      useNativeDriver: false,
    }).start();
  };

  const resetLoadingAnimation = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const loadingWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  return (
    <SafeAreaView className="bg-[#111] h-full flex justify-center items-center">
      <View className="w-full items-center">
        <Text className="text-white text-center text-3xl font-bold">Generate Music</Text>
        <TextInput
          className="border border-blue-400 p-4 w-3/4 rounded-xl text-white bg-[#333] mt-6"
          placeholder="Enter a prompt"
          placeholderTextColor="#888"
          value={promptState}
          onChangeText={setPromptState}
        />
        <View className="w-3/4 mt-6">
          <CustomButton
            title="Generate Music"
            onPress={handleGenerateMusic}
            disabled={loading}
            variant="primary"
          />
        </View>

        {loading && (
          <View className=" bg-[#333] rounded-md h-7 w-3/4 overflow-hidden relative justify-center items-center flex m-10">
            <Animated.View className="h-full bg-green-500" style={{ width: loadingWidth }} />
          </View>
        )}

        {audioUri && (
          <View className="flex-col justify-center items-center mt-6 border-2 border-slate-700 rounded-3xl p-4">
            <Text className="text-white font-bold pb-3 text-xl">{finalPrompt}</Text>
            <Image source={sampleImage} style={{ width: 200, height: 200, borderRadius: 8 }} />
            <TouchableOpacity onPress={handlePlayPauseMusic} className="mt-5">
              <Image
                source={isPlaying ? pauseIcon : playIcon}
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Detect;
