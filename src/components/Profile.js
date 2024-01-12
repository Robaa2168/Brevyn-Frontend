// Profile.js
import React, { useState } from 'react';
import Kyc from './Kyc';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from "./context";
import EditProfile from './EditProfile';
import { AiOutlineCheck, AiFillPhone, AiOutlineMail, AiFillCalendar, AiFillIdcard, AiFillHome, AiFillFlag, AiFillEdit } from 'react-icons/ai';


const Profile = () => {
    const { user, login } = useUser();
    const [editMode, setEditMode] = useState(false);


    const information = [
        { label: 'First Name', value: user?.primaryInfo?.firstName, icon: <AiFillIdcard /> },
        { label: 'Last Name', value: user?.primaryInfo?.lastName, icon: <AiFillIdcard /> },
        { label: 'Phone', value: user?.primaryInfo?.phone, icon: <AiFillPhone /> },
        { label: 'Email', value: user?.primaryInfo?.email, icon: <AiOutlineMail /> },
        { label: 'Date of Birth', value: user?.primaryInfo?.dob ? new Date(user.primaryInfo.dob).toLocaleDateString() : "", icon: <AiFillCalendar /> },
        { label: 'ID Number', value: user?.primaryInfo?.idNumber, icon: <AiFillIdcard /> },
        { label: 'Town', value: user?.primaryInfo?.town, icon: <AiFillHome /> },
        { label: 'Country', value: user?.primaryInfo?.country, icon: <AiFillFlag /> }
    ];


    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveChanges = (information) => {
        console.log(information);
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const isKycAvailable = user?.primaryInfo?.firstName && user?.primaryInfo?.lastName;


    // Conditional rendering
    if (!isKycAvailable) {
        // Render Kyc component if KYC data is not available
        return <Kyc />;
    } else if (editMode) {
        // Render EditProfile component if in edit mode
        return (
            <EditProfile
                initialData={user?.primaryInfo}
                onSave={handleSaveChanges}
                onCancel={handleCancelEdit}
            />
        );
    } else {
        // Render profile view
        return (
            <div className="container bg-white rounded-md mx-auto">
                <div className="pt-4">
                    <div className="bg-white overflow-hidden sm:rounded-lg">
                        <div className="px-2 py-3 sm:px-4 grid grid-cols-1 md:grid-cols-3">
                            <div className="flex flex-col items-center py-4 text-center">
                                <img src={user?.profileImage} alt="Profile" className="h-20 w-20 rounded-full" />
                                <div className="mt-3 w-full">
                                    <h3 className="text-sm leading-6 font-medium text-gray-900 truncate">{user?.primaryInfo?.firstName + " " + user?.primaryInfo?.lastName}</h3>
                                    <span className={`text-xs rounded-full px-2 py-1 mt-1 inline-flex items-center ${user?.isBanned ? 'text-white bg-red-600' :
                                        user?.isVerified ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                        {user?.isBanned ? "Banned" :
                                            user?.isVerified ? <><AiOutlineCheck className="mr-1" /> Verified</> :
                                                "Unverified"}
                                    </span>



                                    <div className="text-xs text-gray-500 mt-1">{`Joined: ${new Date(user?.primaryInfo?.createdAt).toLocaleDateString()}`}</div>
                                </div>
                            </div>
                            <div className="md:grid md:grid-cols-2">
                                {information.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center px-2 py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                    >
                                        <div className="text-xs font-medium text-gray-500 flex items-center">
                                            {item.icon}
                                        </div>
                                        <div className="ml-2 flex-1">
                                            <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
                                            <dd className="text-xs text-gray-900">{item.value}</dd>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>


                    {/* Edit Profile Button */}
                    <div className="flex justify-end m-6 px-2">
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-5 font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <AiFillEdit className="mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Profile;
