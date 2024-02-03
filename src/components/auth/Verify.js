import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from '../lottie/success-animation.json'; // Ensure this path is correct
import successConfetti from '../lottie/success-confetti.json'; // Ensure this path is correct

const Verify = () => {
    const initialCodeState = Array(6).fill('');
    const [code, setCode] = useState(initialCodeState);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
            setMessage(`A verification code has been sent to ${location.state.email}. Please check your inbox and spam folder.`);
        } else {
            setError("No email address found. Please try again.");
        }
    }, [location.state]);

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

const handleInputChange = (index) => (event) => {
    const newCode = [...code];
    const value = event.target.value;

    if (/^[0-9]$/.test(value) || value === '') {
        newCode[index] = value;
        setCode(newCode);

        if (value && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }

        if (!value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
};


useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6 && code.every(digit => /^[0-9]$/.test(digit))) {
        handleVerify();
    }
}, [code]);

    

    const handleKeyDown = (index) => (event) => {
        if (event.key === 'Backspace' && !code[index]) {
            // Handle backspace press on an empty field to move back
            index > 0 && inputRefs.current[index - 1].focus();
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
                const response = await api.post('/api/auth/verify-first-time-user', { email, verificationCode: fullCode });
                if (response.status === 200) {
                    setSuccess(true);
                    // Show success animation and then navigate
                    setTimeout(() => navigate('/verifyPhone'), 5000); // Adjust time as needed
                } else {
                    setError('Verification failed. Please try again or resend the code.');
                }
            } catch (error) {
                setError('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setMessage('Sending a new code...');
      
        try {
          const response = await api.post('/api/auth/resend-verification-code', { email });
      
          if (response.status === 200) {
            // Successful response
            setMessage(`A new verification code has been sent to ${email}. Please check your inbox and spam folder.`);
            setTimeLeft(60); // Start the countdown again
          } else {
            // Handle other response statuses if needed
            setError('Failed to resend code. Please try again later.');
          }
        } catch (error) {
          // Handle any network or request error
          setError('Failed to resend code. Please try again later.');
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
                <button onClick={() => navigate('/verifyPhone')} className="mt-4 px-4 py-2 rounded bg-emerald-500 text-white">
                    Done
                </button>
            </div>
        );
    }

   
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-2">Enter Verification Code</h2>
                    {message && <div className="bg-green-100 border border-green-400 text-green-700 text-xs px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
                        {loading ? 'Verifying...' : 'Verify'}
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