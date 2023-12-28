// Donations.js
import React from 'react';
import { BiDollarCircle } from 'react-icons/bi';
import { AiOutlineTeam, AiOutlineGift } from 'react-icons/ai';
import { MdOutlineVolunteerActivism } from 'react-icons/md';

const Donations = () => {
  return (
   <div className="flex flex-col flex-grow p-4">
   <h2 className="text-xs sm:text-lg text-gray-800 mb-4">Recent Donations</h2>
   <div className="bg-white rounded-lg shadow overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200">
       <thead className="bg-gray-50">
         <tr>
           <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
             ID
           </th>
           <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
             Date
           </th>
           <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
             Amount
           </th>
           <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
             Impact
           </th>
         </tr>
       </thead>
       <tbody className="bg-white divide-y divide-gray-200">
         <tr>
           <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
             001
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
             Jan 10, 2024
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
             $50
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
             5 Trees Planted
           </td>
         </tr>
       </tbody>
     </table>
   </div>
 </div>
  );
};

export default Donations;
