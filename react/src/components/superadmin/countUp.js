import React, { useEffect, useState } from 'react';
import { FaUsers } from "react-icons/fa";

const CountUp = ({totalDataCount=0}) => {
    const duration = 1;
    const increment = 1; // increment value
    const [count, setCount] = useState(0); 

    useEffect(() => {
        let start = 0;
        const end = totalDataCount;
        if (start === end) return;
        const totalMilSecDur = duration * 1000;
        const incrementTime = totalMilSecDur / Math.ceil(totalDataCount / increment);
        let timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                start = end;
            }
            setCount(start);
        }, incrementTime);
        return () => clearInterval(timer);
    }, [totalDataCount, duration, increment]);

    return (
        <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow'>
            <div className='flex justify-between items-center gap-[10px] mb-[15px]'>
                <h3 className='text-[40px] leading-none font-bold mb-[2px]'>{count || "0"}</h3>
                <FaUsers size={35} color='#964B00' />
            </div>
            <div>
                <h4 className='text-[18px] text-[#000] font-medium'>Total Subscribers</h4>
            </div>
        </div>
    );
}
export default CountUp;
