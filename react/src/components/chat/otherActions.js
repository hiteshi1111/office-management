import React from 'react'
import IconButton from '../custom/iconButton'
import { RiSendPlaneFill } from 'react-icons/ri'
import { PiStickerLight } from 'react-icons/pi'
import { useSelector } from 'react-redux'

const OtherActions = (props) => {
    const { message } = useSelector((state) => state.chat);
    return (
        <>
        <IconButton
            icon={<RiSendPlaneFill size={25} color='#fff' />}
            onClick={props.messageHandler}
            className={`!h-[50px] !min-w-[50px] mb-[10px] ${message?.length === 0 && "pointer-events-none"}`}
            title="Send"
        />
        <IconButton
            icon={<PiStickerLight size={22} color='#264348' />}
            className="h-[40px] min-w-[40px] !bg-white hidden md:flex mb-[10px]"
            onClick={() => {
                props.setOpenEmoji(false)
                props.setOpenSticker(prev => !prev)
            }}
            title="Stickers"
        />
        {/* <IconButton
            icon={<MdOutlinePermMedia size={20} color='#264348' />}
            className="h-[40px] min-w-[40px] !bg-white hidden md:flex"
            onClick={handleIconClick}
            title="Media"
        />
        <input
            type="file"
            ref={props.fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
        /> */}
        </>
    )
}

export default OtherActions;