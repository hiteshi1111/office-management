import React from 'react';
import notFound from "../assets/images/404.png"
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='w-full'>
            <div className='max-w-[500px] mx-auto text-center pt-[50px]'>
                <span className='text-[50px] font-bold'>404</span>
                <img 
                    src={notFound}
                    alt="404"
                />
                <Link 
                    to="/" 
                    className='bg-[#aaa] px-[20px] py-[10px] rounded-full'
                >Return to Home</Link>
            </div>
        </div>
    )
}

export default NotFound;