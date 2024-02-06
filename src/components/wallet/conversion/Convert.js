import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useUser } from "../../context";
import { FaSpinner } from 'react-icons/fa';
import { HiRefresh } from "react-icons/hi";
import api from "../../../api";
import Lottie from "lottie-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import successAnimation from "../../lottie/success-animation.json";
import successConfetti from '../../lottie/ravel-success-animation.json';
import { useNavigate } from "react-router-dom";

const Convert = ({ setActiveComponent }) => {
  const { user, login } = useUser();
  const accounts = user?.accounts;

  const getUniqueCurrencies = (accounts) => {
    const uniqueCurrencies = Array.from(
      new Set(accounts.map((account) => account.currency))
    );
    return uniqueCurrencies;
  };

  const currencies = getUniqueCurrencies(accounts);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KES");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [balance, setBalance] = useState(0);
  const isExceedingBalance = parseFloat(amount) > balance;
  const availableCurrencies = useMemo(() => {
    return currencies.filter(currency => currency !== fromCurrency);
  }, [currencies, fromCurrency]);

  // State to store the amount, source currency, and target currency
  const [timer, setTimer] = useState(5);

  const rates = {
    "USD": {
      "KES": 160.00,
      "GBP": 0.79,
      "AUD": 1.40,
      "CAD": 1.25,
      "EUR": 0.92,
    },
    "GBP": {
      "USD": 1.32,
      "KES": 202.05,
    },
    "KES": {
      "USD": 0.0062,
      "GBP": 0.0049,
    },
  };

  // Function to fetch updated balances
  const fetchUpdatedBalances = async () => {
    try {
      const balanceResponse = await api.get("/api/auth/info", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (balanceResponse.status === 200) {
        // Update context by spreading the existing user and overriding with new data
        login({ ...user, ...balanceResponse.data });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setActiveComponent('CurrenciesContainer');
        }, 4000);
      } else {
        setError("An error occurred while fetching updated balances.");
      }
    } catch (balanceError) {
      console.error("Error fetching updated balances:", balanceError);
      // Consider how to handle this error without overriding conversion success
    }
  };

  // Countdown timer and reset logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        setTimer(15); // Reset to 15 seconds for the countdown
      }, 15000); // 15 seconds

      return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [timer]);

  useEffect(() => {
    const account = accounts.find(acc => acc.currency === fromCurrency);
    if (account) {
      setBalance(account.balance);
    } else {
      setBalance(0); // Set to 0 or some default value if no matching account is found
    }
  }, [fromCurrency, accounts]);

  // Function to get the current exchange rate
  const getCurrentRate = useMemo(() => {
    return rates[fromCurrency] && rates[fromCurrency][toCurrency]
      ? rates[fromCurrency][toCurrency]
      : 0;
  }, [fromCurrency, toCurrency, rates]);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency((prevFromCurrency) => {
      setToCurrency(prevFromCurrency);
      return toCurrency;
    });
    setAmount('');
  }, [toCurrency]);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency, getCurrentRate]);

  const calculateConversion = () => {
    if (amount && getCurrentRate) {
      const result = parseFloat(amount) * getCurrentRate;
      setConvertedAmount(result.toFixed(2));
    } else {
      setConvertedAmount(0);
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const setMaxAmount = () => {
    setAmount(balance.toString());
  };

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowSuccess(false);

    // Check if fromCurrency and toCurrency are the same
    if (fromCurrency === toCurrency) {
      setError("From currency and to currency cannot be the same.");
      setLoading(false);
      return;
    }

    // Check if the amount is less than the minimum conversion amount
    if (parseFloat(amount) < 10) {
      setError("Minimum conversion amount is 10.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/api/conversions/convert",
        {
          fromCurrency,
          toCurrency,
          amount
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.status === 201) {
        // Proceed to fetch updated balances
        fetchUpdatedBalances();
      } else {
        setError("An error occurred while processing your conversion.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while processing your conversion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess ? (
        <div className="flex items-center justify-center">
          <div className="flex justify-center items-center p-4">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden p-5 space-y-4">

              {/* Success Animations */}
              <div className="relative ">
                {/* Confetti Animation */}
                <Lottie animationData={successAnimation} className="w-48 h-48 mx-auto" style={{ width: '200px', height: '200px' }} />
                <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                {/* Tick Animation */}
                <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 text-center">🎉 Conversion Successful</h2>
              {/* Conversion Details */}
              <div className="text-left space-y-2">
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">From Currency:</span>
                  <span>{fromCurrency}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">To Currency:</span>
                  <span>{toCurrency}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">Amount:</span>
                  <span>{`${amount} ${fromCurrency}`}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">Converted Amount:</span>
                  <span>{`${convertedAmount} ${toCurrency}`}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">Date:</span>
                  <span>
                    {new Date().toLocaleString("en-US", {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>

              {/* Dotted line divider */}
              <div style={{ borderTop: "3px dotted #999", borderRadius: "1px" }} className="my-4"></div>

              {/* Here you could potentially add a CTA like 'New Conversion' or anything relevant */}
              {/* For example, a button to perform a new conversion. This is optional. */}
              <div className="flex justify-center">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold text-xs py-2 px-6 rounded-lg border-4 border-green-500 hover:border-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center opacity-50 hover:opacity-100"
                >
                  <FontAwesomeIcon icon={faReceipt} className="mr-2" /> New Conversion
                </button>


              </div>

              {/* Notes or any additional information */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-700">Please note the conversion rate may vary in real-time.</p>
              </div>

              {/* Optional: Signature Line */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-700">Authorized Signature: ___________________</p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="container mx-auto p-4 bg-white text-center ">
            {error && (
              <div className='mb-4 p-3 text-xs bg-red-100 border border-red-400 text-red-700 rounded relative' role='alert'>
                <strong className='font-bold'>Error: </strong>
                <span className='block sm:inline'>{error}</span>
                <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>

                </span>
              </div>
            )}

            {/* Currency selection section */}
            <div className='flex flex-col text-xs p-4 sm:flex-row lg:items-start items-center justify-between mb-4'>
              {/* From Currency Select */}
              <div className='w-full mb-4 sm:mb-0 sm:mr-2'>
                <select
                  value={fromCurrency}
                  onChange={handleFromCurrencyChange}
                  className='block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:shadow-outline'
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div className='flex justify-center  items-center mx-4 mb-4 sm:mb-0 sm:mx-6'>
                <button className='rounded-full shadow-lg bg-white-500 p-2 focus:outline-none' onClick={handleSwapCurrencies} type="button">
                  {/* Convert Icon */}
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="text-emerald-500 text-xl sm:text-2xl sm:rotate-0 rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>

                </button>
              </div>
              {/* To Currency Select */}
              <div className='w-full sm:ml-2'>
                <select
                  value={toCurrency}
                  onChange={handleToCurrencyChange}
                  className='block w-full bg-white border border-gray-400 hover:border-gray-500 text-xs px-4 py-2 rounded leading-tight focus:outline-none focus:shadow-outline'
                >
                  {availableCurrencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount input section */}
            <div className='flex flex-col sm:flex-row justify-between items-start text-xs mb-4 gap-x-4'>
              {/* From amount input */}
              <div className='w-full mb-4 sm:mb-0'>
                <label className='block text-gray-700 text-xs font-bold mb-2'>
                  You are converting
                </label>
                <input
                  type='tel'
                  className={`appearance-none rounded w-full text-xs  py-2 px-3 text-gray-700 leading-tight focus:outline-none ${isExceedingBalance ? 'border-2 border-red-500' : 'border'}`}
                  placeholder='Enter amount'
                  value={amount}
                  onChange={handleAmountChange}
                />
                <div
                  className='mt-2 text-xs text-gray-600 border-1 border border-gray-400 p-1 inline-block focus:bg-white focus:bg-opacity-5 outline-none cursor-pointer'
                  onClick={setMaxAmount}
                >
                  Max: {balance}
                </div>

              </div>

              {/* To amount display */}
              <div className='w-full'>
                <label className='block text-gray-700 text-xs font-bold mb-2'>
                  You will receive
                </label>
                <input
                  type='tel'
                  disabled
                  className='appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  placeholder='Enter amount'
                  value={convertedAmount}
                />
              </div>
            </div>




            {/* Exchange rate and timer alert */}
          {/* Exchange rate and timer alert */}
<div className='mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded text-xs' role='alert'>
  <div className='font-bold text-xs'>Exchange Rate: <span>{`${fromCurrency} 1 = ${toCurrency} ${getCurrentRate}`}</span></div>
  <div className='mt-2'>
    {timer === 0 ? 'Refreshing...' : `Refreshing in ${timer} second${timer > 1 ? 's' : ''}`}
  </div>
</div>

            {/* Convert button */}
            <div className='flex justify-center mt-4'>
              <button
                className='w-full sm:w-auto border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out flex justify-center items-center'
                onClick={handleConvertSubmit}
                disabled={!amount || !fromCurrency || !toCurrency || loading}
              >
                 {loading ? (
    <>
      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
      Processing...
    </>
  ) : (
    <>
    <HiRefresh className="-ml-1 mr-2 h-4 w-4" />
    Convert To {toCurrency}
  </>
  )}
</button>


            </div>
          </div>


        </>
      )}
    </>
  );
};

export default Convert;
