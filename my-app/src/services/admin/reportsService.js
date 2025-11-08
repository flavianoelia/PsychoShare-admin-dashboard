
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7096';

export const reportsService = {

  getAllReports: async () => {
    const response = await fetch(`${API_BASE_URL}/Report`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  getReportById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Report/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  resolveReport: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Report/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  deleteReport: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Report/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};