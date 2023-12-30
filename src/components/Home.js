import React, { useState, useEffect } from 'react';
import api from '../api';
import CircleLoader from 'react-spinners/CircleLoader';
import Hero from './Hero';
import Impact from './Impact'; // Ensure this path is correct

function Home() {
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        const response = await api.get('/api/impacts');
        setImpacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching impacts:", error);
        // Handle error. Perhaps set an error state and display a message
        setLoading(false);
      }
    };

    fetchImpacts();
  }, []); // Empty array means this effect runs once on mount

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Hero />
      {/* Title for Impacts Section */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-center">Our Impacts</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircleLoader />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Loop through impacts and display each one */}
            {impacts.map((impact, index) => (
              <Impact key={index} {...impact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
