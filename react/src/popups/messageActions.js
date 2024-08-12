import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from '.';
import { chatActions } from '../store/chat-slice';
import { uiActions } from '../store/ui-slice';
import CopyToClipboard from '../utils/copyToClipboard';
import { PutRequest } from '../utils/request';
import { IoIosRemoveCircleOutline, IoMdCopy } from 'react-icons/io';
import ChatSocket from "../socket/chat-socket";
import { MdOutlineReply } from 'react-icons/md';
import ForwardMessage from './forwardMessage';

const Actions = ({data, message="", isMe=false}) => {
    const dispatch = useDispatch();
    const { openActions } = useSelector((state) => state.chat);

    function afterCopyHandler(){
        dispatch(uiActions.setToastify("Copied to Clipboard!"));
        const timer = setTimeout(() => {
            dispatch(uiActions.setToastify(""));
        }, 1000);
        return () => clearTimeout(timer);
    }
    function removeHandler(){
        PutRequest(`${process.env.REACT_APP_URL}/message/remove/${data._id}`).then((response) => {
            ChatSocket.emitRemoveMessage();
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <ReactModal open={openActions} close={() => dispatch(chatActions.setOpenActions(false))}>
            <div>
                <button onClick={() => CopyToClipboard(message, afterCopyHandler)} className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'>
                    <IoMdCopy size={15} className='mr-[10px]' /> Copy
                </button>
                {message && (
                    <button
                        onClick={() => dispatch(chatActions.setReplyData(data))} 
                        className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'
                    ><MdOutlineReply size={15} className='mr-[10px]' /> Reply</button>
                )}
                <ForwardMessage {...data} />
                {isMe && (
                    <button onClick={removeHandler} className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'>
                        <IoIosRemoveCircleOutline size={15} className='mr-[10px]' /> Remove
                    </button>
                )}
            </div>
        </ReactModal>
    )
}

export default Actions;