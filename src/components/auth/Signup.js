// components/auth/signup.js
import { useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import api from '../../api';
import axios from 'axios';
import { AiOutlineMail, AiOutlineEye, AiOutlinePhone, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

const Signup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        imageUrl: [],
    });


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSignupData({ ...signupData, imageUrl: file });
            setError('');
        } else {
            setError('Please upload a valid image file.');
        }
    };




    const removeImage = (e) => {
        e.preventDefault();
        setSignupData(prevSignupData => ({
            ...prevSignupData,
            imageUrl: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImages = async () => {
        const data = new FormData();
        data.append('file', signupData.imageUrl);
        data.append('upload_preset', 'ml_default');
        data.append('cloud_name', 'dx6jw8k0m');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dx6jw8k0m/image/upload', data);
            return response.data.secure_url; // Return a single URL
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setSignupData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check if passwords match
        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // Upload images first and get URLs
            let profileImageUrl = '';
            if (signupData.imageUrl) {
                profileImageUrl = await uploadImages(signupData.imageUrl);
            }

            const userData = {
                email: signupData.email,
                password: signupData.password,
                phoneNumber: signupData.phoneNumber,
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                profileImage: profileImageUrl,
            };

            // Making API request to the /api/auth/signup route using Axios instance
            const response = await api.post("/api/auth/signup", userData);

            // Check if signup was successful
            if (response.status === 200 || response.status === 201) {
                // Handle success, reset form and navigate to login
                setSignupData({ email: '', password: '', phoneNumber: '', confirmPassword: '' });
                navigate('/login');
            } else {
                // Handle any unexpected outcomes
                throw new Error('Unexpected response from server');
            }

        } catch (error) {
            // Check if it's an error response from the server
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to sign up. Please try again.');
            } else {
                setError(error.message || 'Failed to sign up. Please try again.');
            }
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-xs sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                        Sign Up for an Account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 0 1 1.697 0c.461.486.461 1.211 0 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">

                        <label htmlFor="image" className="block text-emerald-700 text-xs sm:text-sm  font-bold mb-2 w-full">
                            <label htmlFor="image-upload" className="block text-emerald-700 text-xs sm:text-sm  font-bold mb-2 w-full">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="mt-2 block text-xs sm:text-sm  font-medium text-gray-900">
                                        upload profile picture
                                    </span>
                                    <input
                                        ref={fileInputRef} // Attach the ref here
                                        id="image-upload"
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </label>


                        <div className="mt-4 flex flex-wrap justify-start items-center w-full">
                            {signupData.imageUrl instanceof File && (
                                <div className="flex flex-col items-center mr-4 mb-4">
                                    <img src={URL.createObjectURL(signupData.imageUrl)} alt="User Profile" className="w-16 h-16 object-cover rounded-md" />
                                    <button onClick={(e) => removeImage(e)} className="mt-2 text-red-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* First Name Input Field */}
    <div className="mb-2 relative">
        <label htmlFor="first-name" className="sr-only">First Name</label>
        <input
            id="first-name"
            name="firstName"
            type="text"
            required
            className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="First Name"
            value={signupData.firstName}
            onChange={handleInputChange}
        />
    </div>

    {/* Last Name Input Field */}
    <div className="mb-3 relative">
        <label htmlFor="last-name" className="sr-only">Last Name</label>
        <input
            id="last-name"
            name="lastName"
            type="text"
            required
            className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Last Name"
            value={signupData.lastName}
            onChange={handleInputChange}
        />
    </div>
</div>

{/* Email Address Input Field */}
<div className="mb-3 relative">
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
        value={signupData.email}
        onChange={handleInputChange}
    />
</div>

<div className="h-5"></div>
{/* Phone Number Input Field */}
<div className="mb-4 relative">
    <label htmlFor="phone-number" className="sr-only">Phone Number</label>
    <AiOutlinePhone className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
    <input
        id="phone-number"
        name="phoneNumber"
        type="tel"
        autoComplete="tel"
        required
        className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="Phone Number"
        value={signupData.phoneNumber}
        onChange={handleInputChange}
    />
</div>

<div className="h-5"></div>

{/* Password Input Field */}
<div className="mb-4 relative">
    <label htmlFor="password" className="sr-only">Password</label>
    <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
    <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        required
        className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="Password"
        value={signupData.password}
        onChange={handleInputChange}
    />
    <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3 text-emerald-500"
    >
        {showPassword ? <AiOutlineEyeInvisible size="1.25em" /> : <AiOutlineEye size="1.25em" />}
    </button>
</div>
<div className="h-5"></div>

{/* Confirm Password Input Field */}
<div className="mb-4 relative">
    <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
    <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
    <input
        id="confirm-password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        required
        className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="Confirm Password"
        value={signupData.confirmPassword}
        onChange={handleInputChange}
    />
    <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3 text-emerald-500"
    >
        {showPassword ? <AiOutlineEyeInvisible size="1.25em" /> : <AiOutlineEye size="1.25em" />}
    </button>
</div>
</div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm  font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? <FaSpinner className="h-5 w-5 text-white animate-spin" /> : null}
                            </span>
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                    <div class="text-center">
                        <span class="text-xs sm:text-sm  text-gray-600">Already have an account?</span>
                        <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 underline ml-1">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Signup;
