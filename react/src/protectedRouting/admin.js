import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { accountInfo } = useSelector((state) => state.account);
    return accountInfo && accountInfo.data.role.title.toLowerCase() === "admin" ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

export default AdminRoute;