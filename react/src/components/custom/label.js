import React from 'react'

const Label = ({title="", className="", isImportant=false, ...props}) => {
    return (
        <label className={`text-[12px] font-medium pb-[5px] ${className}` } {...props}>{title} {isImportant && <span className='text-[#ff4081]'>*</span>}</label>
    )
}

export default Label;