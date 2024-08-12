import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const DefaultRoute = () => {
    const isKey = localStorage.getItem("xios");
    return isKey ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

export default DefaultRoute;