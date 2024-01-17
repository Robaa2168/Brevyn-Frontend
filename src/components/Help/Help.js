import React from 'react';

const HelpPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-green-600">Verdant Charity Help Center</h1>
                    <p className="text-md text-gray-600 mt-2">Find answers to your questions or get in touch</p>
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
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {/* FAQ Item */}
                        <div className="bg-white p-4 rounded-md shadow">
                            <h3 className="text-lg font-semibold text-gray-800">How can I make a donation?</h3>
                            <p className="text-md text-gray-600 mt-2">[Answer about donation process]</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpPage;
