// Wallet.js
import React from 'react';
import { BiDollarCircle } from 'react-icons/bi';
import { AiOutlineTeam, AiOutlineCalendar } from 'react-icons/ai';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import { useUser } from "../context";

const Wallet = () => {
    const { user, login } = useUser();

    const transactions = [
        { id: 1, type: 'credit', amount: 0, date: '2024', name: "Donation Received" },
        { id: 2, type: 'debit', amount: 0, date: '2024', name: "Funds Withdrawn" },
        // ... more transactions
    ];

    return (
        <div className="bg-white p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {/* Balance Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-sm">Balance</h5>
                    <p className="text-xs md:text-sm font-bold">${user?.balance}</p>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <BiDollarCircle className="text-emerald-500 text-xl" />
                </div>
            </div>

            {/* Impact Points Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-sm">Impact Points</h5>
                    <p className="text-xs md:text-sm font-bold">{user?.points} pts</p>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <MdOutlineVolunteerActivism className="text-emerald-500 text-xl" />
                </div>
            </div>

            {/* Recent Transactions */}
            {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gray-200 p-2">
                            <AiOutlineCalendar className="text-gray-500 text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs">{transaction.name}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                    </div>
                    <span className={`font-bold text-xs ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                        $ {transaction.amount}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Wallet;
