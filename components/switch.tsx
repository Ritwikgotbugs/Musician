import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";

const IOSSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#323232", true: "#323232" }} 
        thumbColor={isEnabled ? "#03B151" : "#111111"} 
        ios_backgroundColor="#E5E5EA" 
        onValueChange={toggleSwitch}
        value={isEnabled} 
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
 
});

export default IOSSwitch;