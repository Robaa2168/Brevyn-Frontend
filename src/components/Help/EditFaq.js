import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import api from '../../api'; // Adjust the path according to your project structure
import { useUser } from '../context'; // Adjust the path according to your project structure

const EditFaq = () => {
    const { faqId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [faqDetails, setFaqDetails] = useState({ question: '', answer: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const response = await api.get(`/api/faqs/faq/${faqId}`);
                setFaqDetails(response.data);
            } catch (error) {
                console.error('Error fetching FAQ:', error);
                setError('Failed to load FAQ data.');
            }
        };

        fetchFaq();
    }, [faqId]);

    const handleChange = (e) => {
        setFaqDetails({ ...faqDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.put(`/api/faqs/faq/${faqId}`, faqDetails, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status === 200) {
                navigate('/Adminhelp'); // Navigate back to the admin help page
            } else {
                setError("Failed to update FAQ. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while updating the FAQ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Edit FAQ</h2>

            {error && (
                <div className="mb-4 p-4 text-sm bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                    <label htmlFor="question" className="block mb-1 text-sm font-medium text-gray-700">Question</label>
                    <input
                        type="text"
                        name="question"
                        value={faqDetails.question}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter the FAQ question"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="answer" className="block mb-1 text-sm font-medium text-gray-700">Answer</label>
                    <textarea
                        name="answer"
                        value={faqDetails.answer}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter the FAQ answer"
                        rows="4"
                    ></textarea>
                </div>

                <div className="col-span-1">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex justify-center items-center w-full text-white py-2 px-4 rounded transition duration-300 ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    >
                        {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
                        Update FAQ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditFaq;
