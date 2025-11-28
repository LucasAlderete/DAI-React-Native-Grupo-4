import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calificarAsistencia } from '../../services/calificacionService';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

const CalificarScreen = ({ route, navigation }) => {
    const { asistencia } = route.params || {};
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { darkMode } = useContext(ThemeContext);
    const colors = darkMode ? darkColors : lightColors;
    
    // Colores adicionales con valores por defecto
    const themeColors = {
        ...colors,
        primary: '#2563EB',
        error: '#DC2626',
        disabled: '#9CA3AF',
        cardBackground: colors.card || colors.background,
        inputBackground: colors.card || colors.background,
    };

    // Validar que tenemos la asistencia
    if (!asistencia) {
        const themeColorsError = {
            ...colors,
            error: '#DC2626',
        };
        
        return (
            <View style={[styles.container, { backgroundColor: themeColorsError.background }]}>
                <Text style={[styles.errorText, { color: themeColorsError.error }]}>
                    Error: No se encontró la asistencia
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCalificar = async () => {
        // Validar que se haya seleccionado una calificación
        if (calificacion === 0) {
            Alert.alert('Error', 'Por favor selecciona una calificación de 1 a 5 estrellas');
            return;
        }

        // Validar longitud del comentario (máximo 500 caracteres)
        if (comentario.length > 500) {
            Alert.alert('Error', 'El comentario no puede exceder los 500 caracteres');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await calificarAsistencia(asistencia.id, {
                calificacion,
                comentario: comentario.trim() || undefined,
            });

            Alert.alert(
                '¡Calificación enviada!',
                'Tu calificación ha sido registrada exitosamente.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Volver al historial y refrescar
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Error al enviar la calificación. Por favor intenta nuevamente.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderEstrellas = () => {
        const estrellas = [];
        for (let i = 1; i <= 5; i++) {
            estrellas.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => setCalificacion(i)}
                    style={styles.starButton}
                    disabled={loading}
                >
                    <Ionicons
                        name={i <= calificacion ? 'star' : 'star-outline'}
                        size={48}
                        color={i <= calificacion ? '#FFD700' : '#D1D5DB'}
                    />
                </TouchableOpacity>
            );
        }
        return estrellas;
    };

    const claseNombre = asistencia.clase?.nombre || 'Clase no especificada';
    const sedeNombre = asistencia.clase?.sede?.nombre || 'Sede no especificada';

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: themeColors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButtonHeader}
                    >
                        <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: themeColors.text }]}>
                        Calificar Clase
                    </Text>
                </View>

                {/* Información de la clase */}
                <View style={[styles.infoCard, { backgroundColor: themeColors.cardBackground }]}>
                    <Text style={[styles.claseNombre, { color: themeColors.text }]}>
                        {claseNombre}
                    </Text>
                    <Text style={[styles.sedeNombre, { color: themeColors.textSecondary }]}>
                        {sedeNombre}
                    </Text>
                </View>

                {/* Selector de estrellas */}
                <View style={styles.estrellasContainer}>
                    <Text style={[styles.label, { color: themeColors.text }]}>
                        ¿Cómo calificarías esta clase?
                    </Text>
                    <View style={styles.estrellasRow}>{renderEstrellas()}</View>
                    {calificacion > 0 && (
                        <Text style={[styles.calificacionText, { color: themeColors.textSecondary }]}>
                            {calificacion} {calificacion === 1 ? 'estrella' : 'estrellas'}
                        </Text>
                    )}
                </View>

                {/* Campo de comentario */}
                <View style={styles.comentarioContainer}>
                    <Text style={[styles.label, { color: themeColors.text }]}>
                        Comentario (opcional)
                    </Text>
                    <TextInput
                        style={[
                            styles.comentarioInput,
                            {
                                backgroundColor: themeColors.inputBackground,
                                color: themeColors.text,
                                borderColor: themeColors.border,
                            },
                        ]}
                        placeholder="Escribe tu comentario aquí..."
                        placeholderTextColor={themeColors.textSecondary}
                        multiline
                        numberOfLines={6}
                        maxLength={500}
                        value={comentario}
                        onChangeText={setComentario}
                        editable={!loading}
                    />
                    <Text
                        style={[
                            styles.characterCount,
                            { color: themeColors.textSecondary },
                        ]}
                    >
                        {comentario.length}/500 caracteres
                    </Text>
                </View>

                {/* Botón de enviar */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        {
                            backgroundColor:
                                calificacion === 0 || loading
                                    ? themeColors.disabled
                                    : themeColors.primary,
                        },
                    ]}
                    onPress={handleCalificar}
                    disabled={calificacion === 0 || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Enviar Calificación</Text>
                    )}
                </TouchableOpacity>

                {/* Mensaje de error */}
                {error && (
                    <Text style={[styles.errorText, { color: themeColors.error }]}>
                        {error}
                    </Text>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 24,
        borderBottomWidth: 1,
    },
    backButtonHeader: {
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    claseNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sedeNombre: {
        fontSize: 14,
    },
    estrellasContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    estrellasRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    starButton: {
        marginHorizontal: 8,
    },
    calificacionText: {
        fontSize: 16,
        marginTop: 8,
    },
    comentarioContainer: {
        marginBottom: 24,
    },
    comentarioInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 120,
        marginTop: 8,
    },
    characterCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    backButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 16,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CalificarScreen;

