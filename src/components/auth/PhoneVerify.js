import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from '../lottie/success-animation.json';
import successConfetti from '../lottie/success-confetti.json';

const PhoneVerify = () => {
  const locationState = useLocation();
  const initialCodeState = Array(6).fill('');
  const [code, setCode] = useState(initialCodeState);
  const [phoneNumber, setPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (locationState.state?.phoneNumber) {
      setPhone(locationState.state.phoneNumber);
      setMessage(`A verification code has been sent to ${locationState.state.phoneNumber}. Please check your messages.`);
    } else {
      setError("No phone number found. Please try again.");
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

      if (value && index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        inputRefs.current[index].focus();
      } else if (index > 0 && !code[index]) {
        inputRefs.current[index - 1].focus();
      }
      event.preventDefault();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    const fullCode = code.join('');

    if (fullCode.length === 6) {
      try {
        const verifyResponse = await api.post('/api/auth/verify-phone', { phoneNumber, verificationCode: fullCode });

        if (verifyResponse.status === 200) {
          setSuccess(true);
          setMessage('Verification successful. You will be redirected shortly.');

          setTimeout(() => {
            navigate('/login');
          }, 5000);
        } else {
          setCode(initialCodeState);
          setError('Verification failed. Please try again or resend the code.');
        }

      } catch (error) {
        setCode(initialCodeState);
        if (error.response && error.response.data && error.response.data.message) {
          setError(` ${error.response.data.message}. Resend code.`);
        } else {
          setError('Verification failed. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter all the digits of the verification code.');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setMessage('Sending a new code...');
  
    try {
      // Determine what data to send based on what needs to be verified
      const dataToSend = phoneNumber;
  
      const response = await api.post('/api/auth/resend-verification-code', dataToSend);
  
      if (response.status === 200) {
        const messagePrefix = phoneNumber ? `to ${phoneNumber}` : "to your email";
        setMessage(`A new verification code has been sent ${messagePrefix}. Please check your messages or email.`);
        setTimeLeft(60); // Reset countdown
      } else {
        setMessage('');
        setError('Failed to resend code. Please try again later.');
      }
    } catch (error) {
      setMessage('');
      const specificErrorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to resend code. Please try again later.';
  
      setError(specificErrorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChangeNumber = () => {
    // Navigate to change phone number component
    navigate('/changeNumber', { state: { phoneNumber } });
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
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-2">Phone Number Verification</h2>
          {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 text-xs px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
          {error && (
            <div className="bg-red-100 text-xs border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
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

          <button onClick={handleVerify} disabled={loading} className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            {loading ? 'Verifying...' : 'Verify Phone'}
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <button onClick={handleResendCode} disabled={loading || timeLeft > 0} className="text-sm underline text-emerald-600 hover:text-emerald-500">
            {timeLeft > 0 ? `Resend Code in (${timeLeft}s)` : 'Resend Code'}
          </button>
          <button onClick={handleChangeNumber} className="text-sm underline text-blue-600 hover:text-blue-500">
            Change Number
          </button>
        </div>

      </div>
    </div>
  );
}

export default PhoneVerify;
