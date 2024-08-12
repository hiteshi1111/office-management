import React, { useEffect, useState } from 'react';
import ReactModal from '.';
import { RiShareForwardFill } from 'react-icons/ri';
import { formatDate } from '../utils/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../store/chat-slice';
import { GetRequest, PostRequest } from '../utils/request';
import Avatar from '../components/custom/avatar';
import ChatSocket from "../socket/chat-socket";
import { encrypt } from '../utils/encryption';
import { decrypt } from '../utils/decryption';

const ForwardMessage = (props) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { currentChat, forwardData, triggerChat } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);
    const [message, setMessage] = useState("");
    const [conversationList, setConversationList] = useState([]);
    const [sentList, setSentList] = useState([]);

    function openHandler() {
        setOpen(true);
        dispatch(chatActions.setForwardData(props));
    }

    function closeHandler() {
        setOpen(false);
        dispatch(chatActions.setForwardData(props));
        setSentList([]);
        setMessage("");
    }

    useEffect(() => {
        if (accountInfo) {
            GetRequest(`${process.env.REACT_APP_URL}/conversation/${accountInfo?.data?._id}`).then(response => {
                setConversationList(response.data);
            }).catch(error => {
                console.log("conversation error >>>", error?.data);
            });
        }
    }, [accountInfo, triggerChat]);

    function messageForward(id, convoId) {
        PostRequest(`${process.env.REACT_APP_URL}/message`, {
            conversationId: convoId,
            to: id,
            from: accountInfo.data._id,
            message: encrypt(message),
            forwardedFrom: forwardData?._id || null,
        }).then(response => {
            ChatSocket.emitNewMessage(response.data.message);
            setSentList(prevList => [...prevList, id]);
        }).catch(error => {
            console.log("search error >>>", error);
        });
    }
    
    // Filter conversation list
    const filteredConversations = conversationList.filter(item => {
        const isBlocked = item.blockedBy?.includes(item.participants[0]?._id) || item.blockedBy?.includes(accountInfo?.data?._id);
        const isFriend = item.isFriend === true;
        return !isBlocked && isFriend;
    });

    return (
        <>
            <button
                onClick={openHandler}
                className='flex items-center px-[15px] py-[5px] hover:bg-[#f5f5f5] w-full'
            >
                <RiShareForwardFill
                    size={15}
                    className='mr-[10px]'
                />
                Forward
            </button>
            <ReactModal open={open} close={closeHandler} maxWidth="500px" heading="Forward Message" padding='20px'>
                <div className='p-[20px] bg-[#f8f8ff] mb-[20px]'>
                    <div className='relative border p-[10px] border-l-[3px] border-l-[#C15817] shadow-sm w-full mb-[10px]'>
                        <RiShareForwardFill size={15} className='mr-[10px]' />
                        {forwardData?.image && (
                            <img
                                src={forwardData?.image}
                                alt={currentChat?.userData.fullName}
                                className='w-[150px] h-[150px] bg-white'
                            />
                        )}
                        <div className='overflow-hidden my-[5px] richtext' dangerouslySetInnerHTML={{ __html: decrypt(forwardData?.message) }} />
                        <div className='text-[#aaa] text-[12px]'>{currentChat?.userData.fullName} ({formatDate(currentChat?.userData.createdAt)})</div>
                    </div>
                    <input
                        placeholder='any message? (optional)'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className='w-full px-[10px] outline-none h-[40px]'
                    />
                </div>
                <div className={`${filteredConversations.length > 0 && 'scroll-it overflow-hidden overflow-y-scroll'} px-[10px] max-h-[300px] `}>
                    {conversationList.length > 0 ? (
                        filteredConversations.length > 0 ? (
                            <div className='grid gap-[10px] w-full'>
                                {filteredConversations.map((item, i) => (
                                    <div key={i} className='flex items-center justify-between gap-[10px] w-full'>
                                        <div className='flex items-center justify-start gap-[10px] w-full'>
                                            <Avatar
                                                src={item.settings?.showAvatar ? item.participants[0]?.avatar : ""}
                                                className='w-[45px] h-[45px]'
                                                noOnline
                                            />
                                            <div className='text-left text-wrap'>{item?.participants[0]?.fullName}</div>
                                        </div>
                                        <button
                                            onClick={() => messageForward(item?.participants[0]?._id, item?._id)}
                                            className={`bg-[#ff4081] text-white rounded-full px-[20px] py-[5px] ${sentList.includes(item?.participants[0]?._id) && "bg-white border border-[#ff4081] !text-[#ff4081] pointer-events-none"}`}
                                        >
                                            {sentList.includes(item?.participants[0]?._id) ? "Sent" : "Send"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-center mt-[30px]'>No friends!</p>
                        )
                    ) : (
                        <p className='text-center mt-[30px]'>Loading...</p>
                    )}
                </div>
            </ReactModal>
        </>
    );
}

export default ForwardMessage;
