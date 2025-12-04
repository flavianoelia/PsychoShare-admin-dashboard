
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

      console.log('🔍 Llamando a:', `${API_BASE_URL}/api/Report?${params}`);
      console.log('🔑 Token:', localStorage.getItem('token') ? 'Existe' : 'No existe');

      const response = await fetch(`${API_BASE_URL}/api/Report?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Respuesta del backend:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error completo del backend:', errorText);
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend data to frontend format
      const transformedReports = (data.reports || data.Reports || data || []).map(report => ({
        id: report.Id || report.id,
        reporterUserId: report.ReporterUserId || report.reporterUserId,
        reporterUsername: report.ReporterUsername || report.reporterUsername || report.ReporterEmail || report.reporterEmail || `User_${report.ReporterUserId}`,
        reportedUserId: report.ReportedUserId || report.reportedUserId,
        reportedUsername: report.ReportedUsername || report.reportedUsername || report.ReportedEmail || report.reportedEmail || null,
        reportedEmail: report.ReportedEmail || report.reportedEmail,
        reporterEmail: report.ReporterEmail || report.reporterEmail,
        reason: report.Reason || report.reason,
        contentType: report.ContentType || report.contentType || report.ReportType || report.reportType,
        status: report.Status || report.status,
        createdAt: report.CreatedAt || report.createdAt || report.reportDate,
        resolvedAt: report.ResolvedAt || report.resolvedAt,
        resolvedBy: report.ResolvedBy || report.resolvedBy,
        adminNotes: report.AdminNotes || report.adminNotes,
        description: report.Description || report.description
      }));

      return {
        reports: transformedReports,
        totalCount: data.totalCount || data.TotalCount || transformedReports.length,
        hasMore: data.hasMore || data.HasMore || false
      };
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      
      // Fallback to mock data for testing
      const mockReports = [
        {
          id: 1,
          reporterUsername: "María González",
          reporterEmail: "maria.gonzalez@psychoshare.com",
          reportedUserId: "456",
          reportedUsername: "Juan Pérez",
          reportedEmail: "juan.perez@example.com",
          reason: "Harassment",
          status: "Pending",
          contentType: "Message",
          reportDate: "2024-01-15",
          createdAt: "2024-01-15T10:30:00Z",
          description: "Este usuario ha estado enviando mensajes inapropiados y acosando a otros usuarios en la plataforma."
        },
        {
          id: 2,
          reporterUsername: "Carlos Martínez",
          reporterEmail: "carlos.martinez@psychoshare.com", 
          reportedUserId: "789",
          reportedUsername: "Ana López",
          reportedEmail: "ana.lopez@example.com",
          reason: "Spam",
          status: "Approved",
          contentType: "Post",
          reportDate: "2024-01-14",
          createdAt: "2024-01-14T09:15:00Z",
          resolvedAt: "2024-01-14T15:30:00Z",
          description: "Usuario está publicando contenido repetitivo de spam en múltiples posts.",
          adminNotes: "Usuario ha sido advertido y el contenido removido."
        },
        {
          id: 3,
          reporterUsername: "Laura Fernández",
          reporterEmail: "laura.fernandez@psychoshare.com",
          reportedUserId: "111",
          reportedUsername: "Pedro Sánchez",
          reportedEmail: "pedro.sanchez@example.com", 
          reason: "Fake Profile",
          status: "Pending",
          contentType: "Profile",
          reportDate: "2024-01-16",
          createdAt: "2024-01-16T14:20:00Z",
          description: "Este parece ser un perfil falso suplantando a una celebridad."
        },
        {
          id: 4,
          reporterUsername: "Roberto Díaz",
          reporterEmail: "roberto.diaz@psychoshare.com",
          reportedUserId: "222",
          reportedUsername: "Sofia Torres",
          reportedEmail: "sofia.torres@example.com",
          reason: "Inappropriate Content",
          status: "Rejected",
          contentType: "Comment",
          reportDate: "2024-01-13",
          createdAt: "2024-01-13T16:45:00Z",
          resolvedAt: "2024-01-13T18:20:00Z",
          description: "Usuario publicó comentarios ofensivos en múltiples posts.",
          adminNotes: "Después de revisión, el contenido está dentro de las normas de la comunidad."
        },
        {
          id: 5,
          reporterUsername: "Elena Ruiz",
          reporterEmail: "elena.ruiz@psychoshare.com",
          reportedUserId: "333",
          reportedUsername: "Miguel Ángel Castro",
          reportedEmail: "miguel.castro@example.com",
          reason: "Violence/Threats",
          status: "Approved",
          contentType: "Post",
          reportDate: "2024-01-12",
          createdAt: "2024-01-12T11:20:00Z",
          resolvedAt: "2024-01-12T13:45:00Z",
          description: "Usuario hizo amenazas violentas contra otros miembros de la comunidad.",
          adminNotes: "Cuenta suspendida y contenido removido."
        },
        {
          id: 6,
          reporterUsername: "Lucía Morales",
          reporterEmail: "lucia.morales@psychoshare.com",
          reportedUserId: "444",
          reportedUsername: "Daniela Ramírez",
          reportedEmail: "daniela.ramirez@example.com",
          reason: "Copyright Infringement",
          status: "Pending",
          contentType: "Post",
          reportDate: "2024-01-17",
          createdAt: "2024-01-17T08:30:00Z",
          description: "Usuario está compartiendo material con derechos de autor sin permiso."
        }
      ];

      // Apply filters
      let filteredReports = mockReports;

      // Filter by status
      if (filters.status) {
        filteredReports = filteredReports.filter(report => report.status === filters.status);
      }

      // Filter by content type
      if (filters.contentType) {
        filteredReports = filteredReports.filter(report => report.contentType === filters.contentType);
      }

      // Filter by date range
      if (filters.startDate && filters.endDate) {
        filteredReports = filteredReports.filter(report => {
          const reportDate = new Date(report.createdAt);
          const startDate = new Date(filters.startDate);
          const endDate = new Date(filters.endDate);
          return reportDate >= startDate && reportDate <= endDate;
        });
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredReports = filteredReports.filter(report =>
          report.reporterUsername?.toLowerCase().includes(searchTerm) ||
          report.reportedUsername?.toLowerCase().includes(searchTerm) ||
          report.reason?.toLowerCase().includes(searchTerm) ||
          report.description?.toLowerCase().includes(searchTerm)
        );
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
    const token = localStorage.getItem('token') || 'test-admin-token';
    const response = await fetch(`${API_BASE_URL}/api/Report/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },


  resolveReport: async (id, approved, reason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Report/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test-admin-token'}`
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
    const response = await fetch(`${API_BASE_URL}/api/Report/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || 'test-admin-token'}`
      }
    });
    return response.json();
  }
};