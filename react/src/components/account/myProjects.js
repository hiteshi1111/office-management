import React from 'react'
import { useSelector } from 'react-redux';

const MyProjects = () => {
    const { projects } = useSelector((state) => state.account);
    return (
        <div className='p-[30px] border w-full shadow-md inline-flex flex-col relative bg-white mt-[20px] lg:mt-[30px]'>
            <h4>My Projects</h4>
            {projects.length > 0 ? (
                <ul className='mt-[30px] grid gap-[10px]'>
                    {projects.map((item, i) => (
                        <li key={i} className='capitalize'>{item.title}</li>
                    ))}
                </ul>
            ):(
                <div className='mt-[30px] text-center'>
                    ---No Projects Added---
                </div>
            )}
        </div>
    )
}

export default MyProjects;