'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useCurrentUser } from '../../utils/useCurrentUser';
import { toast } from 'react-hot-toast';

const PERMISSIONS = {
    'Operations': [
        { id: 'inspections.manage', label: 'Inspections' },
        { id: 'auctions.manage', label: 'Auctions' },
        { id: 'dealers.manage', label: 'Dealers' },
        { id: 'listings.manage', label: 'Listings' },
        { id: 'workshop.manage', label: 'Workshop' },
    ],
    'CRM': [
        { id: 'customers.manage', label: 'Customers' },
        { id: 'insurance.manage', label: 'Insurance' },
        { id: 'sell_requests.manage', label: 'Sell Requests' },
        { id: 'test_drives.manage', label: 'Test Drives' },
    ],
    'Content': [
        { id: 'blogs.manage', label: 'Blogs' },
        { id: 'videos.manage', label: 'Videos' },
        { id: 'testimonials.manage', label: 'Testimonials' },
    ],
    'HR': [
        { id: 'careers.manage', label: 'Manage Jobs & Applications' },
    ],
    'Analysis': [
        { id: 'dashboard.view', label: 'Dashboard Analysis' },
    ]
};

export default function UsersPage() {
    const { user: currentUser } = useCurrentUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        permissions: [],
        isActive: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/users`, { withCredentials: true });
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Leave empty unless changing
                role: user.role,
                permissions: user.permissions || [],
                isActive: user.isActive
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'employee',
                permissions: [],
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                // Update
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Don't send empty password
                
                await axios.put(`${API_URL}/api/users/${editingUser._id}`, payload, { withCredentials: true });
                toast.success('User updated successfully');
            } else {
                // Create
                if (!formData.password) return toast.error('Password is required for new users');
                await axios.post(`${API_URL}/api/users`, formData, { withCredentials: true });
                toast.success('User created successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/api/users/${id}`, { withCredentials: true });
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const togglePermission = (permId) => {
        setFormData(prev => {
            const current = prev.permissions;
            if (current.includes(permId)) {
                return { ...prev, permissions: current.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...current, permId] };
            }
        });
    };

    if (loading) return <div className="text-white p-8">Loading users...</div>;

    return (
        <div className="min-h-screen bg-custom-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-custom-accent hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        + Add Employee
                    </button>
                </div>

                <div className="bg-custom-jet border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-white/5 text-xs uppercase font-medium text-gray-400">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.name || 'No Name'}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        {currentUser?._id !== user._id && (
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium ml-4"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-custom-jet w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">
                                {editingUser ? 'Edit User' : 'Create New Employee'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-custom-accent outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email (Login ID)</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-custom-accent outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">
                                        {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-custom-accent outline-none"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        placeholder={editingUser ? "••••••" : "Enter secure password"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select 
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-custom-accent outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin (Full Access)</option>
                                    </select>
                                </div>
                                <div className="flex items-center mt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isActive}
                                            onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                            className="w-4 h-4 rounded border-gray-300 text-custom-accent focus:ring-custom-accent"
                                        />
                                        <span className="ml-2 text-white">Account Active</span>
                                    </label>
                                </div>
                            </div>

                            {formData.role === 'employee' && (
                                <div className="mt-6 border-t border-white/10 pt-6">
                                    <h3 className="text-white font-semibold mb-4">Assign Permissions</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {Object.entries(PERMISSIONS).map(([category, perms]) => (
                                            <div key={category} className="bg-white/5 p-4 rounded-lg">
                                                <h4 className="text-gray-400 text-xs uppercase font-bold mb-3">{category}</h4>
                                                <div className="space-y-2">
                                                    {perms.map(perm => (
                                                        <label key={perm.id} className="flex items-center cursor-pointer group">
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 transition-colors ${
                                                                formData.permissions.includes(perm.id) 
                                                                    ? 'bg-custom-accent border-custom-accent' 
                                                                    : 'border-gray-500 group-hover:border-gray-300'
                                                            }`}>
                                                                {formData.permissions.includes(perm.id) && (
                                                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <input 
                                                                type="checkbox" 
                                                                className="hidden"
                                                                checked={formData.permissions.includes(perm.id)}
                                                                onChange={() => togglePermission(perm.id)}
                                                            />
                                                            <span className={`text-sm ${
                                                                formData.permissions.includes(perm.id) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                                                            }`}>
                                                                {perm.label}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end space-x-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="bg-custom-accent hover:bg-yellow-400 text-black px-6 py-2 rounded font-bold transition-colors"
                            >
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
