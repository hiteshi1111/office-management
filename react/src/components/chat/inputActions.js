import React, { useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import Stickers from './stickers';
import OtherActions from './otherActions';
import Media from './media';
import ReplyMessage from './replyMessage';
import { chatActions } from '../../store/chat-slice';
import { GrFormClose } from "react-icons/gr";

const InputActions = ({
    setImage = () => { },
    setOpenEmoji = () => { },
    handleEmojiClick = () => { },
    messageHandler = () => { },
    handleIconClick = () => { },
    handleFileChange = () => { },
    handleKeyDown = () => { },
    handleTyping = () => { },
    ...props
}) => {
    const dispatch = useDispatch();
    const { replyData, message, editing } = useSelector((state) => state.chat);
    const [openSticker, setOpenSticker] = useState(false);

    return (
        <div className='sticky bottom-0 w-full flex gap-[5px] md:gap-[10px] items-end justify-center md:px-[10px] py-[10px]'>
            <div className='relative w-full overflow-hidden'>

                {/* OPENS EMOJI FOR INPUT */}
                <div className={`w-full h-full z-[30] ${props.openEmoji ? "block" : "hidden"}`} onMouseLeave={() => setOpenEmoji(false)}>
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        emojiStyle="native"
                        style={{ width: "100%" }}
                        className='!rounded-b-none'
                    />
                </div>
                <button onClick={() => setOpenEmoji(prev => !prev)} className='absolute bottom-[37px] left-[20px] z-[20]' title="Emoji">
                    <BsEmojiSmile size={20} />
                </button>
                {editing && (
                    <button 
                        onClick={() => {
                            dispatch(chatActions.setMessage(""))
                            dispatch(chatActions.setEditing(null))
                        }} 
                        className='absolute bottom-[37px] right-[20px] z-[20]' title="Turn off editing"
                    >
                        <GrFormClose size={25} />
                    </button>
                )}
                <div>
                    {openSticker && (
                        <Stickers
                            setOpenSticker={setOpenSticker}
                        />
                    )}
                    {props.image && (
                        <Media
                            image={props.image}
                            setImage={setImage}
                        />
                    )}
                    {replyData && (
                        <ReplyMessage
                            replyData={replyData}
                        />
                    )}
                    <textarea
                        placeholder='Write message here...'
                        value={message}
                        maxLength={1000}
                        onChange={handleTyping}
                        onKeyDown={handleKeyDown}
                        className={`msg-type-chat input-richtext bg-white w-full border py-[15px] pl-[50px] pr-[30px] focus:outline-none resize-none ${(props.image || openSticker || replyData) ? "!rounded-t-none rounded-b-[40px] input-border" : "!rounded-[30px]"} ${props.openEmoji && "!rounded-t-none rounded-b-[40px] input-border"}`}
                    />
                </div>
            </div>
            <OtherActions
                messageHandler={messageHandler}
                setOpenEmoji={setOpenEmoji}
                setOpenSticker={setOpenSticker}
            />
        </div>
    )
}

export default InputActions;