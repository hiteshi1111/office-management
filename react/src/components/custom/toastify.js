import React from 'react';
import { useSelector } from 'react-redux';

const Toastify = ({ className = "" }) => {
    const { toastify } = useSelector((state) => state.ui)
    return (
        <div className={`fixed bottom-[20px] right-0 bg-white px-[20px] py-[15px] shadow-md z-[9999] rounded-l-full !bg-black text-white max-w-[400px] ${toastify ? "block" : "hidden"} ${className}`}>{toastify}</div>
    )
}

export default Toastify;