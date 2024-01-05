// VolunteerActivities.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VolunteerActivities = () => {
    // Dummy data for volunteer activities, now including image URLs
    const activities = [
      {
        id: 1,
        title: "Beach Cleanup",
        date: "2024-01-20",
        description: "Join us to clean the local beach.",
        image: "https://info.flip.com/en-us/blog/get-inspired/environmental-volunteering/_jcr_content/root/container/container_copy/teaser.coreimg.85.1024.jpeg/1681702105963/earth-day-activities.jpeg", // Replace with actual URL
      },
      {
        id: 2,
        title: "Park Restoration",
        date: "2024-02-15",
        description: "Help restore the local park.",
        image: "https://images.ctfassets.net/81iqaqpfd8fy/57NATA4649mbTvRfGpd6R1/911f94cdfd6089a77aefb4b1e9ebac7a/Teenvolunteercover.jpg?fm=webp&h=620&w=1440", // Replace with actual URL
      },
      {
        id: 3,
        title: "Food Drive",
        date: "2024-03-10",
        description: "Collecting non-perishable food items for the food bank.",
        image: "https://students.1fbusa.com/hubfs/25%20Ways%20to%20Volunteer%20in%20Your%20Community.jpg#keepProtocol", // Replace with actual URL
      },
      // Add more activities as needed
    ];

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg ">
    <h2 className="text-xl font-bold mb-6 text-gray-700">Volunteer Activities</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.length > 0 ? (
            activities.map((activity) => (
                <div key={activity.id} className="bg-white p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img src={activity.image} alt={activity.title} className="w-full h-32 object-cover rounded-t-lg"/>
                    <div className="p-4">
                        <h3 className="text-xs font-semibold mb-2">{activity.title}</h3>
                        <p className="text-xs text-gray-600">Date: {activity.date}</p>
                        <p className="text-xs mb-4">{activity.description}</p>
                        <button 
                        onClick={() => toast.error("Participation is not available in your region due to distance constraints.")}
                            className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition duration-300">
                            Participate
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex justify-center items-center col-span-3">
                <p className="text-center text-xs text-gray-500">No volunteer activities found</p>
            </div>
        )}
    </div>

    {/* Make sure to include ToastContainer somewhere in your component, usually at the bottom */}
    <ToastContainer position="top-center" autoClose={5000} />
</div>
  );
};

export default VolunteerActivities;
