import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const FilterSelector = ({ label, value, onPress }) => {
  const { theme } = useContext(ThemeContext);

  return (
      <TouchableOpacity
        style={[
          styles.filterButton, 
          { backgroundColor: theme.card, borderColor: theme.border }
        ]} 
        onPress={onPress}>
        <Text style={[styles.filterText, { color: theme.textSecondary }]} numberOfLines={1}>
          {value || label}
        </Text>
        <Text style={[styles.filterArrow, { color: theme.textSecondary }]}>▼</Text>
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
