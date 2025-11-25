import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/admin/reportsService';
import { getUsersByIds } from '../services/admin/userDataService';

/**
 * Reports data and actions hook
 */
export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [usersData, setUsersData] = useState({});

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getAllReports(currentPage, pageSize, filters);
      const reportsArray = data.reports || data.Reports || data;
      
      // Extraer todos los IDs de usuarios únicos
      const userIds = new Set();
      reportsArray.forEach(report => {
        if (report.reporterUserId) userIds.add(report.reporterUserId);
        if (report.reportedUserId) userIds.add(report.reportedUserId);
      });
      
      // Cargar datos de usuarios en paralelo
      if (userIds.size > 0) {
        const users = await getUsersByIds([...userIds]);
        setUsersData(users);
      }
      
      setReports(reportsArray);
      setTotalCount(data.totalCount || data.TotalCount || 0);
      setHasMore(data.hasMore || data.HasMore || false);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePageChange = useCallback((newPage) => {
    const maxPage = Math.ceil(totalCount / pageSize);
    if (newPage >= 1 && newPage <= maxPage) {
      setCurrentPage(newPage);
    }
  }, [totalCount, pageSize]);

  const handleStatusFilter = useCallback((status) => {
    setFilters(prev => ({ ...prev, status }));
    setCurrentPage(1);
  }, []);

  const handleDateFilter = useCallback((startDate, endDate) => {
    setFilters(prev => ({ ...prev, startDate, endDate }));
    setCurrentPage(1);
  }, []);

  const handleContentTypeFilter = useCallback((contentType) => {
    setFilters(prev => ({ ...prev, contentType }));
    setCurrentPage(1);
  }, []);

  const searchReports = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const resolveReport = useCallback(async (reportId, approved, reason = '') => {
    try {
      await reportsService.resolveReport(reportId, approved, reason);
      await fetchReports(); // Refresh data
      return { success: true };
    } catch (error) {
      const message = approved ? 'Error approving report' : 'Error rejecting report';
      console.error(message, error);
      return { 
        success: false, 
        error: `${message}. Please try again.`
      };
    }
  }, [fetchReports]);

  return {
    // State
    reports,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    hasMore,
    filters,
    usersData,
    
    // Actions
    handlePageChange,
    handleStatusFilter,
    handleDateFilter,
    handleContentTypeFilter,
    searchReports,
    clearFilters,
    resolveReport,
    refetchReports: fetchReports
  };
};