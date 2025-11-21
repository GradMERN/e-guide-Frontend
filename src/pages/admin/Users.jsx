import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/${userId}/role`, { role: newRole });
      setUsers(users.map(u =>
        u._id === userId ? { ...u, role: newRole } : u
      ));
      setEditingUserId(null);
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className="text-white">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white">Manage Users</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg px-4 py-2 flex items-center">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#1B1A17] border border-[#D5B36A]/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#D5B36A]"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="guide">Guide</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D5B36A]/20 bg-[#2c1b0f]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-[#D5B36A]/10 hover:bg-[#2c1b0f]/50 transition-all">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm">
                          {user.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400">{user.age} years old</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-300 text-sm">{user.email}</td>
                    <td className="px-6 py-3 text-gray-300 text-sm">{user.phone}</td>
                    <td className="px-6 py-3 text-gray-300 text-sm">{user.city}, {user.country}</td>
                    <td className="px-6 py-3">
                      {editingUserId === user._id ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => {
                            setSelectedRole(e.target.value);
                            handleChangeRole(user._id, e.target.value);
                          }}
                          className="bg-[#0F0E0C] text-white px-2 py-1 rounded text-sm border border-[#D5B36A]/20"
                        >
                          <option value="">Select role...</option>
                          <option value="user">User</option>
                          <option value="guide">Guide</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                          user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-500' :
                          user.role === 'guide' ? 'bg-green-500/20 text-green-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}
                        onClick={() => {
                          setEditingUserId(user._id);
                          setSelectedRole(user.role);
                        }}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    {searchTerm || roleFilter !== 'all' ? 'No users found' : 'No users yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Guides</p>
          <p className="text-2xl font-bold text-green-500">{users.filter(u => u.role === 'guide').length}</p>
        </div>
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Regular Users</p>
          <p className="text-2xl font-bold text-blue-500">{users.filter(u => u.role === 'user').length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
