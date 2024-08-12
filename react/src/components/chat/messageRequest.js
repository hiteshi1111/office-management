import React from 'react'
import { SiGitconnected } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { GetRequest, PutRequest } from '../../utils/request';
import { chatActions } from '../../store/chat-slice';
import ChatSocket from '../../socket/chat-socket';

const MessageRequest = ({request, getRequest=()=>{}}) => {
    const dispatch = useDispatch();
    const { chatTheme } = useSelector(state => state.ui);
    const { accountInfo } = useSelector((state) => state.account);
    const { currentChat, triggerChat, triggerRequests } = useSelector((state) => state.chat);

    function requestAcceptHandler() {
        GetRequest(`${process.env.REACT_APP_URL}/request/accept/${request._id}`).then(response => {
            dispatch(chatActions.setTriggerChat(triggerChat + 1));
            dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: true }));
            ChatSocket.emitBlockUser(currentChat?.userData?._id, [accountInfo?.data?._id], accountInfo?.data?._id, "accepted")
            getRequest(currentChat.convoId);
            dispatch(chatActions.setTriggerRequests(triggerRequests + 1))
        }).catch(error => {
            console.log("request accept error >>>", error.data);
        });
    }

    function blockHandler(){
        PutRequest(`${process.env.REACT_APP_URL}/friend/block/${currentChat?.convoId}`, {
            blockedBy: accountInfo?.data?._id
        }).then((response) => {
            dispatch(chatActions.setCurrentChat({...currentChat, blockedBy: response.data}))
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            ChatSocket.emitBlockUser(currentChat?.userData?._id, response.data, accountInfo?.data?._id)
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className={`sticky top-[-20px] mt-[-20px] mb-[20px] z-10 bg-[#f5fffa] px-[30px] md:py-[30px] max-md:py-[20px] w-full mx-auto border-b ${chatTheme.className}`}>
            {request.from._id !== accountInfo?.data._id ? (
                <div>
                    <SiGitconnected size={50} color='#94e4a1' className='mx-auto' />
                    <p className='text-center'>Wants to connect with you!</p>
                    <div className='flex justify-center gap-[10px] mt-[10px]'>
                        <button onClick={requestAcceptHandler} className='bg-[#ff4081] text-white w-full flex justify-center items-center h-[35px] max-w-[150px]'>Accept</button>
                        <button onClick={blockHandler} className='bg-[#aaa] text-white w-full flex justify-center items-center h-[35px] max-w-[150px]'>Block</button>
                    </div>
                </div>
            ) : (
                <div>
                    <SiGitconnected size={50} color='#94e4a1' className='mx-auto' />
                    <p className='text-center'>Waiting for approval...</p>
                </div>
            )}
        </div>
    )
}

export default MessageRequest;