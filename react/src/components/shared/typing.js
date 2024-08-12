import React from 'react';
import { useSelector } from 'react-redux';

const Typing = () => {
    const { currentChat } = useSelector((state) => state.chat);
    const firstName = currentChat?.userData.fullName.split(" ")[0];
    return (
        <div className='ml-[30px] flex items-center gap-[10px]'>
            <p className='text-[12px] text-[#aaa]'>{firstName} is typing</p>
            {/* <div class="ticontainer">
                <div class="tiblock">
                    <div class="tidot"></div>
                    <div class="tidot"></div>
                    <div class="tidot"></div>
                </div>
            </div> */}
            <div class="typing-loader"></div>
        </div>
    )
}

export default Typing;