import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminRoute = () => {
    const key = localStorage.getItem("xios");
    return key ? (
        key === "66a73941f3d3df2bfcda7d68" ? (
            <Outlet />
        ):(
            <Navigate to="/login" />
        )
    ) : (
        <Outlet />
    );
};

export default SuperAdminRoute;