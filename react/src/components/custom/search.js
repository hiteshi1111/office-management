import React from 'react'
import { FcSearch } from 'react-icons/fc';
import TextInput from './textInput';

const Search = ({placeholder="", value, onChange=()=>{}, className="", onClick=()=>{}, ...props}) => {
    return (
        <div className={`relative w-full ${className}`}>
            <FcSearch size={20} onClick={onClick} className={`absolute top-1/2 right-[5px] transform -translate-x-1/2 -translate-y-1/2 ${onClick && "cursor-pointer"}`} />
            <TextInput
                value={value}
                placeholder={placeholder}
                className='pr-[40px] pl-[20px] rounded-full'
                maxLength={50}
                onChange={onChange}
                {...props}
            />
        </div>
    )
}

export default Search;