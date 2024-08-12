import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PutRequest } from '../../utils/request';
import { GiFox } from 'react-icons/gi';
import ChatSocket from "../../socket/chat-socket";
import { chatActions } from '../../store/chat-slice';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '../custom/avatar';

const RecentChat = ({ getRequest = () => { }, ...props }) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { currentChat, chatList } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);

    function handleOpenChat(friend) {
        dispatch(chatActions.setCurrentChat(friend))
        PutRequest(`${process.env.REACT_APP_URL}/message/seen/${friend.convoId}`).then((response) => {
            ChatSocket.emitOpenChat(friend?.userData._id, accountInfo?.data?._id);
        }).catch((error) => {
            console.log("error seeing messages", error)
        })
    }
    return (
        <div className={`bg-white overflow-hidden overflow-y-auto py-[10px] px-[10px]`}>
            <div className='text-[12px] text-[#aaa] text-left'>Recent Chats</div>
            {chatList.length > 0 ? (
                <div className='grid grid-cols-3 gap-[10px] items-start mt-[10px]'>
                    {chatList.map((item, i) => (
                        item.participants.length > 1 ? (
                            <Link key={i} to="/chat">
                                <Avatar
                                    className='w-[45px] h-[45px] mx-auto'
                                    isOnline
                                    isGroup
                                    onClick={() => dispatch(chatActions.setCurrentChat(item?._id))}
                                />
                                <div className='text-center text-wrap'>Group</div>
                            </Link>
                        ) : (
                            <Link key={i} to="/chat" {...props}>
                                <Avatar
                                    id={item.participants[0]?._id}
                                    src={!item.blockedBy?.includes(item.participants[0]?._id) ? item.settings?.showAvatar && item.participants[0]?.avatar : ""}
                                    className={`w-[45px] h-[45px] mx-auto ${pathname === "/chat" && currentChat?.userData?._id === item?.participants[0]?._id && "!border-[2px] !border-[#264348]"}`}
                                    onClick={() => {
                                        dispatch(chatActions.setLoadingChat(true))
                                        handleOpenChat({
                                            convoId: item._id,
                                            userData: item.participants[0],
                                            isFriend: item.isFriend,
                                            blockedBy: item.blockedBy,
                                            settings: item.settings
                                        })
                                        getRequest(item._id);
                                    }}
                                    isFriend={item?.isFriend}
                                    chatList={item}
                                // isBlocked={item.blockedBy.includes(item.participants[0]?._id) || false}
                                />
                                <div className={`text-center text-wrap text-[12px] ${pathname === "/chat" && currentChat?.userData?._id === item?.participants[0]?._id && "font-semibold"}`}>{item?.participants[0]?.fullName.length > 15 ? `${item?.participants[0]?.fullName.slice(0, 15)}...` : item?.participants[0]?.fullName}</div>
                            </Link>
                        )
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center flex-grow h-full'>
                    <GiFox size={30} color='#C15817' />
                    <div className='text-center text-wrap mt-[10px]'>Quiet <br /> Coyote</div>
                </div>
            )}
        </div>
    )
}

export default RecentChat;