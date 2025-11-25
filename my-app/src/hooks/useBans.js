import { useState, useEffect, useCallback } from 'react';
import { bansService } from '../services/admin/bansService';
import { getUsersByIds } from '../services/admin/userDataService';

/**
 * Bans data and actions hook
 * Single Responsibility: Manages ban-related state and operations
 */
export const useBans = () => {
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [usersData, setUsersData] = useState({});

  const fetchBans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bansService.getAllBans(currentPage, pageSize, filters);
      const bansArray = data.bans || data.Bans || data;
      
      // Extraer todos los IDs de usuarios únicos
      const userIds = new Set();
      bansArray.forEach(ban => {
        if (ban.bannedUserId) userIds.add(ban.bannedUserId);
        if (ban.bannedByAdminId) userIds.add(ban.bannedByAdminId);
      });
      
      // Cargar datos de usuarios en paralelo
      if (userIds.size > 0) {
        const users = await getUsersByIds([...userIds]);
        setUsersData(users);
      }
      
      setBans(bansArray);
      setTotalCount(data.totalCount || data.TotalCount || 0);
      setHasMore(data.hasMore || data.HasMore || false);
    } catch (err) {
      setError('Failed to load banned users');
      console.error('Error fetching bans:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchBans();
  }, [fetchBans]);

  const handlePageChange = useCallback((newPage) => {
    const maxPage = Math.ceil(totalCount / pageSize);
    if (newPage >= 1 && newPage <= maxPage) {
      setCurrentPage(newPage);
    }
  }, [totalCount, pageSize]);

  const handleStatusFilter = useCallback((status, filterType = 'status', value = null) => {
    if (filterType === 'status') {
      setFilters(prev => ({ ...prev, status }));
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const banUser = useCallback(async (banData) => {
    try {
      const result = await bansService.banUser(banData);
      await fetchBans(); // Refresh data
      return { 
        success: true, 
        message: 'User banned successfully',
        data: result 
      };
    } catch (error) {
      console.error('Error banning user:', error);
      return { 
        success: false, 
        error: 'Error banning user. Please try again.'
      };
    }
  }, [fetchBans]);

  const unbanUser = useCallback(async (userId) => {
    try {
      await bansService.unbanUser(userId);
      await fetchBans(); // Refresh data
      return { 
        success: true, 
        message: 'User unbanned successfully' 
      };
    } catch (error) {
      console.error('Error unbanning user:', error);
      return { 
        success: false, 
        error: 'Error unbanning user. Please try again.'
      };
    }
  }, [fetchBans]);

  const getBanDetails = useCallback(async (userId) => {
    try {
      const data = await bansService.getUserBan(userId);
      return { 
        success: true, 
        data 
      };
    } catch (error) {
      console.error('Error fetching ban details:', error);
      return { 
        success: false, 
        error: 'Error fetching ban details.'
      };
    }
  }, []);

  const checkBanStatus = useCallback(async (userId) => {
    try {
      const data = await bansService.checkBanStatus(userId);
      return { 
        success: true, 
        data 
      };
    } catch (error) {
      console.error('Error checking ban status:', error);
      return { 
        success: false, 
        error: 'Error checking ban status.'
      };
    }
  }, []);

  return {
    // State
    bans,
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
    clearFilters,
    banUser,
    unbanUser,
    getBanDetails,
    checkBanStatus,
    refetchBans: fetchBans
  };
};