// SummaryCards.js
import React from 'react';
import { BiDollarCircle } from 'react-icons/bi';
import { AiOutlineTeam, AiOutlineGift } from 'react-icons/ai';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import { useUser } from "./context";

const SummaryCards = () => {
  const { user, login } = useUser();


  return (
    <div className="bg-white p-4 space-y-4 md:grid md:grid-cols-4 md:gap-4 md:space-y-0">
      {/* Card 1 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
          <h5 className="text-xs md:text-lg">Donations received</h5>
          <p className="text-xs mt-2 md:text-2xl">${user?.balance || 0}</p>
        </div>
        <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
          <BiDollarCircle className="text-emerald-500 text-xl md:text-3xl" />
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
          <h5 className="text-xs md:text-lg">Volunteer Events</h5>
          <p className="text-xs mt-2 md:text-2xl">3</p>
        </div>
        <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
          <AiOutlineTeam className="text-emerald-500 text-xl md:text-3xl" />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
          <h5 className="text-xs md:text-lg">Active Fundraisers</h5>
          <p className="text-xs mt-2 md:text-2xl">0</p>
        </div>
        <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
          <MdOutlineVolunteerActivism className="text-emerald-500 text-xl md:text-3xl" />
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
          <h5 className="text-xs md:text-lg">Impact Points</h5>
          <p className="text-xs mt-2 md:text-2xl">{user?.points}</p>
        </div>
        <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
          <AiOutlineGift className="text-emerald-500 text-xl md:text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
