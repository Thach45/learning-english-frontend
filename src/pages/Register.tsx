import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister, useSendOtp } from '../hooks/useAuthApi';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const registerMutation = useRegister();
    const sendOtpMutation = useSendOtp();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setError(null);
        try {
            await sendOtpMutation.mutateAsync({ email, type: 'REGISTER' });
        } catch (err: any) {
            setError(err?.message || 'Không gửi được OTP');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await registerMutation.mutateAsync({
                name,
                email,
                password,
                confirmPassword,
                otp,
            });
            navigate('/'); // Redirect to dashboard

        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-6">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Đăng ký</h1>
                    <p className="text-sm text-slate-500">Tạo tài khoản mới để bắt đầu</p>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">Họ tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700">OTP</label>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={!email || sendOtpMutation.isPending}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
                            >
                                {sendOtpMutation.isPending ? 'Đang gửi...' : 'Gửi OTP'}
                            </button>
                        </div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            placeholder="Nhập mã 6 số"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="text-sm text-center text-slate-600">
                    Đã có tài khoản? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage; 