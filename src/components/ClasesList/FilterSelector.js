import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterSelector = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress}>
    <Text style={styles.filterText} numberOfLines={1}>
      {value || label}
    </Text>
    <Text style={styles.filterArrow}>▼</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  filterText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  filterArrow: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default FilterSelector;
