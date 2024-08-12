import React from 'react';

const Button = ({ label="", onClick=()=>{}, className="", secondary=false }) => {
    return (
        secondary ? (
            <button onClick={onClick} className={`w-full inline-flex justify-center items-center gap-[5px] text-[#fff] bg-[#FF4081] h-[40px] text-[16px] leading-[27px] text-center rounded-full ${className}`}>
                {label} 
            </button>
        ):(
            <button onClick={onClick} className={`w-full inline-flex justify-center items-center gap-[5px] border border-[#594cda] text-[#fff] bg-[#594cda] hover:text-[#594cda] hover:bg-[#fff] h-[40px] text-[16px] leading-[27px] font-medium text-center rounded-full ${className}`}>
                {label} 
            </button>
        )
    )
}

export default Button;