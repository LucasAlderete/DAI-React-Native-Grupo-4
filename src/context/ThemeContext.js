import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('darkMode');
      if (saved !== null) setDarkMode(saved === 'true');
    })();
  }, []);

  const toggleDarkMode = async () => {
    setDarkMode(prev => {
      AsyncStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
