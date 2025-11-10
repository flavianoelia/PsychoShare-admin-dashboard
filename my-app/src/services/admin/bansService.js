
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

export const bansService = {

  banUser: async (banData) => {
    const response = await fetch(`${API_BASE_URL}/Ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(banData)
    });
    return response.json();
  },


  unbanUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/Ban/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  getUserBan: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/Ban/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  getActiveBans: async () => {
    const response = await fetch(`${API_BASE_URL}/Ban/active`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  checkBanStatus: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/Ban/check/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};