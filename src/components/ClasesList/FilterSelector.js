import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { lightColors, darkColors } from '../../config/colors';
import { ThemeContext } from '../../context/ThemeContext';

const FilterSelector = ({ label, value, onPress }) => {
  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  return (
      <TouchableOpacity
        style={[
          styles.filterButton, 
          { backgroundColor: colors.card, borderColor: colors.border }
        ]} 
        onPress={onPress}>
        <Text style={[styles.filterText, { color: colors.textSecondary }]} numberOfLines={1}>
          {value || label}
        </Text>
        <Text style={[styles.filterArrow, { color: colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  filterText: {
    fontSize: 13,
    flex: 1,
  },
  filterArrow: {
    fontSize: 10,
    marginLeft: 4,
  },
});

export default FilterSelector;
