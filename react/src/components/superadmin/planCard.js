import React from 'react'

const PlanCard = ({percentage=0, label="", icon={}}) => {
    return (
        <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow'>
            <div className='flex justify-between items-center gap-[10px] mb-[15px]'>
                <h3 className='text-[40px] leading-none font-bold mb-[2px]'>{percentage}<span className='text-[18px]'>%</span></h3>
                {icon}
            </div>
            <div>
                <h4 className='text-[18px] text-[#000] font-medium capitalize'>{label}</h4>
            </div>
        </div>
    )
}

export default PlanCard;