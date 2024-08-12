import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { accountActions } from '../../store/account-slice';
import { chatActions } from '../../store/chat-slice';
import UserSocket from "../../socket/user-socket";
import Avatar from '../custom/avatar';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { accountInfo } = useSelector((state) => state.account);
    const userInfo = accountInfo?.data;

    const handleLogout = () => {
        dispatch(accountActions.logOut());
        dispatch(chatActions.logOut());
        navigate('/login')
        UserSocket.emitLogoutEvent(accountInfo?.data?._id)
    }

    return (
        <div className={`bg-white h-[70px] flex items-center justify-between border-gray-600 px-[20px] gap-[20px]`}>
            <div className='flex items-center gap-[10px]'>
                <Link to="/account">
                    <Avatar
                        id={userInfo?._id}
                        userId={userInfo?._id}
                        src={userInfo?.avatar}
                        alt={userInfo?.fullName}
                        size={30}
                        className='h-[50px] w-[50px]'
                    />
                </Link>
                <div>
                    <p className="text-[14px] font-semibold capitalize">{userInfo?.fullName}</p>
                    {!userInfo?.role?.title ?
                        <p className="text-[12px] text-gray-400 capitalize">({userInfo?.role})</p>
                        :
                        <p className="text-[12px] text-gray-400 capitalize">({userInfo?.role?.title})</p>
                    }
                </div>
            </div>
            <button title='Logout' onClick={() => handleLogout(accountInfo?.data)}>
                <IoIosLogOut size={20} className='cursor-pointer' />
            </button>
        </div>
    )
}
export default Profile;