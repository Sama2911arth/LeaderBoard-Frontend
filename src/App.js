import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import History from './components/History';
import UserManagement from './components/UserManagement';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState({ items: [], page: 1, totalPages: 1 });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const fetchAllData = useCallback(async (page = 1) => {
    try {
      const [usersRes, leaderboardRes, historyRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/leaderboard'),
        axios.get(`/api/history?page=${page}&limit=10`)
      ]);

      setUsers(usersRes.data || []);
      if (usersRes.data && usersRes.data.length > 0 && !selectedUserId) {
        setSelectedUserId(usersRes.data[0]._id);
      }

      setLeaderboard(leaderboardRes.data || []);

      setHistory({
        items: historyRes.data?.history || [],
        page: historyRes.data?.currentPage || 1,
        totalPages: historyRes.data?.totalPages || 1
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      setUsers([]);
      setLeaderboard([]);
      setHistory({ items: [], page: 1, totalPages: 1 });
      showNotification('Failed to fetch data. Please refresh.', 'error');
    }
  }, [selectedUserId]);

  const refreshDynamicData = useCallback(async () => {
    try {
      const [leaderboardRes, historyRes] = await Promise.all([
        axios.get('/api/leaderboard'),
        axios.get(`/api/history?page=1&limit=10`)
      ]);
      setLeaderboard(leaderboardRes.data || []);
      setHistory({
        items: historyRes.data?.history || [],
        page: historyRes.data?.currentPage || 1,
        totalPages: historyRes.data?.totalPages || 1
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      showNotification('Failed to refresh data.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddUser = async (userName) => {
    try {
      const res = await axios.post('/api/users', { name: userName });
      const usersRes = await axios.get('/api/users'); // re-fetch users
      setUsers(usersRes.data || []);
      setSelectedUserId(res.data._id);
      showNotification(`User "${userName}" added successfully!`, 'success');
    } catch (err) {
      console.error('Error adding user:', err);
      showNotification(err.response?.data?.message || 'Failed to add user.', 'error');
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUserId) {
      showNotification('Please select a user first.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/claim', { userId: selectedUserId });
      const { updatedUser, pointsClaimed } = res.data;
      showNotification(`Awarded ${pointsClaimed} points to ${updatedUser.name}!`, 'success');
      await refreshDynamicData();
    } catch (err) {
      showNotification('Failed to claim points.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= history.totalPages) {
      fetchAllData(page);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Points Leaderboard</h1>
      </header>

      <Notification message={notification.message} type={notification.type} />

      <main className="main-layout">
        <div className="left-column">
          <UserManagement
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            onAddUser={handleAddUser}
            onClaimPoints={handleClaimPoints}
            loading={loading}
          />
          <div className="card">
            <h2>Claim History</h2>
            <History
              historyData={history.items}
              currentPage={history.page}
              totalPages={history.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h2>Leaderboard</h2>
            <Leaderboard leaderboard={leaderboard} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;