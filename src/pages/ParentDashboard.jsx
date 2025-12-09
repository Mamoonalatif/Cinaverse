import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ParentDashboard = () => {
  const [children] = useState([
    { 
      id: 1, 
      name: 'Emma', 
      age: 8, 
      restrictions: 'PG-13 and below',
      watchTime: '2h 30m',
      lastActive: 'Today',
      avatar: '👧'
    },
    { 
      id: 2, 
      name: 'Lucas', 
      age: 12, 
      restrictions: 'PG-13 and below',
      watchTime: '3h 45m',
      lastActive: 'Yesterday',
      avatar: '👦'
    }
  ]);

  const [recentActivity] = useState([
    { id: 1, child: 'Emma', movie: 'Finding Nemo', action: 'Watched', time: '2 hours ago' },
    { id: 2, child: 'Lucas', movie: 'Spider-Man: Into the Spider-Verse', action: 'Added to Watchlist', time: '5 hours ago' },
    { id: 3, child: 'Emma', movie: 'Moana', action: 'Watched', time: '1 day ago' }
  ]);

  const [weeklyStats] = useState({
    totalWatchTime: '12h 30m',
    averageDaily: '1h 47m',
    moviesWatched: 8,
    genresViewed: ['Animation', 'Family', 'Adventure', 'Comedy']
  });

  return (
    <DashboardLayout userRole="parent" activeSection="overview">
      <div className="container-fluid">
        {/* Overview Stats */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon">👶</div>
              <div className="stat-info">
                <h3>{children.length}</h3>
                <p>Children Accounts</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <h3>{weeklyStats.totalWatchTime}</h3>
                <p>Weekly Watch Time</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon">🎬</div>
              <div className="stat-info">
                <h3>{weeklyStats.moviesWatched}</h3>
                <p>Movies This Week</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{weeklyStats.averageDaily}</h3>
                <p>Average Daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="dashboard-card">
              <div className="card-header">
                <h4 className="card-title mb-0">Children Overview</h4>
                <button className="btn btn-danger">
                  <span className="me-2">➕</span>Add Child Account
                </button>
              </div>
              <div className="row">
                {children.map(child => (
                  <div key={child.id} className="col-lg-6 mb-3">
                    <div className="child-card">
                      <div className="child-header">
                        <div className="child-avatar">{child.avatar}</div>
                        <div className="child-info">
                          <h5>{child.name}</h5>
                          <p className="text-muted">Age: {child.age}</p>
                        </div>
                        <div className="child-actions">
                          <button className="btn btn-sm btn-outline-danger">Settings</button>
                        </div>
                      </div>
                      <div className="child-stats">
                        <div className="stat-item">
                          <span className="stat-label">Restrictions:</span>
                          <span className="stat-value">{child.restrictions}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Watch Time:</span>
                          <span className="stat-value">{child.watchTime}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Last Active:</span>
                          <span className="stat-value">{child.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="dashboard-card">
              <h4 className="card-title">Quick Parental Controls</h4>
              <div className="row">
                <div className="col-lg-4 mb-3">
                  <div className="control-panel">
                    <h6>🕒 Time Limits</h6>
                    <p className="text-muted">Set daily watching limits</p>
                    <button className="btn btn-outline-danger btn-sm">Configure</button>
                  </div>
                </div>
                <div className="col-lg-4 mb-3">
                  <div className="control-panel">
                    <h6>🔞 Content Filters</h6>
                    <p className="text-muted">Age and genre restrictions</p>
                    <button className="btn btn-outline-danger btn-sm">Manage</button>
                  </div>
                </div>
                <div className="col-lg-4 mb-3">
                  <div className="control-panel">
                    <h6>📊 Activity Reports</h6>
                    <p className="text-muted">Weekly viewing reports</p>
                    <button className="btn btn-outline-danger btn-sm">View Reports</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Genre Distribution */}
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title mb-0">Recent Activity</h5>
                <a href="/parent/activity" className="btn btn-sm btn-outline-danger">View All</a>
              </div>
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">🎬</div>
                    <div className="activity-details">
                      <div className="activity-text">
                        <strong>{activity.child}</strong> {activity.action.toLowerCase()} 
                        <em> "{activity.movie}"</em>
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="dashboard-card">
              <h5 className="card-title">Popular Genres This Week</h5>
              <div className="genre-list">
                {weeklyStats.genresViewed.map((genre, index) => (
                  <div key={index} className="genre-item">
                    <span className="genre-name">{genre}</span>
                    <div className="genre-bar">
                      <div 
                        className="genre-progress" 
                        style={{ width: `${100 - (index * 20)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="row">
          <div className="col-12">
            <div className="dashboard-card safety-tips">
              <h5 className="card-title">🛡️ Safety Tips</h5>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <div className="tip-item">
                    <strong>Regular Check-ins:</strong> Review your children's viewing history weekly
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="tip-item">
                    <strong>Age-Appropriate:</strong> Keep content ratings suitable for each child's age
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="tip-item">
                    <strong>Screen Time:</strong> Balance entertainment with other activities
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="tip-item">
                    <strong>Communication:</strong> Discuss movies and shows with your children
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;