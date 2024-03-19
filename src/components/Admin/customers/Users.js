// Users.js
import React, { useState, useEffect } from 'react';
import api from '../../../api';
import Modal from 'react-modal';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Necessary if using react-modal to avoid accessibility issues

const Users = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('email'); // Default search type
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchType, searchTerm]);

    const fetchUsers = async () => {
        const queryParams = { page: currentPage, limit: usersPerPage };

        // Only add search parameters if they have been set by the user
        if (searchTerm) {
            queryParams[searchType] = searchTerm;
        }

        try {
            const response = await api.get('/api/admin/users', {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setUsers(response.data.users);
            const totalItems = response.data.total;
            setTotalPages(Math.ceil(totalItems / usersPerPage));
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };


    // Function to confirm banning user
    const confirmBan = async () => {
        if (userToBan) {
            try {
                await api.patch(`/api/admin/${userToBan._id}/toggleBan`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Adding bearer token
                    },
                });
                toast.success(`User ${userToBan.isBanned ? 'unbanned' : 'banned'} successfully`);
                setShowBanModal(false);
                fetchUsers(); // Re-fetch users to update the list
            } catch (error) {
                toast.error("Failed to toggle ban status");
            }
        }
    };

    // Function to confirm deleting user
    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await api.delete(`/api/admin/${userToDelete._id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Adding bearer token
                    },
                });
                toast.success("User deleted successfully");
                setShowDeleteModal(false);
                fetchUsers(); // Re-fetch users to update the list
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers();
    };

    const handleBanToggle = (user) => {
        setUserToBan(user);
        setShowBanModal(true);
    };

    const handleDeleteUserClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };


    const getPagination = () => {
        const delta = 1; 
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }
        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }
        range.unshift(1);
        if (totalPages !== 1) range.push(totalPages);

        return range.map((page, index) => page === "..." ? <span key={index} className="px-2">...</span> : <button key={index} onClick={() => setCurrentPage(page)} className={`px-2 py-1 ${page === currentPage ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>{page}</button>);
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            <ToastContainer />
            <form onSubmit={handleSearch} className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <select value={searchType} onChange={handleSearchTypeChange} className="border p-2 rounded text-xs">
                    <option value="email">Email</option>
                    <option value="payId">Pay ID</option>
                    <option value="phoneNumber">Phone Number</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="border p-2 rounded text-xs flex-grow"
                />
                <button type="submit" className="border p-2 rounded bg-emerald-500 text-white text-xs">
                    Search
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Pay ID</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone Number</th>
                            <th className="border p-2 text-center">Associated Accounts</th>
                            <th className="border p-2 text-center">Toggle Ban</th>
                            <th className="border p-2 text-center">View More</th>
                            <th className="border p-2 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className="border p-2">{user.payId}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.phoneNumber}</td>
                                    <td className="border p-2 text-center">{user.associatedAccountsCount}</td>
                                    <td className="border p-2 text-center">
                                    <button
    onClick={() => handleBanToggle(user)}
    className={`px-4 py-2 text-white rounded text-xs ${user.isBanned ? 'bg-red-500' : 'bg-emerald-500'}`}
>
    {user.isBanned ? 'Unban' : 'Ban'}
</button>

                                    </td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() => navigate(`/user-details/${user._id}`)}
                                            className="px-4 py-2 border border-gray-300 rounded text-xs hover:bg-gray-100"
                                        >
                                            View More
                                        </button>
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() => handleDeleteUserClick(user)}
                                            className="px-4 py-2 text-white rounded text-xs bg-red-600 hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border p-2 text-center" colSpan="6">User not found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center space-x-2 mt-4">
                    {getPagination()}
                </div>
                {showBanModal && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-lg font-semibold">Confirm {userToBan?.isBanned ? 'Unban' : 'Ban'}</h2>
            <p className="my-4">Are you sure you want to {userToBan?.isBanned ? 'unban' : 'ban'} {userToBan?.email}?</p>
            <div className="flex justify-end space-x-2">
                <button onClick={() => setShowBanModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                <button onClick={confirmBan} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
            </div>
        </div>
    </div>
)}



                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
                            <h2 className="text-lg font-semibold">Confirm Delete</h2>
                            <p className="my-4">Are you sure you want to delete {userToDelete?.email}?</p>
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

};

export default Users;
