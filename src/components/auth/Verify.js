import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from '../lottie/success-animation.json'; // Ensure this path is correct
import successConfetti from '../lottie/success-confetti.json';


const Verify = () => {
    const locationState = useLocation();
    const initialCodeState = Array(6).fill('');
    const [code, setCode] = useState(initialCodeState);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (locationState.state?.email) {
            setEmail(locationState.state.email);
            setMessage(`A verification code has been sent to ${locationState.state.email}. Please check your inbox and spam folder.`);
        } else {
            setError("No email address found. Please try again.");
        }
    }, [locationState.state]);

    useEffect(() => {
        let interval = null;
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timeLeft]);

  
    
    useEffect(() => {
        const fullCode = code.join('');
        if (fullCode.length === 6 && code.every(digit => /^[0-9]$/.test(digit))) {
            handleVerify();
        }
    }, [code]);
    
    const handleInputChange = (index) => (event) => {
        const newCode = [...code];
        const value = event.target.value;
    
        if (/^[0-9]$/.test(value) || value === '') {
            newCode[index] = value;
            setCode(newCode);
    
            // Move focus forward only if a digit is entered, not when deleted
            if (value && index < code.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };
    
    const handleKeyDown = (index) => (event) => {
        if (event.key === 'Backspace') {
            // Adjust for backspace handling to allow re-entering a digit
            if (code[index]) {
                // If current field has a digit, clear it and stay focused on the same field
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
                inputRefs.current[index].focus(); // Focus on the current field
            } else if (index > 0 && !code[index]) {
                // Move focus back only if the current field is already empty
                inputRefs.current[index - 1].focus();
            }
            event.preventDefault(); // Prevent the default backspace behavior
        }
    };
    
    

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        setMessage('');
    
        const fullCode = code.join('');
    
        // Only proceed if all digits have been entered
        if (fullCode.length === 6) {
            try {
                const verifyResponse = await api.post('/api/auth/verify-first-time-user', { email, verificationCode: fullCode });
                
                // Check for a successful verification response
                if (verifyResponse.status === 200) {
                    // Set success state to true here (assuming you have a setSuccess method)
                    setSuccess(true);
    
                    // Set a success message (optional)
                    setMessage('Verification successful. You will be redirected to login shortly.');
    
                    // Navigate to login page after 5 seconds
                    setTimeout(() => {
                        navigate('/login')
                    }, 5000);
                } else {
                    setCode(initialCodeState);
                    // Set an error message if the verification response status is not successful
                    setError('Verification failed. Please try again or resend the code.');
                }
                
            } catch (error) {
                setCode(initialCodeState);
                // Handle errors more specifically based on the type of error or response
                if (error.response && error.response.data && error.response.data.message) {
                    // If there's a specific error message from the server, display it
                    setError(` ${error.response.data.message}. Resend code.`);
                } else {
                    // For network errors or other unexpected issues
                    setError('Verification failed. Please check your connection and try again.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            // Handle case where not all code digits have been entered
            setError('Please enter all the digits of the verification code.');
            setLoading(false);
        }
    };
    
    
    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setMessage('Sending a new code...');
    
        try {
            const dataToSend = email;
            const response = await api.post('/api/auth/resend-verification-code', { dataToSend });
          if (response.status === 200) {
            // Successful response
            setMessage(`A new verification code has been sent to ${email}. Please check your inbox and spam folder.`);
            setTimeLeft(60); // Start the countdown again
          } else {
            // This else block might not be necessary if you're catching errors in the catch block,
            // but it's here for completeness in case of non-200 success codes that aren't caught as errors.
            setMessage('');
            setError('Failed to resend code. Please try again later.');
          }
        } catch (error) {
            setMessage('');
    
            // Extracting the specific error message from the response, if available
            const specificErrorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to resend code. Please try again later.';
    
            // Use the specific error message
            setError(specificErrorMessage);
        } finally {
          setLoading(false);
        }
    };
    

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center w-full p-4">
                <Confetti />
                <Lottie animationData={successConfetti} style={{ width: 200, height: 200 }} />
                <Lottie animationData={successAnimation} style={{ width: 200, height: 200 }} />
                <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Verification Successful!</p>
                <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 rounded bg-emerald-500 text-white">
                    Done
                </button>
            </div>
        );
    }

   
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-2">Email Verification Code</h2>
                    {message && <div className="bg-green-100 border border-green-400 text-green-700 text-xs px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
                    {error && (
                        <div className="bg-red-100 text-xs border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                id={`code-${index}`}
                                type="tel"
                                maxLength="1"
                                autoFocus={index === 0}
                                value={digit}
                                onChange={handleInputChange(index)}
                                onKeyDown={handleKeyDown(index)}
                                className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded"
                                required
                            />
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
                <button onClick={handleResendCode} disabled={loading || timeLeft > 0} className="mt-4 text-sm underline text-emerald-600 hover:text-emerald-500">
                    {timeLeft > 0 ? `Resend Code in (${timeLeft}s)` : 'Resend Code'}
                </button>
            </div>
        </div>
    );
}

export default Verify;