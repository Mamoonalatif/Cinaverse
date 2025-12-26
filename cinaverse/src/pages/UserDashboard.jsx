import React from 'react';
import { useState, useEffect } from 'react';
import ParentDashboard from './ParentDashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import UserSidebar from '../components/dashboards/UserSidebar';
import ProfileTab from '../components/dashboards/ProfileTab';
import SubscriptionTab from '../components/dashboards/SubscriptionTab';
import SettingsTab from '../components/dashboards/SettingsTab';

// Admin Tabs
import OverviewTab from '../components/dashboards/admin/OverviewTab';
import UserManagementTab from '../components/dashboards/admin/UserManagementTab';
import ReviewModerationTab from '../components/dashboards/admin/ReviewModerationTab';
import WatchlistMonitoringTab from '../components/dashboards/admin/WatchlistMonitoringTab';
import LogsAnalyticsTab from '../components/dashboards/admin/LogsAnalyticsTab';

const UserDashboard = () => {
    const {
        user: contextUser, updateProfile,
        adminGetUsers, adminGetLogs, adminGetWatchlists, adminUpdateUserRole,
        adminDeleteUser, adminGetReviews, adminDeleteReview, adminGetStats
    } = useStore();

    const [user, setUser] = useState(contextUser || { firstName: '', lastName: '', email: '', plan: '', role: 'user' });
    const [activeTab, setActiveTab] = useState(contextUser?.role === 'admin' ? 'overview' : 'profile');
    const [onMount, setOnMount] = useState(false);

    const [adminData, setAdminData] = useState({
        users: [], logs: [], watchlists: [], reviews: [], stats: {}
    });

    const loadAdminData = React.useCallback(async () => {
        try {
            const stats = await adminGetStats().catch(() => ({}));
            setAdminData(prev => ({ ...prev, stats }));

            Promise.all([
                adminGetUsers(), adminGetLogs(), adminGetWatchlists(), adminGetReviews()
            ]).then(([u, l, w, r]) => {
                setAdminData(prev => ({
                    ...prev,
                    users: Array.isArray(u) ? u : [],
                    logs: Array.isArray(l) ? l : [],
                    watchlists: Array.isArray(w) ? w : [],
                    reviews: Array.isArray(r) ? r : []
                }));
            }).catch(() => { });
        } catch { }
    }, [adminGetStats, adminGetUsers, adminGetLogs, adminGetWatchlists, adminGetReviews]);

    useEffect(() => {
        if (contextUser) {
            setUser(contextUser);
            if (contextUser.role === 'admin' && !onMount) {
                loadAdminData();
                setOnMount(true);
            }
        }
    }, [contextUser, loadAdminData, onMount]);

    const handleSaveProfile = React.useCallback(async (formData) => {
        const updated = await updateProfile(formData);
        setUser(prev => ({ ...prev, ...updated }));
    }, [updateProfile]);

    const handleUpdateRole = React.useCallback(async (id, role) => {
        try {
            await adminUpdateUserRole(id, role);
            loadAdminData();
        } catch (e) { alert(e.message); }
    }, [adminUpdateUserRole, loadAdminData]);

    const handleDeleteUser = React.useCallback(async (id) => {
        if (!window.confirm('Delete user?')) return;
        try {
            await adminDeleteUser(id);
            loadAdminData();
        } catch (e) { alert(e.message); }
    }, [adminDeleteUser, loadAdminData]);

    const handleDeleteReview = React.useCallback(async (id) => {
        if (!window.confirm('Delete review?')) return;
        try {
            await adminDeleteReview(id);
            loadAdminData();
        } catch (e) { alert(e.message); }
    }, [adminDeleteReview, loadAdminData]);

    if (user.role === 'parent') return <ParentDashboard />;

    return (
        <div className="bg-black min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1 pb-5 mt-5" style={{ paddingTop: 64 }}>
                <div className="container py-4">
                    <div className="row g-3">
                        <div className="col-lg-3">
                            <UserSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>
                        <div className="col-lg-9">
                            <div className="transition-all duration-300">
                                {activeTab === 'profile' && <ProfileTab user={user} onSave={handleSaveProfile} />}
                                {activeTab === 'subscription' && <SubscriptionTab />}
                                {activeTab === 'settings' && <SettingsTab />}
                                {activeTab === 'overview' && <OverviewTab stats={adminData.stats} />}
                                {activeTab === 'users' && <UserManagementTab users={adminData.users} onUpdateRole={handleUpdateRole} onDeleteUser={handleDeleteUser} />}
                                {activeTab === 'reviews' && <ReviewModerationTab reviews={adminData.reviews} onDeleteReview={handleDeleteReview} />}
                                {activeTab === 'watchlist' && <WatchlistMonitoringTab watchlists={adminData.watchlists} />}
                                {activeTab === 'logs' && <LogsAnalyticsTab logs={adminData.logs} />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};


export default UserDashboard;
