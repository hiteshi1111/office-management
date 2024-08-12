import React, { useState } from 'react'
import ReactModal from '.';
import { RiEditBoxLine } from "react-icons/ri";
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import Error from '../components/custom/error';

const UpdateEvent = ({label, onClick, id}) => {
  const [open, setOpen] = useState(false);
  const [updatedLabel, setUpdatedLabel] = useState(label)
  const [error, setError] = useState("");

  const handleUpdate = () => {
    if(!updatedLabel){
      setError("Field must not be empty!");
    }
    else{
      onClick({ id, label: updatedLabel });
      setOpen(false);
    }
  };

  const handleClose = () => {
    setUpdatedLabel(label)
    setOpen(false)
  }

  return (
    <>
      <button title='Edit' onClick={() => setOpen(true)} className='rounded-full flex justify-center items-center text-[#fff] overflow-hidden hover:bg-[#e8f0fe] hover:text-[#264348] focus:bg-[#e8f0fe] h-[35px] w-[35px]'>
        <RiEditBoxLine size={15} color='#000000' />
      </button>
      <ReactModal open={open} close={handleClose} maxWidth="600px" heading={`Update Event "${label}"`}>
      {error && <Error message={error}/>}
        <Label title='Label'/>
        <TextInput 
          value={updatedLabel}
          onChange={(e) => {setUpdatedLabel(e.target.value); setError("");}}          
          placeholder='update event'
          className='mt-[5px]'
        />
        <button onClick={handleUpdate} className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full'>Update Event</button>
      </ReactModal>
    </>
  )
}

export default UpdateEvent;