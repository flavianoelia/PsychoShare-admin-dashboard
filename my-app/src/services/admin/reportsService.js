
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';

export const reportsService = {

  getAllReports: async (page = 1, size = 10, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/Report?${params}`, {
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
        reports: data.reports || data.Reports || data,
        totalCount: data.totalCount || data.TotalCount || data.length,
        hasMore: data.hasMore || data.HasMore || false
      };
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      
      // Fallback to mock data for testing
      const mockReports = [
        {
          id: 1,
          reporterUsername: "user123",
          reporterEmail: "user123@example.com",
          reportedUserId: "user456",
          reportedUsername: "reported_user",
          reportedEmail: "reported@example.com",
          reason: "Harassment",
          status: "Pending",
          contentType: "Message",
          reportDate: "2024-01-15",
          createdAt: "2024-01-15T10:30:00Z",
          description: "This user has been sending inappropriate messages and harassing other users in the platform."
        },
        {
          id: 2,
          reporterUsername: "moderator1",
          reporterEmail: "mod1@example.com", 
          reportedUserId: "user789",
          reportedUsername: "spam_user",
          reportedEmail: "spam@example.com",
          reason: "Spam",
          status: "Approved",
          contentType: "Post",
          reportDate: "2024-01-14",
          createdAt: "2024-01-14T09:15:00Z",
          resolvedAt: "2024-01-14T15:30:00Z",
          description: "User is posting repetitive spam content across multiple posts.",
          adminNotes: "User has been warned and content removed."
        },
        {
          id: 3,
          reporterUsername: "user999",
          reporterEmail: "user999@example.com",
          reportedUserId: "user111",
          reportedUsername: "fake_profile",
          reportedEmail: "fake@example.com", 
          reason: "Fake Profile",
          status: "Pending",
          contentType: "Profile",
          reportDate: "2024-01-16",
          createdAt: "2024-01-16T14:20:00Z",
          description: "This appears to be a fake profile impersonating a celebrity."
        },
        {
          id: 4,
          reporterUsername: "admin_user",
          reporterEmail: "admin@psychoshare.com",
          reportedUserId: "user222",
          reportedUsername: "offensive_user",
          reportedEmail: "offensive@example.com",
          reason: "Inappropriate Content",
          status: "Rejected",
          contentType: "Comment",
          reportDate: "2024-01-13",
          createdAt: "2024-01-13T16:45:00Z",
          resolvedAt: "2024-01-13T18:20:00Z",
          description: "User posted offensive comments under multiple posts.",
          adminNotes: "After review, content was found to be within community guidelines."
        },
        {
          id: 5,
          reporterUsername: "concerned_user",
          reporterEmail: "concerned@example.com",
          reportedUserId: "user333",
          reportedUsername: "violator_user",
          reportedEmail: "violator@example.com",
          reason: "Violence/Threats",
          status: "Approved",
          contentType: "Post",
          reportDate: "2024-01-12",
          createdAt: "2024-01-12T11:20:00Z",
          resolvedAt: "2024-01-12T13:45:00Z",
          description: "User made violent threats against other community members.",
          adminNotes: "Account suspended and content removed."
        },
        {
          id: 6,
          reporterUsername: "watchful_mod",
          reporterEmail: "watchful@psychoshare.com",
          reportedUserId: "user444",
          reportedUsername: "copyright_violator",
          reportedEmail: "copyright@example.com",
          reason: "Copyright Infringement",
          status: "Pending",
          contentType: "Post",
          reportDate: "2024-01-17",
          createdAt: "2024-01-17T08:30:00Z",
          description: "User is sharing copyrighted material without permission."
        }
      ];

      // Filter by status if provided
      let filteredReports = mockReports;
      if (filters.status) {
        filteredReports = mockReports.filter(report => report.status === filters.status);
      }

      // Simulate pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedReports = filteredReports.slice(startIndex, endIndex);

      return {
        reports: paginatedReports,
        totalCount: filteredReports.length,
        hasMore: endIndex < filteredReports.length
      };
    }
  },


  getReportById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Report/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },


  resolveReport: async (id, approved, reason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/Report/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          approved,
          reason,
          resolvedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        message: data.message || `Report ${approved ? 'approved and action taken' : 'rejected'}`,
        data
      };
    } catch (error) {
      console.warn('API not available, using mock response:', error);
      
      // Simulate API call for testing
      console.log(`Report ${id} ${approved ? 'approved' : 'rejected'} with reason: ${reason}`);
      
      return {
        success: true,
        message: `Report ${approved ? 'approved and action taken' : 'rejected'}`
      };
    }
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