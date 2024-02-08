// Wallet.js
import React from 'react';
import { BiDollarCircle } from 'react-icons/bi';
import { AiOutlineCalendar, AiOutlineGift } from 'react-icons/ai';
import { useUser } from "../context";
import TransferHistory from './history/TransferHistory'; 

const Wallet = () => {
    const { user } = useUser();

    const transactions = [
        { id: 1, type: 'credit', amount: `${user?.balance}`, date: '2024', name: "Funds Received" },
        { id: 2, type: 'debit', amount: 0, date: '2024', name: "Funds Withdrawn" },
    ];

    // Assuming user.accounts is an array of account objects
    const highestBalanceAccount = user?.accounts?.reduce((acc, account) => {
        return (acc.balance || 0) < account.balance ? account : acc;
    }, {});

    // Mapping currency codes to symbols for display
    const currencySymbols = {
        USD: '$',
        KES: 'Ksh',
        GBP: '£',
        AUD: 'A$',
        EUR: '€',
    };

    const highestBalanceSymbol = currencySymbols[highestBalanceAccount?.currency] || '';
    const highestBalance = highestBalanceAccount ? highestBalanceAccount.balance : 0;
    const highestCurrency = highestBalanceAccount ? highestBalanceAccount.currency : '';

    return (
        <>
        <div className="bg-white mb-3 p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {/* Highest Balance Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-sm">{highestCurrency || 'Currency'} Balance</h5>
                    <p className="text-xs md:text-sm font-bold">
                        {highestBalanceSymbol || '$'} {highestBalance || '0'}
                    </p>
                </div>

                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <BiDollarCircle className="text-emerald-500 text-xl" />
                </div>
            </div>

            {/* Impact Points Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-sm">Bonus</h5>
                    <p className="text-xs md:text-sm font-bold">Ksh {user?.balance || '0'}</p>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <AiOutlineGift className="text-emerald-500 text-xl" />
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
                        + $
                    </span>
                </div>
            ))}
        </div>
        <TransferHistory />
        </>
    );
};

export default Wallet;
