import React from 'react';

const History = ({ historyData, currentPage, totalPages, onPageChange }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Point Claimed</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(historyData) && historyData.length > 0 ? historyData.map((item) => (
                        <tr key={item._id}>
                            <td>{item.userId ? item.userId.name : 'N/A'}</td>
                            <td>{item.pointsClaimed}</td>
                            <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>No history yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button className="btn btn-secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button className="btn btn-secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default History;