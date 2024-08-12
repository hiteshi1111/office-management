import React from 'react'
import UpdateAccount from '../../popups/updateAccount';
import { formatDate } from '../../utils/formatDate';
import { useSelector } from 'react-redux';

const MyInfo = () => {
    const { accountInfo, companyData } = useSelector((state) => state.account);
    return (
        <div>
            <UpdateAccount data={accountInfo?.data} />
            <div className='flex justify-between items-center py-[10px] gap-[30px] mt-[10px]'>
                <span>Full Name</span>
                <span className='max-w-[400px] text-right'>{accountInfo?.data?.fullName || "---"}</span>
            </div>
            <hr/>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Birthday</span>
                <span className='max-w-[400px] text-right'>{accountInfo?.data?.birthday ? formatDate(accountInfo.data.birthday)  : "---"}</span>
            </div>
            <hr/>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Email</span>
                <span className='max-w-[400px] text-right'>{accountInfo?.data?.email}</span>
            </div>
            <hr/>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Mobile</span>
                <span className='max-w-[400px] text-right'>{accountInfo?.data?.mobile || "---"}</span>
            </div>
            <hr/>
            {accountInfo?.data?.role.title.toLowerCase() !== "admin" && (
                <>
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Gender</span>
                    <span className='max-w-[400px] text-right capitalize'>{accountInfo?.data?.gender || "not mentioned"}</span>
                </div>
                <hr/>
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Department</span>
                    <span className='max-w-[400px] text-right'>{companyData?.department || "---"}</span>
                </div>
                <hr/>
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Designation</span>
                    <span className='max-w-[400px] text-right'>{accountInfo?.data?.role.title || "---"}</span>
                </div>
                <hr/>
                </>
            )}
        </div>
    )
}

export default MyInfo;