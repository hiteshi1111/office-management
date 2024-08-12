import React, { useState } from 'react';
import { MdDone, MdDoneAll, MdOutlineReply } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Avatar from '../custom/avatar';
import formatTime from "../../utils/formatTime";
import { useDispatch, useSelector } from 'react-redux';
import MessageActions from './messageActions';
import ReactionPicker from './reactionPicker';
import { formatDate } from '../../utils/formatDate';
import { PutRequest } from '../../utils/request';
import ChatSocket from "../../socket/chat-socket";
import { uiActions } from '../../store/ui-slice';
import { chatActions } from '../../store/chat-slice';
import { isEmojiMessage } from '../../utils/isEmojiMessage';
import { decrypt } from '../../utils/decryption';
import { BsEmojiSmile } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";

const SingleMessage = ({ 
    i, 
    item, 
    messageActionHandler, 
    allMessages, 
    selectedEmoji, 
    selectedAction, 
    togglePicker=()=>{}, 
    messageRef={}
}) => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { currentChat } = useSelector((state) => state.chat);

    const [hoveredReaction, setHoveredReaction] = useState(null);

    function handleEmojiClick(emoji) {
        PutRequest(`${process.env.REACT_APP_URL}/message/reaction/${item?._id}`, {
            userId: accountInfo?.data?._id,
            emoji: emoji
        }).then((response) => {
            ChatSocket.emitEmojiReactEvent(item?.id, emoji)
            dispatch(chatActions.setSelectedMessage(""))
            togglePicker(null)
        }).catch((error) => {
            console.log(error);
        });
    }

    const isSameTime = (message1, message2) => {
        return formatTime(message1?.createdAt) === formatTime(message2?.createdAt);
    };

    const isDifferentSender = (message1, message2) => {
        return message1?.from !== message2?.from;
    };

    const showAvatar = item?.from !== accountInfo?.data?._id && (i === 0 || isDifferentSender(item, allMessages[i - 1]) || !isSameTime(item, allMessages[i - 1]));

    const message = decrypt(item?.message) || "";

    return (
        <div
            key={i}
            onMouseLeave={() => messageActionHandler(null)} 
            className={`group flex mb-[5px] items-end gap-[10px] ${item?.from === accountInfo?.data?._id ? "justify-end" : "justify-start flex-order-col"}`}
        >
            <div className='msg-chat-order relative max-w-[80%] sm:max-w-[50%]' >
                {(i === 0 || isDifferentSender(item, allMessages[i - 1]) || !isSameTime(item, allMessages[i - 1])) && (
                    <div ref={messageRef} id={item?.createdAt} className={`text-[#aaa] text-[12px] flex pt-[10px] gap-[5px] ${item?.from === accountInfo?.data?._id ? "text-right" : "text-left"}`} >  
                        {formatTime(item?.createdAt)}
                    </div>
                )}
                <div className={`relative break-all ${item?.from === accountInfo?.data?._id ? "rounded-l-[20px] rounded-t-[20px]" : "rounded-r-[20px] rounded-t-[20px]"} ${item?.from !== accountInfo?.data?._id && !showAvatar && "!rounded-l-none rounded-ee-[20px] !rounded-bl-[20px]"} ${!item?.isRemoved && (isEmojiMessage(message) && message.length <= 6) ? "border-0 bg-transparent" : "border bg-white p-[10px] px-[20px]"}`}>
                    {item?.isRemoved ? (
                        <p className='text-[#aaa]'>Message has been removed by its author</p>
                    ) : (
                        (item?.forwardedFrom || item?.replyTo) ? (
                            <div>
                                {item?.forwardedFrom && (
                                    <p className='text-[#aaa] text-[12px] mb-[5px]'>Forwarded Message</p>
                                )}
                                <div className='relative border p-[10px] border-l-[3px] border-l-[#C15817] mb-[5px]'>
                                    <MdOutlineReply size={15} className='mr-[10px]' />
                                    {(item?.forwardedFrom?.image || item?.replyTo?.image) && (
                                        <img
                                            src={item?.forwardedFrom?.image || item?.replyTo?.image}
                                            alt={item?._id}
                                            className='max-w-[100px]'
                                        />
                                    )}
                                    <div 
                                        className='richtext' 
                                        dangerouslySetInnerHTML={{__html: decrypt(item?.forwardedFrom?.message) || decrypt(item?.replyTo?.message)}}
                                    />
                                    <div className='text-[#aaa] text-[12px]'>{item?.forwardedFrom?.from?.fullName || item?.replyTo?.from?.fullName} ({formatDate(item?.forwardedFrom?.createdAt || item?.replyTo?.createdAt)})</div>
                                </div>
                                <div 
                                    className={`${isEmojiMessage(message) ? message.length <= 6 ? "text-[50px]" : "text-[30px]" : "text-[14px]"}`}
                                    dangerouslySetInnerHTML={{__html: message}}
                                />
                            </div>
                        ) : (
                            <div>
                                {item?.image && (
                                    <div className={`max-w-[180px] mb-[5px] ${item?.from === accountInfo?.data?._id ? "ml-auto" : "mr-auto"}`}>
                                        <img
                                            src={item?.image}
                                            alt={item?._id}
                                        />
                                    </div>
                                )}
                                <div 
                                    className={`${isEmojiMessage(message) ? message.length <= 6 ? "text-[50px]" : "text-[30px]" : "text-[14px]"}`}
                                    dangerouslySetInnerHTML={{__html: message}}
                                />
                            </div>
                        )
                    )}
                    {item?.from === accountInfo?.data?._id && (
                        <div className='absolute bottom-0 right-[5px]'>
                            {item?.isRead ? (
                                <MdDoneAll color='#aaa' />
                            ) : (
                                <MdDone color='#aaa' />
                            )}
                        </div>
                    )}
                    {message && !item?.isRemoved && currentChat?.blockedBy?.length === 0 && currentChat?.isFriend && (
                        <div className={`absolute top-[5px] ${item?.from === accountInfo?.data?._id ? "left-[-23px]" : "right-[-23px]"}`}>
                            {item?.from !== accountInfo?.data?._id && (
                                <div className="relative">
                                    <BsEmojiSmile
                                        size={15}
                                        color='#aaa'
                                        onClick={() => togglePicker(item?._id)}
                                        className='cursor-pointer'
                                    />
                                    <div className={`absolute bottom-[20px] left-0 md:right-0 max-md:right-[-70px] ${selectedEmoji?.toString() === item._id ? "block" : "hidden"}`}>
                                        <ReactionPicker
                                            emoji={item?.reactions} 
                                            handleEmojiClick={handleEmojiClick}
                                        />
                                    </div>
                                </div>
                            )}
                            {item.isEdited && (
                                <div className="relative mt-[5px]">
                                    <FiEdit2
                                        size={15}
                                        color='#aaa'
                                        title='Edited'
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {!item?.isRemoved && item?.reactions?.length > 0 && (
                        <div className='mb-[-25px] flex flex-wrap gap-[5px] pb-[10px]'>
                            {item?.reactions?.map((item, i) => (
                                <div 
                                    key={i}
                                    onClick={() => handleEmojiClick(item?.emoji)}
                                    onMouseEnter={() => setHoveredReaction(i)}
                                    onMouseLeave={() => setHoveredReaction(null)}
                                    className='text-[18px] h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center shadow-md cursor-pointer relative'
                                >
                                    {item?.emoji}
                                    {hoveredReaction === i && (
                                        <div className='absolute flex flex-col bottom-[30px] w-[80px] text-[12px] p-[8px] bg-[#111827] text-white rounded shadow-md items-center justify-center'>
                                            <span className='text-[28px] absolute top-[-25px]'>{item?.emoji}</span>
                                            <p className='break-words'>{item?.user?.fullName}</p>
                                           {(item?.user?._id === accountInfo?.data?._id) && <span>(Me)</span> }
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={`msg-avatar-order ${item?.from !== accountInfo?.data?._id ? "block" : "hidden"}`}>
                <Avatar
                    src={(!currentChat?.blockedBy?.includes(currentChat?.userData?._id) && !currentChat?.blockedBy?.includes(accountInfo?.data?._id))
                        ? currentChat?.settings?.showAvatar 
                            ? item?.from === accountInfo?.data?._id 
                                ? accountInfo?.data?.avatar 
                                : currentChat?.userData?.avatar 
                            : "" 
                        : ""
                    }
                    alt={accountInfo?.data?.fullName}
                    onClick={() => dispatch(uiActions.setShowProfile(true))}
                    noOnline
                    className={item?.from !== accountInfo?.data._id && showAvatar ? "visible" : "invisible"}
                />
            </div>
            <div className={`mb-[24px] relative ${item?.isRemoved ? "opacity-0" : "group-hover:opacity-100 opacity-0"}`}>
                <HiOutlineDotsVertical
                    size={15}
                    color='#aaa'
                    className='cursor-pointer block'
                    onClick={() => messageActionHandler(item?._id)}
                />
                <MessageActions
                    data={item}
                    className={`${item?._id === selectedAction ? "block" : "hidden"} ${(i + 1 === allMessages?.length || i + 1 === allMessages?.length-1) ? "bottom-[20px]" : "top-[20px]"} ${item?.from === accountInfo?.data?._id ? "right-0" : "left-0"}`}
                    message={message}
                    isMe={item?.from === accountInfo?.data?._id}
                />
            </div>
        </div>
    );
};

export default SingleMessage;