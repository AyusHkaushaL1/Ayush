import React, { useState, useEffect, useCallback, FC } from 'react';
import { Download, MoreVertical, Search, Trash2, UserCheck, UserX, Users, CheckCircle, XCircle, KeyRound, Undo, Edit } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface User {
    _id: string;
    name: string;
    email: string;
    provider: 'local' | 'google';
    role: 'admin' | 'customer';
    isEmailVerified: boolean;
    status: 'active' | 'inactive' | 'banned';
    isDeleted: boolean;
    avatar?: string;
    createdAt: string;
}

interface UserStats {
    total: number;
    active: number;
    banned: number;
    softDeleted: number;
}

// --- HELPER & UI COMPONENTS ---

// Reusable Stat Card Component
const StatCard: FC<{ title: string; value: number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center space-x-4">
        <div className="bg-amber-100 text-amber-600 rounded-full p-3">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

// Status Badge Component for color-coding statuses
const StatusBadge: FC<{ status: User['status'] }> = ({ status }) => {
    const styles = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-yellow-100 text-yellow-800',
        banned: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

// Role Badge Component
const RoleBadge: FC<{ role: User['role'] }> = ({ role }) => {
    const styles = {
        admin: 'bg-blue-100 text-blue-800',
        customer: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>;
};

// --- MAIN USER MANAGEMENT PAGE COMPONENT ---

const UserManagementPage: FC = () => {
    const [authToken, setAuthToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);

    // UI states
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState({ role: 'customer' as User['role'], status: 'active' as User['status'] });

    const BASE_URL = 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/admin';

    // --- DATA FETCHING & INITIALIZATION ---

    useEffect(() => {
        const storedCredentials = localStorage.getItem('userCredentials');
        if (storedCredentials) {
            setAuthToken(JSON.parse(storedCredentials).token);
        } else {
            setError("Authentication token not found.");
            setLoading(false);
        }
    }, []);

    const fetchUsersAndStats = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [usersResponse, statsResponse] = await Promise.all([
                fetch(`${BASE_URL}/users`, { headers }),
                fetch(`${BASE_URL}/stats`, { headers }),
            ]);

            if (!usersResponse.ok) throw new Error('Failed to fetch users.');
            if (!statsResponse.ok) throw new Error('Failed to fetch stats.');

            const usersData = await usersResponse.json();
            const statsData = await statsResponse.json();

            setUsers(usersData.users || []);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            fetchUsersAndStats(authToken);
        }
    }, [authToken, fetchUsersAndStats]);

    // --- API ACTION HANDLERS ---

    const handleShowNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const response = await fetch(`${BASE_URL}/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(userForm),
            });
            if (!response.ok) throw new Error('Failed to update user.');
            await fetchUsersAndStats(authToken); // Refetch data
            handleShowNotification('User updated successfully.');
            closeModal();
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to soft-delete this user?')) {
            try {
                const response = await fetch(`${BASE_URL}/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
                if (!response.ok) throw new Error('Failed to delete user.');
                await fetchUsersAndStats(authToken);
                handleShowNotification('User soft-deleted.');
            } catch (err: any) {
                setError(err.message);
            }
        }
    };
    
    const handleRestoreUser = async (userId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/restore`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (!response.ok) throw new Error('Failed to restore user.');
            await fetchUsersAndStats(authToken);
            handleShowNotification('User restored successfully.');
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handleResetPassword = async (userId: string) => {
        if (window.confirm('Are you sure you want to force a password reset for this user?')) {
            try {
                const response = await fetch(`${BASE_URL}/users/${userId}/reset-password`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
                if (!response.ok) throw new Error('Failed to send reset password link.');
                 handleShowNotification('Password reset link sent.');
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const handleExportCsv = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/export`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error('Failed to export CSV.');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            handleShowNotification('User data exported.');
        } catch(err: any) {
            setError(err.message);
        }
    };

    // --- MODAL & FILTER LOGIC ---
    
    const openModal = (user: User) => {
        setSelectedUser(user);
        setUserForm({ role: user.role, status: user.status });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const filteredUsers = users
        .filter(user => showDeleted ? true : !user.isDeleted)
        .filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // --- RENDER ---
    
    if (loading) return <div className="p-6 text-center">Loading user data...</div>;
    if (error && !notification) return <div className="p-6 text-center text-red-600 bg-red-100">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
            {notification && <div className="fixed top-5 right-5 bg-green-100 text-green-800 p-3 rounded-lg shadow-lg z-50">{notification}</div>}

            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats?.total ?? 0} icon={<Users className="h-6 w-6" />} />
                <StatCard title="Active Users" value={stats?.active ?? 0} icon={<UserCheck className="h-6 w-6" />} />
                <StatCard title="Banned Users" value={stats?.banned ?? 0} icon={<UserX className="h-6 w-6" />} />
                <StatCard title="Deleted Users" value={stats?.softDeleted ?? 0} icon={<Trash2 className="h-6 w-6" />} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="rounded text-amber-600" />
                            <span>Show Deleted</span>
                        </label>
                        <button onClick={handleExportCsv} className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Verified</th>
                                <th className="p-4">Provider</th>
                                <th className="p-4">Created On</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className={`border-b hover:bg-gray-50 ${user.isDeleted ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=random`} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><RoleBadge role={user.role} /></td>
                                    <td className="p-4"><StatusBadge status={user.status} /></td>
                                    <td className="p-4">{user.isEmailVerified ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}</td>
                                    <td className="p-4 capitalize">{user.provider}</td>
                                    <td className="p-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-center">
                                       <div className="relative group inline-block">
                                            <button className="p-2 rounded-full hover:bg-gray-200"><MoreVertical className="h-5 w-5"/></button>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block border text-left">
                                                <a href="#" onClick={(e) => {e.preventDefault(); openModal(user)}} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit className="h-4 w-4 mr-2"/>Edit Role/Status</a>
                                                <a href="#" onClick={(e) => {e.preventDefault(); handleResetPassword(user._id)}} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><KeyRound className="h-4 w-4 mr-2"/>Reset Password</a>
                                                {user.isDeleted ? (
                                                     <a href="#" onClick={(e) => {e.preventDefault(); handleRestoreUser(user._id)}} className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"><Undo className="h-4 w-4 mr-2"/>Restore User</a>
                                                ) : (
                                                     <a href="#" onClick={(e) => {e.preventDefault(); handleDeleteUser(user._id)}} className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4 mr-2"/>Delete User</a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {isModalOpen && selectedUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                     <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Edit User: {selectedUser.name}</h3>
                        <div className="space-y-4">
                             <div>
                                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                 <select id="role" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as User['role']})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md">
                                     <option value="customer">Customer</option>
                                     <option value="admin">Admin</option>
                                 </select>
                             </div>
                             <div>
                                 <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                 <select id="status" value={userForm.status} onChange={e => setUserForm({...userForm, status: e.target.value as User['status']})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md">
                                     <option value="active">Active</option>
                                     <option value="inactive">Inactive</option>
                                     <option value="banned">Banned</option>
                                 </select>
                             </div>
                        </div>
                         <div className="flex justify-end space-x-3 pt-4">
                             <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                             <button onClick={handleUpdateUser} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">Save Changes</button>
                         </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default UserManagementPage;

