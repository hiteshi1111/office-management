import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichText = ({ value="", onChange=()=>{}, className="", ...props }) => {
    return (
        <ReactQuill 
            theme="snow" 
            value={value} 
            onChange={onChange} 
            className={`richtext-input focus:outline-none border-[#c4c4c4] border focus:border-[#1E40AF] rounded-[5px] focus:shadow-[0_0_2px_#000000] text-[14px] ${className}`}
            {...props}
        />
    );
};

export default RichText;