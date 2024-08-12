import React from 'react'
import { GetRequest, PutRequest } from '../../utils/request';
import Avatar from '../custom/avatar';
import { SiCoffeescript } from 'react-icons/si';
import IconButton from '../custom/iconButton';
import { FaRegCircle } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../../store/chat-slice';
import { AiOutlineClose } from "react-icons/ai";
import ChatSocket from '../../socket/chat-socket';

const MessageRequestList = ({messageRequests, show, messageRequestHandler=()=>{}}) => {
    const dispatch = useDispatch();
    const { currentChat, triggerChat } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);
    const myId = accountInfo?.data?._id;
    
    function requestAcceptHandler(id, userId, convoId) {
        GetRequest(`${process.env.REACT_APP_URL}/request/accept/${id}`).then(response => {
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            ChatSocket.emitBlockUser(userId, [accountInfo?.data?._id], accountInfo?.data?._id, "accepted")
            if(currentChat?.convoId === convoId) {
                dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: true }));
            }
            messageRequestHandler();
        }).catch(error => {
            console.log("request accept error >>>", error.data);
        });
    }
    function blockHandler(convoId, userId) {
        PutRequest(`${process.env.REACT_APP_URL}/friend/block/${convoId}`, {
            blockedBy: accountInfo?.data?._id
        }).then((response) => {
            if (convoId === currentChat?.convoId) {
                dispatch(chatActions.setCurrentChat({ ...currentChat, blockedBy: response.data }))
            }
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            ChatSocket.emitBlockUser(userId, response.data, accountInfo?.data?._id)
            messageRequestHandler();
        }).catch((error) => {
            console.log(error);
        });
    }

    return(
        <div className={`absolute right-0 top-[55px] z-10 bg-white shadow-[1px_1px_5px_0px_rgba(0,0,0,0.2)] w-full min-w-[280px] scroll-it before:content-[""] before:absolute before:right-[12px] before:top-[-16px] before:border-[8px] before:border-solid before:border-transparent before:border-b-[#e5e7eb] transform transition-all duration-150 ease-out ${show ? "scale-100 h-auto" : "scale-0 h-0"}`}>
            <div className='px-[5px] w-full min-w-[250px] max-h-[350px] overflow-hidden overflow-y-auto scroll-it'>
                {messageRequests.length > 0 ? (
                    messageRequests.map((item, i) => (
                        <div key={i}>
                            {!item.isAccepted ? (
                                item.to._id === myId && (
                                    <div className="px-[5px] py-[5px] flex gap-[10px] justify-between border-b w-full">
                                        <Avatar
                                            src={item.from.avatar}
                                            alt={item.from.fullName}
                                            noOnline
                                            className="min-w-[40px]"
                                        />
                                        <p>{item.from?.fullName} sent you a message request!</p>
                                        <div className="flex gap-[5px]">
                                            <IconButton
                                                title="Accept"
                                                icon={<FaRegCircle size={16} color="#008000" />}
                                                className="bg-white h-[30px] w-[30px]"
                                                onClick={() => requestAcceptHandler(item?._id, item?.from?._id, item?.conversationId)}
                                            />
                                            <IconButton
                                                title="Block"
                                                icon={<AiOutlineClose size={18} color="#FF0000" />}
                                                className="bg-white h-[30px] w-[30px]"
                                                onClick={() => blockHandler(item?.conversationId, item?.from?._id)}
                                            />
                                        </div>
                                    </div>
                                )
                            ) : (
                                item.from._id === myId && (
                                    <div className="px-[5px] py-[5px] flex gap-[10px] justify-between border-b">
                                        <Avatar
                                            src={item.to.avatar}
                                            alt={item.to?.fullName}
                                            noOnline
                                            className="min-w-[40px]"
                                        />
                                        <p>{item.to?.fullName} accepted your message request!</p>
                                    </div>
                                )
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-[10px] flex items-center justify-center">
                        <SiCoffeescript size={20} color="#7B3F00" className="mr-[10px]" /> Mailbox is on a coffee break!
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageRequestList