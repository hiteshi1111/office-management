import React from 'react'

const Error = ({message="", className=""}) => {
    return (
        <div className={`text-[#FF0000] ${className}`}>{message}</div>
    )
}

export default Error;