// VolunteerActivities.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VolunteerActivities = () => {
    // Dummy data for volunteer activities, now including image URLs
    const activities = [
      {
        id: 1,
        title: "Malawi Childcare Volunteer Project",
        date: "2024-02-19",
        country:"Malawi",
        description: "Volunteer with children in our Malawi Childcare Volunteer Project and support the work of local teachers and caregivers",
        image: "https://media.licdn.com/dms/image/D4E10AQFbasC6evI2DA/image-shrink_800/0/1696085643038?e=2147483647&v=beta&t=eYAJkAWEi0vgikr3lhIWPjUjjbB1wvM0pWdiC0bC7FI",
      },
      {
        id: 2,
        title: "Chipembere Community Development Organisation (CCDO)",
        date: "2024-02-13",
        country:"Malawi",
        description: "Chipembere Community Development Organisation CCDO exists to promote interventions that build the well-being of underprivileged women, children and youth through capacity development advocacy, and impact mitigation.",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg64wwHmaWnxbDWEJiWer-uB3WhEkVMan1B58AaULUy6QbRCHsbvrT0n2ary_tdh0pHWub2CH8NF3xUniAu9OyPC9F6iK3JcBiEYTTRxYJZH5Ulv4oHlyCJVh8gLxMQkKUmz1NBds8RhKwTZSkJjNzRDbn-9nl6eLLC8s3vuyMcqmkfS7a9VJ8CbjhU/s960/Chipembere%20Community%20Development%20Organization%20-%20Volunteer%20program%20-%20Malawi%20-%20Food%20and%20accommodation%20-%20photo%208.jpg", // Replace with actual URL
      },
      {
        id: 3,
        title: "Become part of the Open Arms 'family'",
        date: "2024-03-10",
        country:"Malawi",
        description: "Support our dedicated staff in caring for some of Malawi's most vulnerable children - and see first hand the amazing difference this makes.  ",
        image: "https://s3-eu-west-1.amazonaws.com/res.openarmsmalawi.org/_820x540_fit_center-center/volunteers-mat-weaving.jpg?mtime=20230808113533", // Replace with actual URL
      },
      // Add more activities as needed
    ];

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg ">
    <h2 className="text-xl font-bold mb-6 text-gray-700">Volunteer Activities</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {activities.length > 0 ? (
    activities.map((activity) => (
        <div key={activity.id} className="bg-white p-4 border rounded-lg hover:shadow-md transition-shadow relative">
            <div className="w-full h-32 overflow-hidden rounded-t-lg relative">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover"/>
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                {activity.country}
                </div>
            </div>
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
)
: (
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
