import React, { useState } from 'react';
import ReactModal from '.';
import Loader from '../components/custom/loader';
import Button from '../components/custom/button';
import IconButton from '../components/custom/iconButton';
import { MdDelete } from "react-icons/md";

const DeleteConfirmation = ({ close=()=>{}, onClick=()=>{}, description="", className="" }) => {
    const [ open, setOpen ] = useState(false);
    const [ disabled, setDisabled ] = useState(false);

    function closeHandler(){
        setOpen(false);
        setDisabled(false);
        close()
    }
    return (
        <>
        <IconButton 
            title="Delete"
            icon={<MdDelete size={20} color='#000' />}
            className={`h-[40px] !min-w-[40px] bg-white ${className}`}
            onClick={() => setOpen(true)}
        />
        <ReactModal open={open} close={closeHandler} maxWidth="600px">
            {disabled && <Loader />}
            <h3 className='text-center'>Delete Confirmation</h3>
            <p className='text-center text-[14px] max-w-[410px] mx-auto'>{description || "Are you sure you want to delete this?"}</p>
            <div className='flex gap-[10px] mt-[50px]'>
                <Button
                    label='Cancel'
                    onClick={closeHandler}
                    secondary
                />
                <Button
                    label='Confirm'
                    onClick={() => {
                        setDisabled(true);
                        onClick()
                    }}
                />
            </div>
        </ReactModal>
        </>
    )
}

export default DeleteConfirmation;