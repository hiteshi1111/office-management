import React from 'react'
import { useSelector } from 'react-redux';

const CompanyInfo = () => {
    const { accountInfo, companyData } = useSelector((state) => state.account);
    return (
        <div className='mt-[30px]'>
            <h4>About Company</h4>
            <div className='mt-[10px]'>
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Name</span>
                    <span className='capitalize max-w-[400px] text-right'>{accountInfo?.data?.companyTitle || companyData?.companyTitle || "---"}</span>
                </div>
                <hr />
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Email</span>
                    <span className='max-w-[400px] text-right'>{accountInfo?.data?.companyEmail || companyData?.companyEmail || "---"}</span>
                </div>
                <hr />
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Mobile</span>
                    <span className='max-w-[400px] text-right'>{accountInfo?.data?.companyMobile || companyData?.companyMobile || "---"}</span>
                </div>
                <hr />
                <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                    <span>Full Address</span>
                    <span className='max-w-[400px] text-right'>{accountInfo?.data?.companyAddress || companyData?.companyAddress || "---"}</span>
                </div>
                <hr />
            </div>
        </div>
    )
}

export default CompanyInfo;