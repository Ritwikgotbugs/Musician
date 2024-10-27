import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, Alert, Animated, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '~/components/button';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Detect: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<string>('0%');
  const [emotion, setEmotion] = useState<string | null>(null);
  const [emotionPrompt, setEmotionPrompt] = useState<string>('');
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [isDetectingEmotion, setIsDetectingEmotion] = useState<boolean>(false);
  
  const progress = useRef(new Animated.Value(0)).current;

  const playIcon = require('~/assets/play.png');
  const pauseIcon = require('~/assets/pause.png');
  const sampleImage = require('~/assets/emotions/audio-bg.jpg');

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

  const handleOpenCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Camera access is required to take a picture.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', { uri, name: 'photo.jpg', type: blob.type || 'image/jpeg' } as any);

      const uploadResponse = await fetch('https://0x0.st', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error(`Upload failed with status ${uploadResponse.status}: ${uploadResponse.statusText}`);
        return null;
      }

      const uploadedUrl = await uploadResponse.text();
      return uploadedUrl.trim();
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const detectEmotion = async (imageUrl: string) => {
    setIsDetectingEmotion(true);
    try {
      const response = await fetch('https://emotion-detection2.p.rapidapi.com/emotion-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'emotion-detection2.p.rapidapi.com',
          'x-rapidapi-key': '0b57d20c9fmsh92273ed4249c7a4p1d32d6jsnb323c7084d31',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      const data = await response.json();
      setEmotion(data[0].emotion.value);
      const emotionAdjectives = {
        happy: 'upbeat and cheerful',
        sad: 'slow and emotional',
        angry: 'intense and strong',
        surprised: 'fast and dynamic',
        disgusted: 'dark and heavy',
        fearful: 'mysterious and eerie',
        neutral: 'calm and soothing',
      };
      const emotionValue = (data[0].emotion.value as keyof typeof emotionAdjectives).toLowerCase();
      const adjectives = emotionAdjectives[emotionValue as keyof typeof emotionAdjectives] || 'unique';
      setEmotionPrompt(`A ${data[0].emotion.value} song with ${adjectives} beats`);
    } catch (error) {
      console.error('Error detecting emotion:', error);
      Alert.alert('Error', 'Failed to detect emotion. Please try again.');
    } finally {
      setIsDetectingEmotion(false);
    }
  };

  const handleImageProcessing = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please capture an image first.');
      return;
    }

    try {
      const uploadedUrl = await uploadImage(imageUri);
      if (!uploadedUrl) {
        Alert.alert('Error', 'Failed to upload image.');
        return;
      }

      await detectEmotion(uploadedUrl);
    } catch (error) {
      console.error('Error in image processing:', error);
    }
  };

  const handleGenerateMusicEmotion = async () => {
    const currentPrompt = emotionPrompt;

    if (!currentPrompt) {
      Alert.alert('Error', 'Please detect an emotion.');
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
            await saveGeneratedMusic(currentPrompt, uri); // Save generated music to AsyncStorage
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
    <SafeAreaView className="bg-[#111] h-full justify-center items-center">
      <ScrollView className='w-full' contentContainerStyle={{justifyContent: 'center', alignContent:'center', display: 'flex'
      }}>
        <Text className="text-white text-3xl font-bold m-6 text-center">MusicGen with Emotion</Text>
        <View className="flex-1 items-center justify-center mt-6">
          <View>
            <Button title="Capture Image" onPress={handleOpenCamera} />
          </View>
            <View style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' }}>
            {imageUri ? (
              <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
            ) : (
              <Text style={{ color: 'white', opacity: 0.5 }} className='items-center justify-center flex text-center p-2'>Image captured will be displayed here</Text>
            )}
            </View>
          <View style={{ marginTop: 10 }}>
            <Button title="Detect Emotion" onPress={handleImageProcessing} />
          </View>
          {isDetectingEmotion && (
            <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: 10 }} />
          )}
          {emotion && (
            <Text style={{ color: 'white', marginTop: 10 }}>
              Detected Emotion: {emotion}
            </Text>
          )}
          <View className='w-1/2 mx-5 p-5'>
            <CustomButton title="Generate Music" onPress={handleGenerateMusicEmotion} />
          </View>
        </View>

        {loading && (
  <View className="w-full items-center justify-center mb-5">
    <View className="bg-[#333] rounded-md h-7 w-3/4 overflow-hidden justify-center">
      <Animated.View className="h-full bg-green-500" style={{ width: loadingWidth }} />
    </View>
  </View>
)}
        {audioUri && (
  <View className="w-full items-center justify-center mt-5">
    <View className="flex-col justify-center items-center border-2 border-slate-700 rounded-3xl p-4 w-3/4 mb-10">
      <Image source={sampleImage} style={{ width: 200, height: 200, borderRadius: 8 }} />
      <TouchableOpacity onPress={handlePlayPauseMusic} className="mt-5">
        <Image source={isPlaying ? pauseIcon : playIcon} style={{ width: 64, height: 64 }} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  </View>
)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Detect;
