import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const CustomButton = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
}: CustomButtonProps) => {

  const variantStyles = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600 border-gray-600",
    danger: "bg-rose-700 border-red-500",
  };

  const disabledStyles = "bg-gray-400"; // Disabled style

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={!disabled ? onPress : undefined}
      className={`w-full rounded-xl min-h-[50px] justify-center items-center  ${disabled ? disabledStyles : variantStyles[variant]}`}
      disabled={disabled}
    >
      <Text className={`font-medium text-xl text-white`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
