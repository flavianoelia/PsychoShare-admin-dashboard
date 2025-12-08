const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

// Cache para evitar peticiones duplicadas
const userCache = new Map();

/**
 * Obtiene información de un usuario por su ID
 * Usa cache para evitar peticiones repetidas
 */
export const getUserById = async (userId) => {
  if (!userId) return null;
  
  // Verificar si está en cache
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`Usuario ${userId} no encontrado (${response.status}), usando datos por defecto`);
      // Retornar datos por defecto en vez de null
      const defaultUser = {
        id: userId,
        name: `Usuario`,
        lastName: `#${userId}`,
        email: `user${userId}@example.com`,
        fullName: `Usuario #${userId}`
      };
      userCache.set(userId, defaultUser);
      return defaultUser;
    }

    const userData = await response.json();
    const result = {
      id: userData.id,
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      fullName: `${userData.name} ${userData.lastName}`.trim()
    };

    // Guardar en cache
    userCache.set(userId, result);
    return result;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    // Retornar datos por defecto en caso de error
    const defaultUser = {
      id: userId,
      name: `Usuario`,
      lastName: `#${userId}`,
      email: `user${userId}@example.com`,
      fullName: `Usuario #${userId}`
    };
    userCache.set(userId, defaultUser);
    return defaultUser;
  }
};

/**
 * Obtiene múltiples usuarios en paralelo
 * Útil para cargar todos los usuarios de una lista de reportes/bans
 */
export const getUsersByIds = async (userIds) => {
  if (!userIds || userIds.length === 0) return {};

  // Eliminar duplicados
  const uniqueIds = [...new Set(userIds.filter(id => id))];

  // Obtener todos en paralelo
  const promises = uniqueIds.map(id => getUserById(id));
  const results = await Promise.all(promises);

  // Crear objeto mapeado por ID
  const usersMap = {};
  uniqueIds.forEach((id, index) => {
    if (results[index]) {
      usersMap[id] = results[index];
    }
  });

  return usersMap;
};

/**
 * Limpia el cache de usuarios
 * Útil después de actualizar datos
 */
export const clearUserCache = () => {
  userCache.clear();
};
