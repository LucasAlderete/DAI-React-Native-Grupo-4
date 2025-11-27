import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../config/colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('isDarkMode');
      if (saved !== null) setIsDarkMode(saved === 'true');
    })();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode(prev => {
      AsyncStorage.setItem('isDarkMode', (!prev).toString());
      return !prev;
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
