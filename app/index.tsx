import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

const Index = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("login");
    }, 0); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View className="bg-secondary-100 h-full justify-center items-center">
    </View>
  );
}

export default Index;
