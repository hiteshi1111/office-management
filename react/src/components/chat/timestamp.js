import React from 'react'

const Timestamp = ({date}) => {
    const dateObj = new Date(date);

    let label;
    if (isToday(dateObj)) {
        label = 'Today';
    } else if (isYesterday(dateObj)) {
        label = 'Yesterday';
    } else {
        label = formatDateForInput(dateObj);
    }
    return (
        <div className='fixed lg:right-0 lg:w-[calc(100%_-_250px)] max-lg:left-0 max-lg:w-full text-center z-[9] mt-[3px]'>
            <span className='px-[20px] py-[2px] bg-[#dcdcdc] rounded-full'>{label}</span>
        </div>
    )
}

const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const isToday = (inputDate) => {
    const today = new Date();
    return formatDateForInput(today) === formatDateForInput(inputDate);
}

const isYesterday = (inputDate) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return formatDateForInput(yesterday) === formatDateForInput(inputDate);
}

export default Timestamp;