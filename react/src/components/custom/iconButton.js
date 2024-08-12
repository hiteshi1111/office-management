import React from 'react'

const IconButton = ({ icon, onClick = () => { }, className = "", ...props }) => {
    return (
        <button
            onClick={onClick}
            className={` rounded-full border flex justify-center items-center text-[#fff] bg-[#264348] overflow-hidden hover:bg-[#e8f0fe] hover:text-[#264348] focus:bg-[#e8f0fe] ${className}`}
            {...props}
        >{icon}</button>
    )
}

export default IconButton;