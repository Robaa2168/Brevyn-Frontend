import React, { useState, useEffect } from 'react';
import api from '../../api'; // Update with your actual api path
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Lottie from 'lottie-react'; // Make sure to install and import Lottie
import successAnimation from "../lottie/success-animation.json";
import successConfetti from '../lottie/success-confetti.json';

const ResetPassword = () => {
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Retrieve email from state passed down through navigation
        setEmail(location.state?.email);
    }, [location.state]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Ensure passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Implement API call for password reset
        try {
            const response = await api.post('/api/auth/reset-password', {
                email: email,
                newPassword: passwordData.newPassword,
            });

            if (response.status === 200) {
                setSuccess(true);
            } else {
                setError('Failed to reset password. Try again later.');
            }
        } catch (error) {
            setError('Failed to reset password. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
                {success ? (
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        {/* Success Animations */}
                        <div className="relative w-full h-64 md:h-96">
                            {/* Confetti Animation */}
                            <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                            {/* Tick Animation */}
                            <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                        </div>
                        {/* Success Message */}
                        <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Password Changed Successfully!</p>
    
                        <button onClick={() => navigate('/login')} className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10">
                            Done
                        </button>
    
                    </div>
                ) : (
    
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-2">Reset Your Password</h2>
                        </div>
    
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error!</strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
    
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div className="mb-4 relative">
                                    <label htmlFor="password" className="sr-only">New Password</label>
                                    <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="New password"
                                        value={passwordData.newPassword}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm">
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible className="text-emerald-500" size="1.25em" />
                                        ) : (
                                            <AiOutlineEye className="text-emerald-500" size="1.25em" />
                                        )}
                                    </button>
                                </div>
    
                                <div className="mb-4 relative">
                                    <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                                    <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
    
                            <div>
                                <button type="submit" disabled={loading} className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
    
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default ResetPassword;
