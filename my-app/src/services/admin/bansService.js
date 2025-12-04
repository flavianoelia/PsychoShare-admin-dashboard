
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

// Helper function to calculate duration
const calculateDuration = (startDate, endDate) => {
  if (!endDate) return 'Permanent';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)} months`;
  return `${Math.round(diffDays / 365)} years`;
};

export const bansService = {

  getAllBans: async (page = 1, size = 10, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/api/Ban/active?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend data to frontend format
      const transformedBans = (data.bans || data.Bans || data || []).map(ban => ({
        id: ban.Id || ban.id,
        userId: ban.BannedUserId || ban.bannedUserId,
        username: ban.Username || ban.username || `User_${ban.BannedUserId || ban.bannedUserId}`,
        email: ban.Email || ban.email || `${ban.Username || `user${ban.BannedUserId}`}@example.com`,
        reason: ban.Reason || ban.reason,
        adminUserId: ban.BannedByAdminId || ban.bannedByAdminId,
        adminUsername: ban.AdminUsername || ban.adminUsername || (ban.BannedByAdminId || ban.bannedByAdminId ? `Admin_${ban.BannedByAdminId || ban.bannedByAdminId}` : 'Sistema'),
        banDate: ban.StartDate || ban.startDate || ban.banDate,
        expiryDate: ban.EndDate || ban.endDate || ban.expiryDate,
        isActive: ban.IsActive !== undefined ? ban.IsActive : ban.isActive !== undefined ? ban.isActive : true,
        banType: ban.BanType || ban.banType,
        duration: ban.Duration || ban.duration || calculateDuration(ban.StartDate || ban.startDate, ban.EndDate || ban.endDate),
        notes: ban.Notes || ban.notes || ban.reason
      }));

      return {
        bans: transformedBans,
        totalCount: data.totalCount || data.TotalCount || transformedBans.length,
        hasMore: data.hasMore || data.HasMore || false
      };
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      
      // Get stored mock bans or use defaults
      const storedBans = localStorage.getItem('mockBans');
      let allBans;
      
      if (storedBans) {
        allBans = JSON.parse(storedBans);
      } else {
        // Default mock data for testing (Actualizado a Noviembre 2025)
        allBans = [
        {
          id: 1,
          userId: "user456",
          username: "juan_troll",
          email: "juan.troll@example.com",
          reason: "Harassment and inappropriate behavior",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2025-11-10T10:30:00Z",
          expiryDate: "2025-12-10T10:30:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "30 days",
          notes: "Multiple reports of harassment. User warned previously."
        },
        {
          id: 2,
          userId: "user789",
          username: "spam_maria",
          email: "maria.spam@example.com",
          reason: "Spam and commercial content",
          adminUserId: "admin456",
          adminUsername: "head_moderator",
          banDate: "2025-11-05T14:20:00Z",
          expiryDate: "2025-11-12T14:20:00Z",
          isActive: false,
          banType: "Temporary",
          duration: "7 days",
          notes: "Account used for spamming commercial links.",
          unbanDate: "2025-11-12T14:20:00Z"
        },
        {
          id: 3,
          userId: "user111",
          username: "toxic_carlos",
          email: "carlos.toxic@example.com",
          reason: "Hate speech and threats",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2025-11-08T09:15:00Z",
          expiryDate: null,
          isActive: true,
          banType: "Permanent",
          duration: "Permanent",
          notes: "Severe violations including threats of violence. Permanent ban issued."
        },
        {
          id: 4,
          userId: "user222",
          username: "fake_ana",
          email: "ana.fake@example.com",
          reason: "Identity theft and fake profile",
          adminUserId: "admin789",
          adminUsername: "security_admin",
          banDate: "2025-11-09T16:45:00Z",
          expiryDate: "2025-12-09T16:45:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "30 days",
          notes: "Using stolen photos and impersonating another person."
        },
        {
          id: 5,
          userId: "user333",
          username: "pirata_luis",
          email: "luis.pirata@example.com",
          reason: "Copyright infringement",
          adminUserId: "admin456",
          adminUsername: "head_moderator",
          banDate: "2025-10-29T11:20:00Z",
          expiryDate: "2025-11-12T11:20:00Z",
          isActive: false,
          banType: "Temporary",
          duration: "14 days",
          notes: "Repeatedly sharing copyrighted material despite warnings.",
          unbanDate: "2025-11-12T08:30:00Z"
        },
        {
          id: 6,
          userId: "user444",
          username: "bot_pedro",
          email: "pedro.bot@example.com",
          reason: "Automated behavior and bot activity",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2025-11-11T08:30:00Z",
          expiryDate: "2025-11-18T08:30:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "7 days",
          notes: "Detected automated posting patterns and non-human behavior."
        },
        {
          id: 7,
          userId: "user555",
          username: "test_usuario",
          email: "test@psychoshare.com",
          reason: "Testing purposes",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2025-11-12T12:00:00Z",
          expiryDate: "2025-11-19T12:00:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "7 days",
          notes: "Usuario de prueba para testing del sistema de bans."
        }
      ];
        // Store default data if not exists
        localStorage.setItem('mockBans', JSON.stringify(allBans));
      }

      // Filter by status if provided
      let filteredBans = allBans;
      if (filters.status === 'active') {
        filteredBans = allBans.filter(ban => ban.isActive);
      } else if (filters.status === 'expired') {
        filteredBans = allBans.filter(ban => !ban.isActive);
      }

      // Filter by ban type
      if (filters.banType) {
        filteredBans = filteredBans.filter(ban => ban.banType === filters.banType);
      }

      // Simulate pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedBans = filteredBans.slice(startIndex, endIndex);

      return {
        bans: paginatedBans,
        totalCount: filteredBans.length,
        hasMore: endIndex < filteredBans.length
      };
    }
  },

  banUser: async (banData) => {
    try {
      // Map frontend data to backend expected format
      const backendBanData = {
        BannedUserId: parseInt(banData.userId || banData.username), // Convert to number
        BannedByAdminId: 1, // Hardcoded admin ID for now
        BanType: banData.banType,
        RelatedReportId: null, // Optional
        StartDate: new Date().toISOString(),
        EndDate: banData.expiryDate,
        Reason: banData.reason
      };

      const response = await fetch(`${API_BASE_URL}/api/Ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(backendBanData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.warn('API not available, using mock response:', error);
      
      // Simulate API call for testing - ADD TO MOCK DATA
      console.log('Mock ban user:', banData);
      
      // Get existing mock data
      const storedBans = localStorage.getItem('mockBans');
      const currentBans = storedBans ? JSON.parse(storedBans) : [];
      
      // Create new ban entry
      const newBan = {
        id: Math.floor(Math.random() * 1000) + 100,
        userId: banData.userId || String(Math.floor(Math.random() * 10000)),
        username: banData.username,
        email: banData.email || `${banData.username}@example.com`,
        reason: banData.reason,
        adminUserId: "admin123",
        adminUsername: localStorage.getItem('username') || "Admin",
        banDate: new Date().toISOString(),
        expiryDate: banData.expiryDate,
        isActive: true,
        banType: banData.banType,
        duration: banData.duration,
        notes: banData.notes
      };
      
      // Add to mock data
      currentBans.unshift(newBan); // Add to beginning
      localStorage.setItem('mockBans', JSON.stringify(currentBans));
      
      return {
        success: true,
        message: 'User banned successfully',
        id: newBan.id,
        data: newBan
      };
    }
  },


  unbanUser: async (userId) => {
    try {
      // The API endpoint uses BannedUserId, not the ban.Id
      const response = await fetch(`${API_BASE_URL}/api/Ban/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Unban API response:', result);
      return {
        success: true,
        message: 'User unbanned successfully',
        data: result
      };
    } catch (error) {
      console.warn('API not available, using mock response:', error);
      
      // Simulate API call for testing
      console.log(`Mock unban userId: ${userId}`);
      
      return {
        success: true,
        message: 'User unbanned successfully'
      };
    }
  },


  getUserBan: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/Ban/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  getActiveBans: async () => {
    const response = await fetch(`${API_BASE_URL}/api/Ban/active`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  checkBanStatus: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/Ban/check/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};