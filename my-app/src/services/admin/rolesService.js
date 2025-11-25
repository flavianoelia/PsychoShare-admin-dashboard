const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

export const rolesService = {

  getAllRoles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Role`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        roles: data
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },


  getUserRole: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Role/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        roleId: data.roleId || data.RoleId,
        roleName: data.roleName || data.RoleName
      };
    } catch (error) {
      console.error('Error fetching user role:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },


  assignRole: async (userId, roleId) => {
    try {
      // Mapeo de roleId: 1 = User, 2 = Admin, 3 = Superadmin
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roleType: parseInt(roleId) })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Rol asignado correctamente',
        data
      };
    } catch (error) {
      console.error('Error assigning role:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
