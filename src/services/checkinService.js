import api from './api';

const checkinService = {
  /**
   * Realiza el check-in escaneando un QR del gimnasio
   * @param {number} claseId - ID de la clase extraído del QR
   * @returns {Promise} - Datos de la asistencia creada
   */
  realizarCheckin: async (claseId) => {
    try {
      const response = await api.post('/asistencias/checkin', { claseId });
      return response.data;
    } catch (error) {
      // Re-lanzar el error para que lo maneje QRScannerScreen
      throw error;
    }
  },
};

export default checkinService;
