import React from 'react'
import CopyToClipboard from '../../utils/copyToClipboard';
import { IoIosRemoveCircleOutline, IoMdCopy } from 'react-icons/io';
import { MdOutlineReply } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui-slice';
import { PutRequest } from '../../utils/request';
import { chatActions } from '../../store/chat-slice';
import ForwardMessage from '../../popups/forwardMessage';
import ChatSocket from "../../socket/chat-socket";
import { FiEdit2 } from "react-icons/fi";

const MessageActions = ({ data, message = "", className = "", isMe = false }) => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { currentChat } = useSelector((state) => state.chat);

    function afterCopyHandler() {
        dispatch(uiActions.setToastify("Copied to Clipboard!"));
        const timer = setTimeout(() => {
            dispatch(uiActions.setToastify(""));
        }, 1000);
        return () => clearTimeout(timer);
    }
    function removeHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/message/remove/${data?._id}`).then((response) => {
            ChatSocket.emitRemoveMessage();
        }).catch((error) => {
            console.log("remove msg error", error);
        });
    }

    return (
        <div className={`bg-white shadow-md p-[5px] absolute w-full right-0 w-full min-w-[150px] z-[9999999999] ${className}`}>
            <button onClick={() => CopyToClipboard(message, afterCopyHandler)} className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'>
                <IoMdCopy size={18} className='mr-[10px]' /> Copy
            </button>
            {isMe && message && (
                <button         
                    onClick={() => {
                        dispatch(chatActions.setEditing(data?._id))
                        dispatch(chatActions.setMessage(message))
                    }}
                    className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'
                ><FiEdit2 size={16} className='mr-[10px]' /> Edit</button>
            )}
            {(!currentChat?.blockedBy?.includes(accountInfo?.data?._id) && !currentChat?.blockedBy?.includes(currentChat?.userData?._id)) && message && (currentChat?.isFriend || isMe) && (
                <button
                    onClick={() => dispatch(chatActions.setReplyData(data))}
                    className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'
                ><MdOutlineReply size={20} className='mr-[10px]' /> Reply</button>
            )}
            <ForwardMessage {...data} />
            {(!currentChat?.blockedBy?.includes(accountInfo?.data?._id) && !currentChat?.blockedBy?.includes(currentChat?.userData?._id)) && isMe && (
                <button onClick={removeHandler} className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'>
                    <IoIosRemoveCircleOutline size={18} className='mr-[10px]' /> Remove
                </button>
            )}
        </div>
    )
}

export default MessageActions;