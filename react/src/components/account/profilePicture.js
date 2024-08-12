import React from 'react'
import UpdateAvatar from '../../popups/updateAvatar'
import Avatar from '../custom/avatar'
import { useSelector } from 'react-redux';

const ProfilePicture = () => {
    const { accountInfo } = useSelector((state) => state.account);
    return (
        <div className='p-[30px] border w-full shadow-md inline-flex flex-col items-center relative bg-white'>
            <UpdateAvatar />
            <Avatar
                src={accountInfo?.data?.avatar}
                noOnline
                size={60}
                className='!w-[200px] !h-[200px]'
            />
            <h3 className='mt-[20px]'>{accountInfo?.data?.fullName || "---"}</h3>
            <p className="text-[16px] text-gray-400 capitalize">({accountInfo?.data?.role?.title || "---"})</p>
        </div>
    )
}

export default ProfilePicture;