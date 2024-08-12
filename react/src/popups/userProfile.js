import React from "react";
import ReactModal from ".";
import Avatar from "../components/custom/avatar";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { MdAlternateEmail } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { PiGenderIntersexDuotone } from "react-icons/pi";
import { formatDate } from "../utils/formatDate";
import { LuCakeSlice } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import { MdBlock } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdOutlineDeleteSweep } from "react-icons/md";
import UserOnline from "../components/shared/userOnline";
import { DeleteRequest, PutRequest } from "../utils/request";
import { chatActions } from "../store/chat-slice";
import { SiPrivateinternetaccess } from "react-icons/si";
import ChatSocket from '../socket/chat-socket';

const UserProfile = ({ isOnline = false }) => {
    const dispatch = useDispatch();
    const { showProfile } = useSelector((state) => state.ui);
    const { currentChat, triggerChat, triggerRequests } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);
    const data = currentChat?.userData;
    const showGender = currentChat?.settings ? currentChat.settings.showGender : true;
    const showBirthday = currentChat?.settings ? currentChat.settings.showBirthday : true;
    const showOnlineStatus = currentChat?.settings ? currentChat.settings.showOnlineStatus : true;

    function handleClose() {
        dispatch(uiActions.setShowProfile(false))
    }

    function deleteChatHandler() {
        DeleteRequest(`${process.env.REACT_APP_URL}/message/deletechat/${currentChat?.convoId}`, {
            data: {
                deletedBy: accountInfo?.data?._id
            }
        }).then((response) => {
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
        }).catch((error) => {
            console.log(error);
        });
    }

    function blockHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/friend/block/${currentChat?.convoId}`, {
            blockedBy: accountInfo?.data?._id
        }).then((response) => {
            dispatch(chatActions.setCurrentChat({ ...currentChat, blockedBy: response.data }));
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            ChatSocket.emitBlockUser(currentChat?.userData?._id, response.data, accountInfo?.data?._id)
        }).catch((error) => {
            console.log(error);
        });
    }

    function removeFriendHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/friend/remove/${currentChat?.convoId}`, {
            blockedBy: currentChat?.userData?._id
        }).then((response) => {
            dispatch(chatActions.setIsSearched(true))
            dispatch(chatActions.setTriggerRequests(triggerRequests + 1))
            dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: false }));
            ChatSocket.emitBlockUser(currentChat?.userData?._id, [accountInfo?.data?._id], accountInfo?.data?._id, "removed")
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <ReactModal open={showProfile} close={handleClose} maxWidth="700px" padding='20px' margin='10px' >
            <div className="flex md:flex-row max-md:flex-col gap-[20px]">
                <div className='p-[30px] border md:w-[400px] max-md:w-full max-md:max-w-[400px] mx-auto shadow-md inline-flex flex-col items-center justify-center relative max-md:!mt-[15px]'>
                    <Avatar
                        src={currentChat
                            ? currentChat.blockedBy?.length > 0
                                ? ""
                                : currentChat?.settings
                                    ? currentChat?.settings.showAvatar
                                        ? currentChat?.userData?.avatar
                                        : ""
                                    : currentChat?.userData?.avatar
                            : ""
                        }
                        alt={data?.fullName}
                        noOnline
                        size={60}
                        className='!w-[150px] !h-[150px] object-center object-cover'
                    />
                    <h4 className='mt-[10px] mb-[5px]'>{data?.fullName}</h4>
                    {!currentChat?.blockedBy?.length > 0 && showOnlineStatus && (
                        <UserOnline isOnline={isOnline} />
                    )}
                </div>
                <div className="w-full">
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <MdAlternateEmail size={16} className="mr-[10px]" /> Email</div>
                        <div className="">{data?.email}</div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <FaHashtag size={16} className="mr-[10px]" /> Role</div>
                        <div className="capitalize">{data?.role?.title}</div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <PiGenderIntersexDuotone size={20} className="mr-[10px]" /> Gender</div>
                        <div className="capitalize">
                            {showGender ? data?.gender : <SiPrivateinternetaccess title="Private" />}
                        </div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <LuCakeSlice size={18} className="mr-[10px]" /> Birthday</div>
                        <div className="capitalize">
                            {showBirthday
                                ? formatDate(data?.birthday)
                                : (<SiPrivateinternetaccess title="Private" />)
                            }
                        </div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <CiCalendarDate size={18} className="mr-[10px]" /> Joined On</div>
                        <div className="capitalize">{formatDate(data?.createdAt)}</div>
                    </div>
                    <hr />
                    <div className="flex flex-wrap justify-between gap-[10px] w-full mt-[10px]">
                        <button
                            onClick={removeFriendHandler}
                            className={`flex items-center justify-center p-[5px] text-[12px] font-semibold ${currentChat?.isFriend ? 'text-[#aaa] hover:text-[#000] hover:bg-[#e8f0fe] cursor-pointer' : 'pointer-events-none text-[#ccc]'}`}
                        >
                            <AiOutlineUserDelete size={18} className="mr-[5px]" /> Remove
                        </button>
                        <button
                            onClick={deleteChatHandler}
                            className="flex items-center justify-center p-[5px] text-[12px] font-semibold text-[#aaa] hover:text-[#000] hover:bg-[#e8f0fe] cursor-pointer">
                            <MdOutlineDeleteSweep size={18} className="mr-[5px]" /> Delete Chat
                        </button>
                        <button
                            onClick={blockHandler}
                            className={`flex items-center justify-center p-[5px] text-[12px] font-semibold ${currentChat?.convoId ? 'hover:bg-[#e8f0fe] text-[#FF0000]' : ' pointer-events-none text-[#ccc]'}`}
                        >
                            <MdBlock size={18} className="mr-[5px]" />
                            {currentChat?.blockedBy?.includes(accountInfo?.data._id) ? "Unblock" : "Block"}
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal >
    )
};

export default UserProfile;