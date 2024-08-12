import React from 'react';
import { formatDateForCompare, formatDateAndTime } from '../../utils/formatDate';
import { useSelector } from 'react-redux';

const CurrentPlan = () => {
    const { currentPlan } = useSelector((state) => state.account);
    return (
        <div className='p-[30px] border w-full shadow-md inline-flex flex-col relative bg-white mt-[20px] lg:mt-[30px] overflow-hidden'>
            <ExpiredTag expiryDate={currentPlan.expiryOn} />
            <h4>Current Plan</h4>
            <div className='flex justify-between items-center py-[10px] gap-[30px] mt-[10px]'>
                <span>Plan</span>
                <span className='max-w-[400px] text-right'>{currentPlan.plan.title || "---"}</span>
            </div>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Started Date</span>
                <span className='max-w-[400px] text-right'>{formatDateAndTime(currentPlan.startedOn) || "---"}</span>
            </div>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Expiry Date</span>
                <span className='max-w-[400px] text-right'>{formatDateAndTime(currentPlan.expiryOn) || "---"}</span>
            </div>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Total No. of Employees</span>
                <span className='max-w-[400px] text-right'>{currentPlan.plan.employees || "---"}</span>
            </div>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Employees Added</span>
                <span className='max-w-[400px] text-right'>{currentPlan.employeesAdded || 0}</span>
            </div>
            <div className='flex justify-between items-center py-[10px] gap-[30px]'>
                <span>Employees Left</span>
                <span className='max-w-[400px] text-right'>{(currentPlan.plan.employees - currentPlan.employeesAdded) || "---"}</span>
            </div>
        </div>
    )
}

function ExpiredTag({ expiryDate }) {
    let currentdate = formatDateForCompare(new Date());
       return (
        <div className='text-[#ff0000] rotate-[40deg] bg-[#ffe4e1] w-[147px] text-center absolute top-[21px] right-[-36px] z-[1] shadow-md py-[3px]'>
            {currentdate > formatDateForCompare(expiryDate)
                ? "Expired"
                : currentdate === formatDateForCompare(expiryDate)
                    ? "Expiring Today"
                    : "Active"
            }
        </div>
    )
}

export default CurrentPlan;