import React, {useState, useEffect} from "react";
import ReactModal from ".";
import Avatar from "../components/custom/avatar";
import { useDispatch, useSelector } from "react-redux";
import { MdAlternateEmail } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { PiGenderIntersexDuotone } from "react-icons/pi";
import { formatDate } from "../utils/formatDate";
import { LuCakeSlice } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import UserOnline from "../components/shared/userOnline";
import { employeeActions } from "../store/employee-slice";
import { LiaUserSolid } from "react-icons/lia";

const EmployeeProfile = () => {
    const dispatch = useDispatch();
    const { viewEmployee } = useSelector((state) => state.employee);
    const { onlineUsers } = useSelector((state) => state.chat);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const isActive = onlineUsers.some(item => item?.userId === viewEmployee?._id);
        setIsOnline(isActive);
    }, [onlineUsers, viewEmployee]);
   
    function handleClose() {
        dispatch(employeeActions.setViewEmployee(null))
    }

    return (
        <ReactModal open={viewEmployee} close={handleClose} maxWidth="700px" padding='20px' margin='10px' >
            <div className="flex md:flex-row max-md:flex-col gap-[20px]">
                <div className='p-[30px] border md:w-[400px] max-md:w-full max-md:max-w-[400px] mx-auto shadow-md inline-flex flex-col items-center justify-center relative max-md:!mt-[15px]'>
                    <Avatar
                        src={viewEmployee?.avatar}
                        alt={viewEmployee?.fullName}
                        noOnline
                        size={60}
                        className='!w-[150px] !h-[150px] object-center object-cover'
                    />
                    <h4 className='mt-[10px] mb-[5px]'>{viewEmployee?.fullName}</h4>
                    {/* {!currentChat?.blockedBy?.length > 0 && showOnlineStat( */}
                    <UserOnline isOnline={isOnline} />
                    {/* )} */}
                </div>
                <div className="w-full">
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <LiaUserSolid size={18} className="mr-[10px]" /> Full Name</div>
                        <div className="">{viewEmployee?.fullName}</div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <MdAlternateEmail size={16} className="mr-[10px]" /> Email</div>
                        <div className="">{viewEmployee?.email}</div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <FaHashtag size={16} className="mr-[10px]" /> Role</div>
                        <div className="capitalize">{viewEmployee?.role?.title}</div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <PiGenderIntersexDuotone size={20} className="mr-[10px]" /> Gender</div>
                        <div className="capitalize">
                            {viewEmployee?.gender}
                        </div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <LuCakeSlice size={18} className="mr-[10px]" /> Birthday</div>
                        <div className="capitalize">
                            {formatDate(viewEmployee?.birthday)}
                        </div>
                    </div>
                    <hr />
                    <div className='px-[10px] py-[15px] flex justify-between items-center gap-[10px]'>
                        <div className="capitalize flex items-center"> <CiCalendarDate size={18} className="mr-[10px]" /> Joined On</div>
                        <div className="capitalize">{formatDate(viewEmployee?.createdAt)}</div>
                    </div>
                </div>
            </div>
        </ReactModal >
    )
};

export default EmployeeProfile;