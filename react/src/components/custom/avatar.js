import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";
import UserSocket from "../../socket/user-socket";

const Avatar = ({
    userId = "",
    id = "",
    src = "",
    className = "",
    size = 25,
    isGroup = false,
    noOnline = false,
    onClick = () => { },
    isFriend = false,
    chatList = "",
    ...props
}) => {
    UserSocket.useOnlineOfflineEvents(userId);
    const { accountInfo } = useSelector((state) => state.account);
    const { onlineUsers, currentChat } = useSelector((state) => state.chat);

    const isOnline = (checkUserId) => {
        if (checkUserId === accountInfo?.data._id) {
            return true; // Always show online for yourself
        }
        return onlineUsers.some((user) => user?.userId === checkUserId);
    };
    const showAvatar = currentChat?.settings?.showAvatar ?? true;

    const isBlocked = chatList?.blockedBy?.includes(accountInfo?.data._id) || chatList?.blockedBy?.includes(chatList?.participants[0]?._id);
    const showOnlineStatus = !isBlocked && chatList?.isFriend && !isGroup && !noOnline && isFriend;
    const showProfilePicture = !isBlocked && src;


    return (
        <button onClick={onClick} className={`h-[40px] w-[40px] flex justify-center items-center border border-[#aaa] rounded-full relative ${className}`} {...props}>
            {showProfilePicture ? (
                <img src={src} alt={props.alt} className="rounded-full w-full h-full" />
            ) : (
                isGroup ? (
                    <HiOutlineUserGroup size={size} color='#264348' />
                ) : (
                    <AiOutlineUser size={size} color='#aaa' />
                )
            )}
            {userId ? (
                isOnline(id) && showAvatar ? (
                    <span className="absolute bottom-[2px] right-[2px] flex h-[10px] w-[10px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008000] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-[#008000]"></span>
                    </span>
                ) : (
                    <div className="absolute bottom-[2px] right-[2px] w-[10px] h-[10px] bg-[#aaa] rounded-full"></div>
                )
            ) : (
                showOnlineStatus && (
                    isOnline(id) ? (
                        <span className="absolute bottom-0 right-0 flex h-[10px] w-[10px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008000] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-[#008000]"></span>
                        </span>
                    ) : (
                        <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-[#aaa] rounded-full"></div>
                    )
                )
            )}
        </button>
    );
};

export default Avatar;