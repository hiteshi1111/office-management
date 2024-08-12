import React from 'react'

const Textarea = ({id="", type="", disabled=false, value={}, onChange=()=>{}, className="", placeholder="", errorText="", ...props}) => {
    return (
        <>
        <textarea
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={type || "text"}
            id={id}
            className={`h-[70px] w-full focus:outline-none hover:border-black border-[#c4c4c4] p-[8px] border focus:border-[#1E40AF] rounded-[5px] focus:shadow-[0_0_2px_#000000] text-[14px] ${className}`}
            {...props}
        />
        {errorText && (
            <span className='text-[#FF0000] text-[12px]'>{errorText}</span>
        )}
        </>
    )
}

export default Textarea;