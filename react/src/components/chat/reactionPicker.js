import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ReactionPicker = (props) => {
    const emojis = ['😂', '🤣', '😍', '👍', '👎', '❤️', '🔥', '👏', '✔️', '❌'];
    const [startIndex, setStartIndex] = useState(0);

    // Function to handle clicking on the next arrow
    const handleNextClick = () => {
        if (startIndex < emojis.length - 5) {
            setStartIndex(startIndex + 1);
        }
    };

    // Function to handle clicking on the previous arrow
    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div className="cursor-pointer w-[185px] text-center absolute top-[-53px] left-[-90px] py-[10px] px-[20px] bg-[#111827] rounded-[10px] before:content-[''] before:absolute before:w-[0px] before:h-[0px] before:bottom-[-5px] before:border-l-[7px] before:border-l-[transparent] before:border-solid before:border-r-[7px] before:border-r-[transparent] before:border-t-[7px] before:border-t-[#000] before:ml-[0px] z-[99]">
            <div className="emoji-container flex justify-center text-[20px]">
                {emojis.slice(startIndex, startIndex + 5).map((emoji, index) => (
                    <span key={index} onClick={() => props.handleEmojiClick(emoji)} className="relative">
                        {emoji}
                        {props.emoji.some(item => item.emoji === emoji) && (
                            <span className='h-[4px] w-[4px] rounded-full bg-white absolute inset-x-[10px]' />
                        )}
                    </span>
                ))}
                <div className="arrow-container">
                    <FiChevronLeft
                        onClick={handlePrevClick}
                        className={`text-[18px] absolute top-[16px] left-[0px] text-white ${startIndex === 0 ? 'hidden' : ''}`}
                    />
                    <FiChevronRight
                        onClick={handleNextClick}
                        className={`text-[18px] absolute top-[16px] right-[0px] text-white ${startIndex >= emojis.length - 5 ? 'hidden' : ' '}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReactionPicker;