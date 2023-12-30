import React, { useState, useEffect } from 'react';
import api from '../api';
import CircleLoader from 'react-spinners/CircleLoader';
import Hero from './Hero';
import Impact from './Impact';
import { useUser } from './context';

function Home() {
  const { user } = useUser();
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpacts = async () => {
        setLoading(true);
        try {
            const headers = {};
            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }

            const response = await api.get('/api/impacts', { headers });
            setImpacts(response.data);
        } catch (error) {
            console.error("Error fetching impacts:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchImpacts();
}, []);

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
      
      {impacts.map((impact, index) => (
    <Impact key={index} {...impact} userHasLiked={impact.userHasLiked} />
))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
