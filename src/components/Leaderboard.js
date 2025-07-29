import React from 'react';

const Leaderboard = ({ leaderboard }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(leaderboard) && leaderboard.map((user) => (
                    <tr key={user._id}>
                        <td className="rank">{user.rank}</td>
                        <td>{user.name}</td>
                        <td>{user.totalPoints}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Leaderboard;