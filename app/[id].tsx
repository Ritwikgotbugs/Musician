import { useRoute } from "@react-navigation/native";
import { Audio } from 'expo-av'; // Import Audio from expo-av
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

// Define the structure of the Song object
interface Song {
  Name: string;
  Album: string;
  Artist: string;
  Image: string; // Add an Image field for the song cover
  Link: string; // Add a Link field for the song URL
}

// Import your JSON files statically
import pauseImage from '../assets/pause.png'; // Import pause image
import playImage from '../assets/play.png';
import angrySongs from '../assets/songs/angry.json';
import disgustedSongs from '../assets/songs/disgusted.json';
import fearfulSongs from '../assets/songs/fear.json';
import happySongs from '../assets/songs/happy.json';
import neutralSongs from '../assets/songs/neutral.json';
import sadSongs from '../assets/songs/sad.json';
import surprisedSongs from '../assets/songs/surprised.json';

const EmotionPage: React.FC = () => {
  const route = useRoute();
  const { id = "neutral" } = route.params as { id: string };
  const [songs, setSongs] = useState<Song[]>([]);
  const [randomSongs, setRandomSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shuffling, setShuffling] = useState<boolean>(false);
  
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State for sound
  const [playingSong, setPlayingSong] = useState<string | null>(null); // Track the currently playing song

  const readJSON = () => {
    let selectedSongs;
    switch (id) {
        case 'happy':
            selectedSongs = happySongs as unknown as Song[];
            break;
        case 'sad':
            selectedSongs = sadSongs as unknown as Song[];
            break;
        case 'fearful':
            selectedSongs = fearfulSongs as unknown as Song[];
            break;
        case 'surprised':
            selectedSongs = surprisedSongs as unknown as Song[];
            break;
        case 'angry':
            selectedSongs = angrySongs as unknown as Song[];
            break;
        case 'disgusted':
            selectedSongs = disgustedSongs as unknown as Song[];
            break;
        default:
            selectedSongs = neutralSongs as unknown as Song[];
    }
    setSongs(selectedSongs);
    setLoading(false);
  };

  const shuffleSongs = async () => {
    setShuffling(true); // Start shuffling
    await new Promise(resolve => setTimeout(resolve, 500)); // Pause for 0.5 second
    if (songs.length > 0) {
      const shuffled = [...songs].sort(() => 0.5 - Math.random());
      setRandomSongs(shuffled.slice(0, 8)); // Select 8 random songs
    }
    setShuffling(false); // End shuffling
  };

  useEffect(() => {
    readJSON();
  }, [id]);

  useEffect(() => {
    shuffleSongs(); // Shuffle songs when the component mounts
  }, [songs]);

  // Play or pause the sound when the user clicks a song
  const playSound = async (link: string, songName: string) => {
    try {
      // Pause the currently playing song if clicked again
      if (playingSong === songName) {
        await sound?.pauseAsync();
        setPlayingSong(null);
        return;
      }

      // Stop and unload the current sound if there is one
      if (sound) {
        await sound.unloadAsync();
        setSound(null); // Reset sound state after unloading
      }

      // Load the new sound
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: link });
      setSound(newSound);

      // Play the new sound
      await newSound.playAsync();
      setPlayingSong(songName); // Update the currently playing song

      // Set up event listener for when the song finishes
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingSong(null); // Reset playing song when finished
          newSound.unloadAsync(); // Unload sound when finished
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload sound when the component unmounts
      }
    };
  }, [sound]);

  const renderSongItem = ({ item }: { item: Song }) => (
    <View className="bg-[#232323] rounded-lg p-4 flex-row items-center justify-between mb-5">
      <View className="flex-row items-center">
        <Image source={{ uri: item.Image }} className="w-12 h-12 rounded-lg" />
        <View className="ml-3">
          <Text 
            className="text-white text-lg" 
            numberOfLines={1} // Limit to 1 line
            ellipsizeMode="tail" // Truncate with ellipsis if the text is too long
          >
            {item.Name}
          </Text>
          <Text className="text-gray-400 text-sm">{item.Artist}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => playSound(item.Link, item.Name)} // Play sound on button press
        className="rounded-lg p-2 ml-2"
      >
        <Image source={playingSong === item.Name ? pauseImage : playImage} className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#111111]">
      <View className="flex-1 px-4 pt-5">
        <Text className="text-4xl text-white font-bold mb-5 ml-3">
          Songs
        </Text>

        {(loading || shuffling) ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : randomSongs.length > 0 ? (
          <FlatList
            data={randomSongs}
            keyExtractor={(item) => item.Name}
            renderItem={renderSongItem}
          />
        ) : (
          <Text className="text-white text-lg">No songs available</Text>
        )}

        <TouchableOpacity 
          onPress={shuffleSongs} 
          className="bg-blue-700 rounded-lg p-3 items-center mt-5"
        >
          <Text className="text-white font-bold text-lg">Shuffle Songs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmotionPage;
