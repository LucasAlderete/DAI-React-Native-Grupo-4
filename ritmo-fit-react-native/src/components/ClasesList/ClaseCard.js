import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const ClaseCard = ({ clase, onPress, formatDate }) => {

  const { theme } = useContext(ThemeContext);
  
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress}>
      <Text style={styles.disciplineName}>{clase.disciplina.nombre}</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📅</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>{formatDate(clase.fechaInicio)}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.icon}>👤</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          Instructor: {clase.instructor.nombre} {clase.instructor.apellido}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>Sede: {clase.sede.nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disciplineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});

export default ClaseCard;
