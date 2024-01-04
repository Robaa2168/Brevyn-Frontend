import React, { useState } from 'react';
import api from '../../api'; // Make sure to have your API set up for this
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai'; // Importing icons

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await api.post('/api/auth/forgot-password', { email });
    
            // Check for success response (e.g., status code 200)
            if (response.status === 200) {
                navigate("/verification", { state: { email: email } });
            } else {
                // Handle any other status codes or data in the response indicating failure
                setError('Failed to send email. Please try again.');
            }
    
        } catch (error) {
            // If the request itself failed, handle it here
            setError(error.response?.data?.message || 'Failed to send email. Try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-2">Forgot Password</h2>
                    <p className="text-sm text-gray-600">Enter your email address to receive a verification code.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Email address"
                                value={email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            {loading ? 'Sending...' : 'Send Verification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
