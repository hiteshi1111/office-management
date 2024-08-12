import React from 'react'
import { IoIosClose } from 'react-icons/io'

const Media = (props) => {
    return (
        <div className='bg-white border-x rounded-t-[20px]'>
            <div className='mx-[10px] border-b p-[20px]'>
                <div className='max-w-[150px] h-auto border relative'>
                    <img
                        src={props.image}
                        alt="Selected"
                    />
                    <IoIosClose
                        size={20}
                        className='absolute z-2 top-0 right-0 cursor-pointer'
                        onClick={() => props.setImage(null)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Media