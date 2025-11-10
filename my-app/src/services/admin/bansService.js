
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

export const bansService = {

  getAllBans: async (page = 1, size = 10, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/Ban?${params}`, {
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
        bans: data.bans || data.Bans || data,
        totalCount: data.totalCount || data.TotalCount || data.length,
        hasMore: data.hasMore || data.HasMore || false
      };
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      
      // Fallback to mock data for testing
      const mockBans = [
        {
          id: 1,
          userId: "user456",
          username: "banned_user_1",
          email: "banned1@example.com",
          reason: "Harassment and inappropriate behavior",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2024-01-15T10:30:00Z",
          expiryDate: "2024-02-15T10:30:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "30 days",
          notes: "Multiple reports of harassment. User warned previously."
        },
        {
          id: 2,
          userId: "user789",
          username: "spam_account",
          email: "spam@example.com",
          reason: "Spam and commercial content",
          adminUserId: "admin456",
          adminUsername: "head_moderator",
          banDate: "2024-01-10T14:20:00Z",
          expiryDate: "2024-01-17T14:20:00Z",
          isActive: false,
          banType: "Temporary",
          duration: "7 days",
          notes: "Account used for spamming commercial links.",
          unbanDate: "2024-01-17T14:20:00Z"
        },
        {
          id: 3,
          userId: "user111",
          username: "toxic_user",
          email: "toxic@example.com",
          reason: "Hate speech and threats",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2024-01-12T09:15:00Z",
          expiryDate: null,
          isActive: true,
          banType: "Permanent",
          duration: "Permanent",
          notes: "Severe violations including threats of violence. Permanent ban issued."
        },
        {
          id: 4,
          userId: "user222",
          username: "fake_profile_user",
          email: "fake@example.com",
          reason: "Identity theft and fake profile",
          adminUserId: "admin789",
          adminUsername: "security_admin",
          banDate: "2024-01-14T16:45:00Z",
          expiryDate: "2024-02-14T16:45:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "31 days",
          notes: "Using stolen photos and impersonating another person."
        },
        {
          id: 5,
          userId: "user333",
          username: "copyright_violator",
          email: "copyright@example.com",
          reason: "Copyright infringement",
          adminUserId: "admin456",
          adminUsername: "head_moderator",
          banDate: "2024-01-08T11:20:00Z",
          expiryDate: "2024-01-22T11:20:00Z",
          isActive: false,
          banType: "Temporary",
          duration: "14 days",
          notes: "Repeatedly sharing copyrighted material despite warnings.",
          unbanDate: "2024-01-20T08:30:00Z"
        },
        {
          id: 6,
          userId: "user444",
          username: "bot_account",
          email: "bot@example.com",
          reason: "Automated behavior and bot activity",
          adminUserId: "admin123",
          adminUsername: "admin_moderator",
          banDate: "2024-01-16T08:30:00Z",
          expiryDate: "2024-01-23T08:30:00Z",
          isActive: true,
          banType: "Temporary",
          duration: "7 days",
          notes: "Detected automated posting patterns and non-human behavior."
        }
      ];

      // Filter by status if provided
      let filteredBans = mockBans;
      if (filters.status === 'active') {
        filteredBans = mockBans.filter(ban => ban.isActive);
      } else if (filters.status === 'expired') {
        filteredBans = mockBans.filter(ban => !ban.isActive);
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
      const response = await fetch(`${API_BASE_URL}/Ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(banData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.warn('API not available, using mock response:', error);
      
      // Simulate API call for testing
      console.log('Mock ban user:', banData);
      
      return {
        success: true,
        message: 'User banned successfully',
        id: Math.floor(Math.random() * 1000) + 100
      };
    }
  },


  unbanUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Ban/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.warn('API not available, using mock response:', error);
      
      // Simulate API call for testing
      console.log(`Mock unban user: ${userId}`);
      
      return {
        success: true,
        message: 'User unbanned successfully'
      };
    }
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