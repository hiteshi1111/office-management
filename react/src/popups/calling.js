import React, { useEffect } from 'react';
import ReactModal from '.';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../store/chat-slice';
import IconButton from '../components/custom/iconButton';
import { SlCallEnd } from 'react-icons/sl';
import { TbPhoneCalling } from "react-icons/tb";
import Avatar from '../components/custom/avatar';
import incomingSound from "../sound/incoming.mp3";
import useSound from 'use-sound';
import ChatSocket from "../socket/chat-socket";
  
const Calling = ({stopOutgoing=()=>{}}) => {
    const dispatch = useDispatch();
    const [ play, { stop } ] = useSound(incomingSound, { loop: true });
    const { isCalling, currentChat } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);

    useEffect(() => {
        if (isCalling?.from){
            play();
        }else{
            stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isCalling])

    return (
        <ReactModal open={isCalling} close={() => dispatch(chatActions.setIsCalling(null))} maxWidth="500px" noClose padding='0px'>
            <div className='bg-gradient-to-r from-fuchsia-100 to-sky-100 p-[20px]'>
                <div>
                    <Avatar 
                        src={isCalling?.from ? isCalling?.from.avatar : currentChat?.userData?.avatar}
                        className='mx-auto !h-[150px] !w-[150px]'
                    />
                    <p className='text-[14px] text-center mt-[10px] bg-gradient-to-r from-neutral-600 to-fuchsia-500 bg-clip-text text-transparent font-semibold'>Calling {isCalling?.from ? `from ${isCalling?.from?.fullName}` : `to ${currentChat?.userData?.fullName}`} ...</p>
                </div>
                <div className='flex justify-center items-center gap-[50px] rounded-full mt-[50px] shadow-md max-w-[200px] mx-auto py-[5px] bg-gradient-to-l from-violet-200 to-pink-200'>
                    <IconButton 
                        icon={<TbPhoneCalling size={20} color='#fff' className='animate-bounce' />}
                        className='h-[40px] w-[40px] bg-[#228B22] hover:bg-black'
                        title={isCalling?.from ? "Accept" : "Ringing"}
                    />
                    <IconButton 
                        icon={<SlCallEnd size={20} color='#fff' />}
                        className='h-[40px] w-[40px] bg-[#FF0000] rotate-45 hover:bg-black'
                        onClick={() => {
                            if (isCalling?.from){
                                stop()
                            }else{
                                ChatSocket.emitCallEnd(currentChat?.userData, accountInfo?.data);
                                stopOutgoing();
                            }
                            dispatch(chatActions.setIsCalling(false))
                        }}
                        title={isCalling?.from ? "Reject" : "End"}
                    />
                </div>
            </div>
        </ReactModal>
    )
}
export default Calling;