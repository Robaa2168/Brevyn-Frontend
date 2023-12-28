import React, { useState } from 'react';

const EditProfile = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xs md:text-lg font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 md:grid md:grid-cols-2 md:gap-4">
        {/* Dynamic form fields based on initialData */}
        {Object.entries(formData).map(([key, value]) =>
          key !== 'profilePictureUrl' && ( // Assuming you're not editing the picture URL here
            <div key={key} className="md:flex md:items-center">
              <label htmlFor={key} className="text-xs sm:text-xs md:text-sm block mb-2 md:mb-0 md:w-1/3">{key}</label>
              <input
                type={key.includes('email') ? 'email' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs sm:text-xs md:text-sm  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )
        )}
        <div className="md:col-span-2 flex justify-end space-x-2">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition duration-300 text-xs sm:text-xs md:text-sm">Save Changes</button>
          <button onClick={onCancel} type="button" className="text-emerald-600 bg-transparent border border-emerald-600 px-4 py-2 rounded hover:bg-gray-100 transition duration-300 text-xs sm:text-xs md:text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
