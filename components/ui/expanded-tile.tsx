import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

interface ExpandedTileProps extends React.ComponentProps<typeof View> {
    title: string;
    children: React.ReactNode;

}

export const ExpandedTile = ({ children, title, ...props }: ExpandedTileProps) => {

const [expanded, setExpanded] = React.useState(false);

const toggleExpanded = () => {
    setExpanded(!expanded);
}

  return (
    <View {...props}>
        <Pressable onPress={toggleExpanded} className='p-4 border border-white/20 rounded-md'>
            <Text className='text-white font-medium text-lg'>
                {title}
            </Text>
        </Pressable>
        <View className='mt-3 p-4 border border-white/20 rounded-md' style={{
            display: expanded ? 'flex' : 'none',
        }}>
            {children}
        </View>
    </View>
  );
}