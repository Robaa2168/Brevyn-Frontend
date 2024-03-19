// AdminPanelContainer.js
import React from 'react';
import SummaryCards from './SummaryCards';
import Users from './customers/Users';

const AdminPanelContainer = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
            <SummaryCards />
            <Users />
        </div>
    );
};

export default AdminPanelContainer;
