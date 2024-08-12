import React, { useState } from 'react';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Dropdown = ({ id = "", disabled = false, value = "", onChange = () => {}, className = "", options = [], placeholder = "Select...", errorText = "", ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} onMouseLeave={() => setIsOpen(false)} {...props}>
            <button
                id={id}
                disabled={disabled}
                onClick={handleToggle}
                className={`h-[40px] w-full focus:outline-none border-[#c4c4c4] px-[10px] border focus:border-[#1E40AF] rounded-[5px] focus:shadow-[0_0_2px_#000000] text-[14px] bg-white ${disabled && "hover:border text-[#aaa]"} flex justify-between items-center`}
            >
                <span>{value || placeholder}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><MdOutlineKeyboardArrowDown/></span>
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full bg-white border border-[#c4c4c4] rounded-[5px] max-h-60 overflow-y-auto">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className={`px-[10px] py-[8px] hover:bg-[#f5f5f5] cursor-pointer ${option === selectedOption ? 'bg-green-400 text-white hover:bg-[#f5f5f5]  hover:text-black' : ''}`}
                            >
                            {option.title}
                        </div>
                    ))}
                </div>
            )}







            
            {errorText && (
                <span className='text-[#FF0000] text-[12px]'>{errorText}</span>
            )}
        </div>
    );
};

export default Dropdown;
