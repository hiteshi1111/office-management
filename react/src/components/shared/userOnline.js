import React from 'react'

const UserOnline = ({isOnline=false}) => {
    return (
        <div className='flex gap-[5px] items-center'>
            {isOnline ? (
                <div className="relative flex h-[10px] w-[10px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008000] opacity-75"></span>
                    <span className="inline-flex rounded-full h-[10px] w-[10px] bg-[#008000]"></span>
                </div>
            ) : (
                <div className="w-[10px] h-[10px] bg-[#aaa] rounded-full"></div>
            )}
            <div className={`text-[12px] ${isOnline ? `text-[#008000]` : `text-[#aaa]`}`}>
                {isOnline ? <p>Online </p> : <p> Offline</p>}
            </div>
        </div>
    )
}

export default UserOnline;