import { useState, useEffect } from 'react';
import api from '../../api';
import { useUser } from '../context';
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineInfoCircle, AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai'; // Importing icons
import { FaSpinner } from 'react-icons/fa';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const getFingerprint = async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    } catch (error) {
      console.error("Error obtaining fingerprint:", error);
      // Handle the error as per your application's needs
      // For example, you can return a default value or null
      return null;
    }
  };

const Login = () => {
    const { login, logout } = useUser();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        logout();
    }, [logout]);


    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const fingerprintId = await getFingerprint();
            
            const loginDataWithFingerprint = { ...loginData, fingerprintId };
    
            const response = await api.post('/api/auth/login', loginDataWithFingerprint);
    
            if (response.status === 200) {
                const user = response.data;
                login(user); // Assuming login is a function that handles setting user session
                navigate('/dashboard');
            } else {
                setError('Login failed due to unexpected response. Please try again later.');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Assuming the backend indicates phone verification is needed in the message
                if (error.response.data.message.includes('Phone verification needed')) {
                    // Extract the token and phone number from the response
                    const { token, phoneNumber } = error.response.data;
    
                    // Navigate to phone verification page, passing necessary state
                    navigate('/phone-verify', { state: { phoneNumber: phoneNumber, token: token } });
                } else {
                    // If it's a different 403 error (e.g., email verification needed)
                    navigate('/verify', { state: { email: loginData.email, token: error.response.data.token } });
                }
            } else {
                setError(error.response?.data?.message || 'Login failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                  {/* Message about viewing sub-portal */}
                  <div className="bg-gray-200 border border-gray-400 text-gray-700 px-4 py-3 rounded relative mb-4 text-center">
                    <AiOutlineInfoCircle className="inline-block text-emerald-500 mr-2" size="1.25em" />
                    <span className="text-xs sm:text-sm">You are now viewing a wallet-portal of Verdant Charity. To learn more about us, </span>
                    <a href="https://donations.verdantcharity.org/learn-more" className="font-medium text-emerald-600 hover:text-emerald-500 underline ml-1 text-xs sm:text-sm">click here</a>.
                </div>
                    {/* Centered small image */}
    <div className="flex justify-center">
        <img src="https://cdn-icons-png.flaticon.com/512/8910/8910788.png" alt="Login Icon" className="w-24 h-auto mb-1" /> {/* Adjust the w-24 class as needed for your image size */}
    </div>
                <div className="text-center">
                    <h2 className="text-xs sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Sign in to your account</h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg className="fill-current h-6 w-6 text-red-500" role="img" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 0 1 1.697 0c.461.486.461 1.211 0 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                            </span>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Email address"
                                value={loginData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="text-xs sm:text-sm block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs sm:text-sm">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-emerald-500" size="1.25em" />
                                ) : (
                                    <AiOutlineEye className="text-emerald-500" size="1.25em" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 text-xs sm:text-sm">Forgot your password?</Link>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? <FaSpinner className="h-5 w-5 text-white animate-spin" /> : null}
                            </span>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-xs sm:text-sm text-gray-600">Don't have an account?</span>
                        <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500 underline ml-1 text-xs sm:text-sm">Create new account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
