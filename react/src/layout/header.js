import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Toastify from '../components/custom/toastify';
import { WindowScroll } from '../utils/windowScroll';

const Header = () => {
    const isKey = localStorage.getItem("xios");
    const { pathname } = useLocation();
    return (
        <header className="text-black bg-[#c6eaf9] sticky top-0 py-[10px] z-[99999]">
            <Toastify />
            <div className='container mx-auto md:px-[40px] max-md:px-[15px]'>
                <div className='flex justify-between items-center gap-[10px]'>
                    <Link to={"/"}>
                        <img
                            src="/logo.webp"
                            alt="Mantaraa"
                            title='Mantaraa'
                            className="h-[55px]"
                        />
                    </Link>
                    <div className='flex gap-[30px] items-center' onClick={WindowScroll}>
                        <div className='flex gap-[30px] items-center mr-[60px]'>
                            {menuLinks.map((item, i) => (
                                <Link key={i} to={item.handle} className='relative text-[16px] font-medium'>
                                    {item.link}
                                    <span className={`absolute top-[30px] h-[1px] w-[70%] border border-black ml-[3px] ${pathname === item.handle ? "block" : "hidden"}`} />
                                </Link>
                            ))}
                        </div>
                        {isKey && isKey !== "66a73941f3d3df2bfcda7d68" ? (
                            <>
                                <Link to="/account" className='text-[16px] font-medium'>
                                    Account
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className='text-[16px] font-medium' to="/registration">
                                    Sign Up
                                </Link>
                                <Link className='text-[16px] font-medium' to="/login">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

const menuLinks = [
    {
        link: "Our Team",
        handle: "/our-team"
    },
    {
        link: "Contact Us",
        handle: "/contact-us"
    }
]

export default Header;