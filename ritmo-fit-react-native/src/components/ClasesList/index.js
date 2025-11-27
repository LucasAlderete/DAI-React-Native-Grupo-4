import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getClases } from '../../services/ClasesService';
import '../../config/calendarConfig';
import FilterSelector from './FilterSelector';
import ModalSelector from './ModalSelector';
import CalendarModal from './CalendarModal';
import ClaseCard from './ClaseCard';
import { ThemeContext } from '../../context/ThemeContext';

const ClasesList = ({ navigation }) => {
  const [clases, setClases] = useState([]);
  const [filteredClases, setFilteredClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(null);
  
  const [sedes, setSedes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [fechas, setFechas] = useState([]);
  
  const [sedeModalVisible, setSedeModalVisible] = useState(false);
  const [disciplinaModalVisible, setDisciplinaModalVisible] = useState(false);
  const [fechaModalVisible, setFechaModalVisible] = useState(false);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchClases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedSede, selectedDisciplina, selectedFecha, clases]);

  const fetchClases = async () => {
    try {
      setLoading(true);
      const response = await getClases();
      const clasesData = response.content || [];
      setClases(clasesData);
      extractFilterOptions(clasesData);
      setError(null);
    } catch (err) {
      setError('Error al cargar las clases');
      console.error('Error fetching clases:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (clasesData) => {
    const uniqueSedes = [...new Set(clasesData.map(c => c.sede.nombre))];
    setSedes(uniqueSedes);

    const uniqueDisciplinas = [...new Set(clasesData.map(c => c.disciplina.nombre))];
    setDisciplinas(uniqueDisciplinas);

    const uniqueFechas = [...new Set(clasesData.map(c => {
      const date = new Date(c.fechaInicio);
      return date.toISOString().split('T')[0];
    }))].sort();
    setFechas(uniqueFechas);
  };

  const applyFilters = () => {
    let filtered = [...clases];

    if (selectedSede) {
      filtered = filtered.filter(c => c.sede.nombre === selectedSede);
    }

    if (selectedDisciplina) {
      filtered = filtered.filter(c => c.disciplina.nombre === selectedDisciplina);
    }

    if (selectedFecha) {
      filtered = filtered.filter(c => {
        const claseDate = new Date(c.fechaInicio).toISOString().split('T')[0];
        return claseDate === selectedFecha;
      });
    }

    setFilteredClases(filtered);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${days[date.getDay()]} ${day} ${month}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${dayName} ${day} de ${month} ${hours}:${minutes}hs`;
  };

  const renderClaseCard = ({ item }) => (
    <ClaseCard
      clase={item}
      onPress={() => navigation.navigate('ClaseDetail', { claseId: item.id })}
      formatDate={formatDate}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchClases}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View 
        style={[
          styles.filtersContainer,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          }
        ]}>
        <FilterSelector
          label="Todas las sedes"
          value={selectedSede}
          onPress={() => setSedeModalVisible(true)}
        />
        <FilterSelector
          label="Todas las disciplinas"
          value={selectedDisciplina}
          onPress={() => setDisciplinaModalVisible(true)}
        />
        <FilterSelector
          label="Fecha"
          value={selectedFecha ? formatDateForDisplay(selectedFecha) : null}
          onPress={() => setFechaModalVisible(true)}
        />
      </View>

      <ModalSelector
        visible={sedeModalVisible}
        onClose={() => setSedeModalVisible(false)}
        options={sedes}
        onSelect={setSelectedSede}
        title="Sede"
      />
      
      <ModalSelector
        visible={disciplinaModalVisible}
        onClose={() => setDisciplinaModalVisible(false)}
        options={disciplinas}
        onSelect={setSelectedDisciplina}
        title="Disciplina"
      />
      
      <CalendarModal
        visible={fechaModalVisible}
        onClose={() => setFechaModalVisible(false)}
        selectedDate={selectedFecha}
        onSelectDate={setSelectedFecha}
      />

      <FlatList
        data={filteredClases}
        renderItem={renderClaseCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  listContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClasesList;
