import React from 'react';
import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";

const ReactModal = ({children, open=false, close=()=>{}, maxWidth="", heading="", padding="", bgColor="", noClose=false}) => {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: padding || '20px',
            maxWidth: maxWidth || '80%',
            width: "calc(100% - 20px)",
            maxHeight: "90vh",
            backgroundColor: bgColor || "#ffffff",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        },
    };
    return (
        <Modal
            isOpen={open}
            onRequestClose={close}
            style={customStyles}
            contentLabel="Mantaraa"
        >
            <div className='flex justify-between gap-[30px] items-start'>
                {heading && (
                    <div className="border py-[10px] w-full rounded-r-full bg-[#fff0f5] flex items-center px-[20px] shadow-md mb-[30px] max-w-[90%]">
                        <h5>{heading}</h5>
                    </div>
                )}
                {!noClose && (
                    <button title='Close' onClick={close} className='absolute top-[10px] right-[10px]'>
                        <IoMdClose size={20} />
                    </button>
                )}
            </div>
            {children}
        </Modal>
    )
}


export default ReactModal;