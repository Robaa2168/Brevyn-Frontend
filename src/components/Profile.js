// Profile.js
import React, { useState } from 'react';
import EditProfile from './EditProfile';  
import { AiOutlineMail, AiOutlineUser, AiFillEdit, AiOutlinePhone } from 'react-icons/ai';
import { BsFillCalendarFill } from 'react-icons/bs';
import { MdOutlineFlag } from 'react-icons/md';

const Profile = () => {
    const [editMode, setEditMode] = useState(false);
    const profileInfo = {
        firstName: 'John',
        lastName: 'Doe',
        dateJoined: '2021-01-01',
        idNumber: '123456789',
        dob: '1990-01-01',
        country: 'Neverland',
        phoneNumber: '+123456789',
        emailAddress: 'john.doe@example.com',
        profilePictureUrl: 'https://via.placeholder.com/150',
    };

    const information = [
        { label: "Email", value: profileInfo.emailAddress, icon: <AiOutlineMail /> },
        { label: "Joined Date", value: profileInfo.dateJoined, icon: <BsFillCalendarFill /> },
        { label: "ID Number", value: profileInfo.idNumber, icon: <AiOutlineUser /> },
        { label: "Date of Birth", value: profileInfo.dob, icon: <AiOutlineUser /> },
        { label: "Country", value: profileInfo.country, icon: <MdOutlineFlag /> },
        { label: "Phone Number", value: profileInfo.phoneNumber, icon: <AiOutlinePhone /> },
        // Add more fields as needed
    ];

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveChanges = (updatedProfileInfo) => {
        // Here, you'd typically update the profile information in the state or context and make an API call
        console.log(updatedProfileInfo);
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };
    return editMode ? (
        <EditProfile initialData={profileInfo} onSave={handleSaveChanges} onCancel={handleCancelEdit} />
      ) : (
            <div className="container mx-auto">
                <div className="pt-4">
                    <div className="bg-white overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-3">
                            <div className="col-span-1 flex flex-col items-center py-4">
                                <img src={profileInfo.profilePictureUrl} alt="Profile" className="h-24 w-24 rounded-full" />
                                <div className="mt-3">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{profileInfo.firstName + " " + profileInfo.lastName}</h3>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <dl>
                                    {information.map((item, index) => (
                                        <div key={index} className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <dt className="text-xs font-medium text-gray-500 flex items-center">
                                                {item.icon} <span className="ml-2">{item.label}</span>
                                            </dt>
                                            <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleEditClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-xs leading-5 font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <AiFillEdit className="mr-2" />
                        Edit Profile
                    </button>
                </div>
            </div>
    );
};

export default Profile;
