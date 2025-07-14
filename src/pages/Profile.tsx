import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const { user, login, accessToken } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // State for profile form
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    
    // State for password form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ name, avatarUrl }),
            });
            const updatedUser = await response.json();
            if (!response.ok) throw new Error(updatedUser.message || 'Failed to update profile');
            
            // Update user in context
            login(accessToken!, updatedUser.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await fetch('/api/users/me/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to change password');

            setMessage({ type: 'success', text: result.message });
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-600' : ''}`}>
                    Edit Profile
                </button>
                <button onClick={() => setActiveTab('password')} className={`px-4 py-2 ${activeTab === 'password' ? 'border-b-2 border-blue-600' : ''}`}>
                    Change Password
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Avatar URL</label>
                        <input type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Update Profile</button>
                </form>
            )}

            {activeTab === 'password' && (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Old Password</label>
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Change Password</button>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;