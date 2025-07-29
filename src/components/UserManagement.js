import React, { useState } from 'react';

const UserManagement = ({ users, selectedUserId, onSelectUser, onAddUser, onClaimPoints, loading }) => {
    const [newUserName, setNewUserName] = useState('');

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        if (newUserName.trim()) {
            onAddUser(newUserName.trim());
            setNewUserName('');
        }
    };

    return (
        <div className="card">
            <h2>Select User</h2>
            <div className="user-actions">
                <select value={selectedUserId} onChange={(e) => onSelectUser(e.target.value)} disabled={loading}>
                    <option value="" disabled>-- Select a user --</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <button className="btn" onClick={onClaimPoints} disabled={!selectedUserId || loading}>
                    {loading ? 'Claiming...' : 'Claim Points'}
                </button>
            </div>

            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <form onSubmit={handleAddUserSubmit} className="add-user-form">
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter New User Name"
                    disabled={loading}
                />
                <button type="submit" className="btn btn-secondary" disabled={!newUserName.trim() || loading}>
                    Add User
                </button>
            </form>
        </div>
    );
};

export default UserManagement;