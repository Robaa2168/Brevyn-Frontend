import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../lottie/loading.json'; // Adjust the path to your Lottie file
import api from '../../api'; 

const HelpPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

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

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

// FAQ Item Component
const FaqItem = ({ question, answer, isOpen, toggle }) => {
    return (
        <div className="bg-white p-4 rounded-md shadow mb-4" onClick={toggle}>
            <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && <div className="text-md text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: answer }} />}
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
            {faqs.map((faq, index) => (
                <FaqItem 
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaqIndex === index}
                    toggle={() => toggleFaq(index)}
                />
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

export default HelpPage;
