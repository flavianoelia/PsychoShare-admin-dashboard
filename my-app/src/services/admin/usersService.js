
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

export const usersService = {

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/User/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  editUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/api/User/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },


  checkEmail: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/User/check-email?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};