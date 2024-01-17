import React from 'react';
// Import any additional assets or components as needed

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-green-600">About Verdant Charity</h1>
                    <p className="text-md text-gray-600 mt-2">Dedicated to making a difference in the world</p>
                </header>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
                    <p className="text-md text-gray-600">
                        Verdant Charity is committed to [brief description of the mission].
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
                    <p className="text-md text-gray-600">
                        We envision a world where [description of the vision].
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our History</h2>
                    <p className="text-md text-gray-600">
                        Since our founding in [year], Verdant Charity has [brief history and achievements].
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Team member card */}
                        <div className="bg-white p-4 rounded-md shadow text-center">
                            <img src="[link-to-image]" alt="Team Member" className="w-32 h-32 mx-auto rounded-full" />
                            <h3 className="text-lg font-semibold text-gray-800 mt-4">Name</h3>
                            <p className="text-sm text-gray-600">Position</p>
                        </div>
                        {/* Repeat for other team members */}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUsPage;
