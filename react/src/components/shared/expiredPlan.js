import React from 'react';
import { TbRecharging } from "react-icons/tb";

const ExpiredPlan = () => {
    return (
        <div className='px-[10px] py-[40px]'>
            <TbRecharging color='#FF00FF' className='mx-auto' size={60} />
            <h4 className='text-center w-full'>Plan Expired!</h4>
            <p className='text-center w-full mt-[5px]'>Recharge to continue expanding your network!</p>
        </div>
    )
}

export default ExpiredPlan;