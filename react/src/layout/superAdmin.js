import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Profile from '../components/shared/profile';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import { LuLayoutDashboard } from "react-icons/lu";
import { RiUserStarLine } from "react-icons/ri";
import { GrPlan } from "react-icons/gr";
import { TfiSettings } from 'react-icons/tfi';
import SuperAdminBar from './superAdminBar';
import { RiContactsBook3Line } from "react-icons/ri";
import { GetRequest } from '../utils/request';
import { superadminActions } from '../store/superadmin-slice';

const SuperAdminLayout = ({ children, className="", bgClass="" }) => {
    const drawerRef = useRef(null);
    const dispatch = useDispatch();
    const { showDrawer, currentTheme } = useSelector((state) => state.ui);
    const { accountInfo } = useSelector((state) => state.account);
    const { triggerPlans } = useSelector((state) => state.superadmin);

    const handleClickOutside = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
            dispatch(uiActions.setDrawer(false))
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPlans = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo?.token}`,
            },
        };
        GetRequest(`${process.env.REACT_APP_URL}/plan`, config).then((response) => {
            dispatch(superadminActions.setPlanList(response.data))
        }).catch((error) => {
            console.log("Errors fetching plan data", error);
        });
    };
    useEffect(() => {
        if (accountInfo?.data) {
            getPlans();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, triggerPlans]);

    return (
        <div className='flex max-lg:flex-col relative overflow-hidden'>

            {/* FOR MOBILE ONLY */}
            <div className={`lg:hidden h-[100vh] bg-[#aaaaaa8a] fixed overflow-hidden overflow-y-auto w-full shadow-md z-[999] w-full ${showDrawer ? "left-[0%]" : "left-[-100%]"}`}>
                <div ref={drawerRef} className={`absolute h-[100vh] overflow-hidden overflow-y-auto w-full shadow-md bg-white max-w-[250px] duration-700 ${showDrawer ? "left-[0%]" : "left-[-100%]"}`}>
                    <ActionBar onClick={() => dispatch(uiActions.setDrawer(false))} />
                </div>
            </div>

            {/* FOR DESKTOP ONLY */}
            <div className={`hidden lg:block h-[100vh] fixed overflow-hidden overflow-y-auto max-w-[250px] shadow-md bg-white w-full ${currentTheme}`}>
                <ActionBar />
            </div>

            <div className={`lg:ml-[250px] md:h-[100vh] w-full overflow-hidden relative overflow-y-auto z-[99] ${bgClass}`}>
                <SuperAdminBar />
                <div className={`relative px-[10px] md:px-[20px] lg:px-[30px] mx-auto max-w-[1200px] ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

function ActionBar(props) {
    const { pathname } = useLocation();
    return (
        <>
            <Profile />
            <hr />
            <div className='flex flex-col justify-between h-[90%]'>
                <div className='grid grid-cols-1 border-b'>
                    {navLinks.map((item, i) => (
                        <Link 
                            key={i} 
                            to={item.handle} 
                            className={`flex justify-start items-center px-[30px] py-[15px] gap-[20px] hover:bg-[#e8f0fe] cursor-pointer hover:bg-[#f5f5f5] ${pathname === item.handle && "bg-[#e8f0fe]"} `}
                            {...props} 
                        > 
                            {item.icon}
                            <span className='w-full text-[12px]'>{item.title}</span>
                        </Link>
                    ))}    
                </div>
                <Link to="/settings" {...props} className={`flex justify-start items-center px-[30px] py-[20px] border-y hover:bg-[#e8f0fe] cursor-pointer gap-[20px] bg-white`}>
                    <TfiSettings size={20} />
                    <span className='text-center text-[12px]'>Settings</span>
                </Link>
            </div>
        </>
    )
};

const navLinks = [
    {
        title: "Dashboard",
        handle: "/mastermind/dashboard",
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        title: "Subscribers",
        handle: "/mastermind/subscribers",
        icon: <RiUserStarLine size={20} />,
    },
    {
        title: "Plans",
        handle: "/mastermind/plans",
        icon: <GrPlan size={20} />,
    },
    {
        title: "Enquiries",
        handle: "/mastermind/enquiries",
        icon: <RiContactsBook3Line size={20} />,
    },
]

export default SuperAdminLayout;