import React from 'react'
import { IoIosClose } from 'react-icons/io'
import { MdOutlineReply } from 'react-icons/md'
import { chatActions } from '../../store/chat-slice'
import { useDispatch, useSelector } from 'react-redux'
import { formatDate } from '../../utils/formatDate'
import { decrypt } from '../../utils/decryption'

const ReplyMessage = ({replyData}) => {
    const dispatch = useDispatch();
    const { currentChat } = useSelector((state) => state.chat);
    return (
        // <div className='max-w-[960px] bg-white p-[20px] border-x rounded-t-[20px]'>
        <div className='max-w-[1100px] bg-white p-[20px] border-x rounded-t-[20px]'>
            <div className='relative border p-[10px] border-l-[3px] border-l-[#C15817]'>
                <IoIosClose
                    size={20}
                    className='absolute z-2 top-0 right-0 cursor-pointer'
                    onClick={() => dispatch(chatActions.setReplyData(null))}
                />
                <MdOutlineReply size={15} className='mr-[10px]' />
                {replyData?.image && (
                    <img 
                        src={replyData?.image}
                        alt={currentChat?.userData.fullName}
                        className='w-[100px] h-[100px] bg-white'
                    />
                )}
                <p className='overflow-hidden'>{decrypt(replyData?.message)}</p>
                <div className='text-[#aaa] text-[12px]'>{currentChat?.userData.fullName} ({formatDate(replyData?.createdAt)})</div>
            </div>
        </div>
    )
}

export default ReplyMessage