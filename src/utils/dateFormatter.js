/**
 * Utilidades para formatear fechas
 */

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} fechaString - Fecha a formatear
 * @param {object} opciones - Opciones de formato (opcional)
 * @returns {string} Fecha formateada o mensaje de error
 */
export const formatearFecha = (fechaString, opciones = null) => {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fecha = new Date(fechaString);
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      console.warn('Fecha inválida:', fechaString);
      return 'Fecha no disponible';
    }
    
    const opcionesDefault = opciones || {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return fecha.toLocaleDateString('es-AR', opcionesDefault);
  } catch (error) {
    console.error('Error al formatear fecha:', error, fechaString);
    return 'Fecha no disponible';
  }
};

/**
 * Formatea una fecha de forma extendida
 * @param {string|Date} fechaString - Fecha a formatear
 * @returns {string} Fecha formateada o mensaje de error
 */
export const formatearFechaLarga = (fechaString) => {
  return formatearFecha(fechaString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea una fecha de forma corta (solo fecha, sin hora)
 * @param {string|Date} fechaString - Fecha a formatear
 * @returns {string} Fecha formateada o mensaje de error
 */
export const formatearFechaCorta = (fechaString) => {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fecha = new Date(fechaString);
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      return 'Fecha no disponible';
    }
    
    return fecha.toLocaleDateString('es-AR');
  } catch (error) {
    console.error('Error al formatear fecha:', error, fechaString);
    return 'Fecha no disponible';
  }
};

/**
 * Verifica si una fecha ya pasó
 * @param {string|Date} fechaString - Fecha a verificar
 * @returns {boolean} true si la fecha ya pasó, false en caso contrario
 */
export const esFechaPasada = (fechaString) => {
  if (!fechaString) return false;
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return false;
    
    const ahora = new Date();
    return fecha < ahora;
  } catch (error) {
    console.error('Error al verificar fecha:', error);
    return false;
  }
};

/**
 * Verifica si una fecha es válida
 * @param {string|Date} fechaString - Fecha a verificar
 * @returns {boolean} true si la fecha es válida, false en caso contrario
 */
export const esFechaValida = (fechaString) => {
  if (!fechaString) return false;
  
  try {
    const fecha = new Date(fechaString);
    return !isNaN(fecha.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Extrae solo la hora de una fecha
 * @param {string|Date} fechaString - Fecha de la que extraer la hora
 * @returns {string} Hora formateada (HH:MM) o mensaje de error
 */
export const extraerHora = (fechaString) => {
  if (!fechaString) return '';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return '';
    
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error al extraer hora:', error);
    return '';
  }
};

