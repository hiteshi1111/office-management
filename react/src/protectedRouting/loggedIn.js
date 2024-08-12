import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const LoggedInRoute = () => {
    const key = localStorage.getItem("xios");
    return key ? (
        key === "66a73941f3d3df2bfcda7d68" ? (
            <Navigate to="/mastermind/dashboard" />
        ):(
            <Navigate to="/account" />
        )
    ) : (
        <Outlet />
    );
};

export default LoggedInRoute;