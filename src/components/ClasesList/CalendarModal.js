import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { calendarTheme } from '../../config/calendarConfig';

const CalendarModal = ({ visible, onClose, selectedDate, onSelectDate }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.calendarModalContent}>
        <View style={styles.calendarHeader}>
          <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
          <TouchableOpacity
            onPress={() => {
              onSelectDate(null);
              onClose();
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
        <Calendar
          onDayPress={(day) => {
            onSelectDate(day.dateString);
            onClose();
          }}
          markedDates={{
            ...(selectedDate && {
              [selectedDate]: {
                selected: true,
                selectedColor: '#2563EB',
              }
            })
          }}
          theme={calendarTheme}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default CalendarModal;
