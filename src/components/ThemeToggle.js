import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  const offsetX = useRef(new Animated.Value(isDarkMode ? 30 : 3)).current;

  useEffect(() => {
    Animated.spring(offsetX, {
      toValue: isDarkMode ? 30 : 3,
      useNativeDriver: false,
      stiffness: 200,
      damping: 20,
    }).start();
  }, [isDarkMode]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleTheme}
      style={[
        styles.switchContainer,
        { backgroundColor: isDarkMode ? '#fff' : '#000' },
      ]}
    >
      <Animated.View
        style={[
          styles.toggleCircle,
          {
            left: offsetX,
            backgroundColor: isDarkMode ? '#000' : '#fff',
          },
        ]}
      >
        {isDarkMode ? (
          <AntDesign name="sun" size={18} color="#fff" />
        ) : (
          <AntDesign name="moon" size={18} color="#000" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 60,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  toggleCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;
