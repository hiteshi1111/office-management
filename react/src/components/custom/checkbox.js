import React from 'react'

const Checkbox = ({checked=false, ...props}) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            className='select-none cursor-pointer'
            {...props}
        />
    )
}

export default Checkbox;