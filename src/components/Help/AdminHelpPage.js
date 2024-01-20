import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../lottie/loading.json'; 
import { useUser } from '../context'; 
import api from '../../api';

const AdminHelpPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/faqs/faq');
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);


    const handleDelete = async (faqId) => {
        try {
            const response = await api.delete(`/api/faqs/faq/${faqId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.status === 200) {
                // Update state only if deletion is successful
                setFaqs(faqs.filter(faq => faq._id !== faqId));
            } else {
                console.error('Failed to delete FAQ:', response);
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };
    

    const handleEdit = (faqId) => {
        navigate(`/edit-faq/${faqId}`);
    };

    // FAQ Item Component
    const FaqItemAdmin = ({ faq }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggle = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div className="bg-white p-4 rounded-md shadow mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-lg font-semibold text-gray-800 cursor-pointer mb-2 sm:mb-0" onClick={toggle}>{faq.question}</h3>
                    <div className="space-y-2 sm:space-y-0 sm:space-x-2">
                        <button 
                            onClick={() => handleEdit(faq._id)} 
                            className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-3 mr-2 border border-blue-700 hover:border-transparent rounded"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(faq._id)} 
                            className="bg-transparent hover:bg-red-500 text-red-700 hover:text-white py-1 px-3 border border-red-700 hover:border-transparent rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {isOpen && <p className="text-md text-gray-600 mt-2">{faq.answer}</p>}
            </div>
        );
        
        
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <header className="text-center mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">Verdant Charity Help Center</h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2">Find answers to your questions or get in touch</p>
                </header>

                <div className="flex justify-center mb-12">
                    <div className="w-full md:w-2/3 lg:w-1/2">
                        <div className="flex items-center bg-white rounded-md shadow">
                            <input type="text" className="w-full py-3 px-4 rounded-l-md focus:outline-none" placeholder="Search for help articles" />
                            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-r-md">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">Frequently Asked Questions</h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-4">
                            <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                        </div>
                    ) : faqs.length > 0 ? (
                        <div>
                            {faqs.map(faq => (
                                <FaqItemAdmin key={faq._id} faq={faq} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <p>No FAQs found at the moment.</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default AdminHelpPage;
