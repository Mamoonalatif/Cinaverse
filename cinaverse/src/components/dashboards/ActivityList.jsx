import React from 'react';

const ActivityList = ({ items }) => {
  if (!items || !items.length) {
    return <p className="text-muted">No activity yet.</p>;
  }
  return (
    <ul className="activity-list">
      {items.map((log, idx) => (
        <li key={idx} className="activity-item">
          <div className="activity-dot">•</div>
          <div>
            <div className="activity-text">{log.action || log.message || 'Activity'}</div>
            <small className="text-muted">{log.createdAt || log.created_at || log.timestamp || ''}</small>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityList;
