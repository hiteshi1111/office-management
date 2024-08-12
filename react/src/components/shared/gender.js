import React from 'react';
import { IoIosMale, IoIosFemale } from "react-icons/io";
import { TbUserQuestion } from "react-icons/tb";
import IconButton from '../custom/iconButton';

const Gender = ({value, onClick=()=>{}}) => {
    return (
        <div className='flex gap-[10px] mt-[5px]'>
            {genderList.map((item, i) => (
                <IconButton 
                    title={item.title}
                    key={i}
                    icon={item.icon}
                    className={`bg-white h-[40px] w-[40px] ${value === item.title && "border-[#ff0000]"}`}
                    onClick={() => onClick({ target: { name: 'gender', value: item.title } })}
                />
            ))}
        </div>
    )
}

const genderList = [
    {
        title: "male",
        icon: <IoIosMale size={25} color='#00bfff' />
    },
    {
        title: "female",
        icon: <IoIosFemale size={25} color='#ff69b4' />
    },
    {
        title: "prefer not to say",
        icon: <TbUserQuestion size={25} color='#808080' />
    }
];

export default Gender;