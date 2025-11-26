import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

const DateRangeFilter = ({ fechaInicio, fechaFin, onApplyFilter, onClearFilter }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectingType, setSelectingType] = useState(null);
    const [tempFechaInicio, setTempFechaInicio] = useState(fechaInicio);
    const [tempFechaFin, setTempFechaFin] = useState(fechaFin);

    const { darkMode } = useContext(ThemeContext);
    const colors = darkMode ? darkColors : lightColors;

    const formatDisplayDate = (date) => {
        if (!date) return 'Seleccionar';
        const d = new Date(date);
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const anio = d.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    const openDatePicker = (type) => {
        setSelectingType(type);
        setShowModal(true);
    };

    const handleDateSelect = (day) => {
        // Crear fecha en zona horaria local, no UTC
        const [year, month, dayNum] = day.dateString.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, dayNum);

        if (selectingType === 'inicio') {
            if (tempFechaFin && selectedDate > tempFechaFin) {
                setTempFechaFin(null);
            }
            setTempFechaInicio(selectedDate);
        } else {
            if (tempFechaInicio && selectedDate < tempFechaInicio) {
                setTempFechaInicio(null);
            }
            setTempFechaFin(selectedDate);
        }

        setShowModal(false);
    };

    const handleApplyFilter = () => {
        let inicio = null;
        let fin = null;

        if (tempFechaInicio) {
            inicio = new Date(tempFechaInicio);
            inicio.setHours(0, 0, 0, 0);
        }

        if (tempFechaFin) {
            fin = new Date(tempFechaFin);
            fin.setHours(23, 59, 59, 999);
        }

        onApplyFilter(inicio, fin);
    };

    const handleClearFilter = () => {
        setTempFechaInicio(null);
        setTempFechaFin(null);
        onClearFilter();
    };

    const hasFilters = tempFechaInicio || tempFechaFin;

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Filtrar por fecha</Text>

            <View style={styles.dateSelectorsRow}>
                <View style={styles.dateSelector}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Desde</Text>
                    <TouchableOpacity
                        style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => openDatePicker('inicio')}
                    >
                        <Text style={[
                            styles.dateButtonText, 
                            tempFechaInicio && styles.dateButtonTextSelected,
                            {color: colors.textSecondary}
                            ]}>
                            {formatDisplayDate(tempFechaInicio)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateSelector}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Hasta</Text>
                    <TouchableOpacity
                        style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border}]}
                        onPress={() => openDatePicker('fin')}
                    >
                        <Text style={[
                            styles.dateButtonText, 
                            tempFechaFin && styles.dateButtonTextSelected,
                            {color: colors.textSecondary}
                            ]}>
                            {formatDisplayDate(tempFechaFin)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.applyButton]}
                    onPress={handleApplyFilter}
                    disabled={!hasFilters}
                >
                    <Text style={styles.applyButtonText}>Aplicar filtro</Text>
                </TouchableOpacity>

                {hasFilters && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.clearButton]}
                        onPress={handleClearFilter}
                    >
                        <Text style={styles.clearButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Seleccionar fecha {selectingType === 'inicio' ? 'de inicio' : 'de fin'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Text style={styles.closeButton}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <Calendar
                            onDayPress={handleDateSelect}
                            maxDate={selectingType === 'fin' ? new Date().toISOString().split('T')[0] : undefined}
                            minDate={selectingType === 'fin' && tempFechaInicio ? tempFechaInicio.toISOString().split('T')[0] : undefined}
                            markedDates={{
                                [tempFechaInicio?.toISOString().split('T')[0]]: {
                                    selected: selectingType === 'inicio',
                                    selectedColor: '#2563EB'
                                },
                                [tempFechaFin?.toISOString().split('T')[0]]: {
                                    selected: selectingType === 'fin',
                                    selectedColor: '#2563EB'
                                }
                            }}
                            theme={{
                                todayTextColor: '#2563EB',
                                selectedDayBackgroundColor: '#2563EB',
                                selectedDayTextColor: '#ffffff',
                                arrowColor: '#2563EB',
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    dateSelectorsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    dateSelector: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: '500',
    },
    dateButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    dateButtonText: {
        fontSize: 14,
        textAlign: 'center',
    },
    dateButtonTextSelected: {
        color: '#1F2937',
        fontWeight: '500',
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButton: {
        backgroundColor: '#2563EB',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    clearButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    clearButtonText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    closeButton: {
        fontSize: 24,
        color: '#6B7280',
        fontWeight: '300',
    },
});

export default DateRangeFilter;
