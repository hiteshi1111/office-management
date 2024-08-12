import React, { useState } from 'react';
import ReactModal from '.';
import { AiOutlineDelete } from "react-icons/ai";

const Delete = ({label="", onClick=()=>{}}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button 
                onClick={() => setOpen(true)} 
                title='Delete' 
                className='rounded-full flex justify-center items-center text-[#fff] overflow-hidden hover:bg-[#e8f0fe] hover:text-[#264348] focus:bg-[#e8f0fe] h-[35px] w-[35px]'
            >
                <AiOutlineDelete size={15} color='#fd0000' />
            </button>
            <ReactModal open={open} close={() => setOpen(false)} maxWidth="600px" heading={label}>
                <div className='flex gap-[10px]'>
                    <button onClick={() => setOpen(false)} className='w-full border mt-[30px] h-[40px] border-[#ff4081] text-[#ff4081] rounded-full'>No</button>
                    <button onClick={onClick} className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full'>Yes</button>
                </div>
            </ReactModal>
        </>
    )
}

export default Delete;