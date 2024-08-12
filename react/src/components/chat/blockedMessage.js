import React from 'react'

const BlockedMessage = ({ blockedByMe }) => {
    return (
        <>
            {blockedByMe ?
                <p className='text-[#aaa] text-center'>You’ve blocked this person! Your replies are now traveling through an interdimensional void. 🚀🌌</p>
                :
                <p className='text-[#aaa] text-center'>Oops! You can not reply to this conversation :( </p>
            }
        </>
    )
};

export default BlockedMessage;
