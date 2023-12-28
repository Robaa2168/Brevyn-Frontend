// ChangePassword.js
import React, { useState } from 'react';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement password validation and submission logic here
    if(passwords.newPassword === passwords.confirmPassword) {
      console.log("Change Password Submitted", passwords);
      // Integrate with your backend or state management
    } else {
      alert("New passwords do not match!");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xs font-bold mb-4">New Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="text-xs sm:text-xs block mb-2">Current Password</label>
          <input 
            type="password" 
            name="currentPassword" 
            value={passwords.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="text-xs sm:text-xs block mb-2">New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            value={passwords.newPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-xs sm:text-xs block mb-2">Confirm New Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={passwords.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded transition duration-300 text-xs sm:text-xs"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
