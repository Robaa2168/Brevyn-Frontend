import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api'; // Adjust with your api utility path
import { FaSpinner, FaFlag, FaShareAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { useUser } from './context';
import { Helmet } from 'react-helmet';


function truncateURL(url, maxLength) {
  // Define the length for the start and end strings
  const startChars = 15;
  const endChars = maxLength - startChars; // Reserve the rest for the end

  if (url.length <= maxLength) {
    return url; // No need to truncate
  }

  // Extracting the start and end parts of the URL
  const start = url.substring(0, startChars);
  const end = url.substring(url.length - endChars);

  // Return the truncated URL
  return `${start}.../${end}`;
}

const DonationPage = () => {
  const { user } = useUser();
  const { uniqueIdentifier: linkId } = useParams(); // Get unique identifier from URL

  // Define state variables
  const [linkData, setLinkData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDonating, setIsDonating] = useState(false);
  const [donationData, setDonationData] = useState({
    firstName: '',
    lastName: '',
    type: 'individual',
    amount: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataAndIncrementViews = async () => {
      try {
        // First fetch the link data
        const response = await api.get(`/api/donations/donate/${linkId}`);
        setLinkData(response.data);
  
        // After successful fetch, increment the view count
        await api.post(`/api/donations/view/${linkId}`);
        console.log('View count incremented');
      } catch (error) {
        console.error("Error in operations: ", error);
        // Handle error here
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDataAndIncrementViews();
  }, [linkId]);
  


  const calculateProgress = () => {
    if (linkData) {
      const progress = (linkData.totalDonations / linkData.targetAmount) * 100;
      return Math.min(progress, 100); // Ensuring it doesn't go over 100%
    }
    return 0; // Default to 0 if no data
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDonationData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  const handleDonateClick = () => {
    setIsDonating(!isDonating); // Toggle donation form view
  };


  const shareLink = async () => {
    const url = `https://brevyn.vercel.app/donation/${linkData.uniqueIdentifier}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Donate Now',
          url: url,
        });
        console.log('Link shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(url).then(() => {
        console.log('Link copied to clipboard');
      }, (err) => {
        console.error('Could not copy link: ', err);
      });
    }
  };

  // Handle donation form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Post the donation data to your API
      const response = await api.post('/api/donations/donation-payment', {
        ...donationData,
        uniqueIdentifier: linkData.uniqueIdentifier // ensure linkData and user.token are correctly set
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Handle success
      if (response.status === 200 || response.status === 201) {
        setIsSuccessful(true);
        // Reset form or any other state updates
      } else {
        setError('An error occurred during the donation process. Please try again.');
      }
    } catch (err) {
      // Handle error
      let errorMessage = 'An error occurred. Please try again.'; // Default error message

      if (err.response && err.response.data && err.response.data.message) {
        // If the error has a message from the server response, use it
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // If the error has a message property, use it
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center py-12">
      <Helmet>
        <title>{`Donate to ${linkData?.title}`}</title>
        <meta name="description" content={`Help support ${linkData?.title} by donating. Every bit helps!`} />
        
        {/* Standard meta tags */}
        <meta property="og:url" content={`https://brevyn.vercel.app/donation/${linkData?.uniqueIdentifier}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Donate to ${linkData?.title}`} />
        <meta property="og:description" content={`Help support ${linkData?.title} by donating. Every bit helps!`} />
        <meta property="og:image" content={linkData?.image || 'defaultImage.jpg'} />

        {/* Twitter meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Donate to ${linkData?.title}`} />
        <meta name="twitter:description" content={`Help support ${linkData?.title} by donating. Every bit helps!`} />
        <meta name="twitter:image" content={linkData?.image || 'defaultImage.jpg'} />

        {/* Add additional meta tags for other platforms if necessary */}
      </Helmet>
      {isLoading ? (
        <div className="text-center">
          <FaSpinner className="animate-spin text-emerald-500 text-4xl" />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 max-w-lg w-full mx-2 sm:mx-4 md:mx-auto">

          {isDonating ? (
            user ? (
              <div>
                {/* Donation Form */}
                <h2 className="text-2xl font-bold mb-4 border-b border-emerald-500 py-2 px-4 sm:py-1 sm:px-2 text-xs sm:text-sm text-center mx-4 sm:mx-0">Donate to {linkData.title}</h2>
                {isSuccessful ? (
                  <div className="flex  flex-col items-center justify-center w-full p-2">
                    {/* Success Animations */}
                    <div className="relative  w-full h-64">
                      <Lottie animationData={successConfetti} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                      <Lottie animationData={successAnimation} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                    </div>
                    <p className='text-center'>Thank you for your donation!</p>
                  </div>
                ) : (
                  <div>
                    {error && (
                      <div className="mb-4 p-4 text-xs bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="md:grid md:grid-cols-2 md:gap-4">
                        <input
                          type="text"
                          name="firstName" // match state keys
                          value={donationData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          required
                          className="w-full md:w-48 px-4 py-2 border rounded text-xs md:text-sm focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          name="lastName" // match state keys
                          value={donationData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          required
                          className="w-full md:w-48 px-4 py-2 border rounded text-xs md:text-sm focus:border-emerald-500 mt-2 md:mt-0"
                        />
                      </div>

                      <select
                        name="donationtype" // match state keys
                        value={donationData.donationtype}
                        onChange={handleInputChange}
                        required className="w-full px-4 py-2 border rounded text-xs md:text-sm focus:border-emerald-500">
                        <option value="individual">Individual</option>
                        <option value="corporation">Corporation</option>
                        <option value="foundation">Foundation</option>
                      </select>
                      <input
                        type="number"
                        name="amount" // match state keys
                        value={donationData.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                        required
                        className="w-full px-4 py-2 border rounded text-xs md:text-sm focus:border-emerald-500"
                      />
                      <textarea
                        name="note" // match state keys
                        value={donationData.note}
                        onChange={handleInputChange}
                        placeholder="Note (Optional)"
                        className="w-full px-4 py-2 border rounded text-xs md:text-sm focus:border-emerald-500"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 rounded text-xs md:text-sm ${isSubmitting ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}
                      >
                        {isSubmitting ? <><FaSpinner className="animate-spin inline mr-2" />Submitting...</> : 'Submit Donation'}
                      </button>
                    </form>
                  </div>
                )}
                <button
                  onClick={handleDonateClick}
                  className="mt-4 text-emerald-500 border border-emerald-500 px-4 py-2 rounded hover:bg-emerald-500 hover:text-white transition duration-300 block w-full text-xs md:text-sm"
                >
                  Back to Info
                </button>
              </div>
            ) : (
              // Show login and signup buttons if not logged in
              <div className="text-center my-8">
                <div className="bg-yellow-100 border-l border-yellow-500 text-yellow-700 text-xs p-4 mb-4 rounded" role="alert">
                  <p className="font-bold">Remember</p>
                  <p>Please reopen the donation link once you are logged in to donate.</p>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">Please Login or Signup to Donate</h2>
                <div className="flex justify-center gap-4">
                  <Link to="/login" className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-semibold py-2 px-4 border border-emerald-400 rounded shadow transition duration-300 ease-in-out">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-semibold py-2 px-4 border border-emerald-400 rounded shadow transition duration-300 ease-in-out">
                    Signup
                  </Link>
                </div>

              </div>


            )
          ) : (
            <div>
              <img src={linkData?.image || 'defaultImage.jpg'} alt="Donation" className="max-w-md max-h-60 w-full object-cover rounded-lg mb-4" />
              <h2 className="text-lg sm:text-2xl font-bold mb-2 text-center mx-4 sm:mx-0">{linkData?.title}</h2>
              <p className="text-xs sm:text-md mb-4 text-center mx-4 sm:mx-0">{linkData?.description}</p>

              {/* Created Date */}
              <p className="text-xs text-gray-500 text-center mb-2">
                Created {formatDistanceToNow(new Date(linkData?.createdAt))} ago
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full mb-2">
                <div
                  className="bg-emerald-500 h-1 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>

              {/* Target Amount */}
              <div className="bg-gray-100 p-2 rounded-md mb-4">
                <p className="text-sm text-gray-700">Target Amount: ${linkData?.targetAmount}</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {calculateProgress().toFixed(2)}% Achieved
                </p>
              </div>


              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 my-4">
                <span className="text-xs font-medium shrink-0">Donation Link:</span>
                <div className="flex bg-gray-100 p-2 rounded items-center justify-between flex-1">
                  <span className="text-xs block overflow-hidden text-ellipsis whitespace-nowrap sm:text-sm">
                    {truncateURL(`https://brevyn.vercel.app/donation/${linkData.uniqueIdentifier}`, 22)}
                  </span>
                  <button onClick={shareLink} className="ml-2 text-blue-500 hover:text-blue-700 transition duration-200">
                    <FaShareAlt />
                  </button>
                </div>
              </div>

              {/* Donate Button */}
              <button onClick={handleDonateClick} className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition duration-300 w-full mb-4">Donate Now</button>

              {/* Report Misuse */}
              <div className="text-center">
                <button className="text-red-500 text-xs sm:text-sm">
                  <FaFlag className="inline mr-1" /> Report Misuse
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationPage;
