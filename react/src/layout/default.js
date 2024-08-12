import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoTasklist } from "react-icons/go";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TfiSettings } from "react-icons/tfi";
import Profile from '../components/shared/profile';
import { PiUser, PiUsersThreeLight } from "react-icons/pi";
import { GoReport } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import TopBar from './topBar';
import { GetRequest } from '../utils/request';
import { IoHomeOutline } from "react-icons/io5";
import { chatActions } from '../store/chat-slice';
import RecentChat from '../components/layout/recentChat';
import Projects from '../components/layout/allProjects';
import ChatSocket from '../socket/chat-socket';
import { TbNotebook } from "react-icons/tb";
import Loader from '../components/custom/loader';

const Layout = ({ children, className = "", bgClass="" }) => {
    const dispatch = useDispatch();
    const drawerRef = useRef(null);
    const { showDrawer, currentTheme } = useSelector((state) => state.ui);
    const { accountInfo } = useSelector((state) => state.account);
    const { isSearched, triggerChat, currentChat, loadingChat } = useSelector((state) => state.chat);

    ChatSocket.useSocketSetup();
    ChatSocket.useNotificationEvent(currentChat);
    ChatSocket.useCallingEvent();
    ChatSocket.useShowBlockedEvent();
    ChatSocket.useMsgRequestEvent(accountInfo?.data?._id);

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

    useEffect(() => {
        if (accountInfo) {
            GetRequest(`${process.env.REACT_APP_URL}/conversation/${accountInfo?.data?._id}`).then(response => {
                dispatch(chatActions.setChatList(response.data));
            }).catch(error => {
                console.log("conversation error >>>", error.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, isSearched, triggerChat])

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
                <TopBar />
                {loadingChat && (
                    <Loader className='bg-[#F5FFFA]' loaderCss="text-[#000]" />
                )}
                <div className={`relative px-[10px] md:px-[20px] lg:px-[30px] mx-auto max-w-[1200px] ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

function ActionBar(props) {
    const { pathname } = useLocation();
    const { accountInfo } = useSelector((state) => state.account);
    const role = accountInfo?.data?.role?.title.toLowerCase();
    return (
        <>
            <Profile />
            <hr />
            <div className='grid grid-cols-2'>
                {navLinks.map((item, i) => (
                    <Link 
                        key={i} 
                        to={item.handle} 
                        className={`flex flex-col justify-center items-center lg:px-[10px] max-lg:px-[6px] py-[10px] hover:bg-[#e8f0fe] cursor-pointer hover:bg-[#f5f5f5] ${pathname === item.handle && "bg-[#e8f0fe]"} `}
                        {...props} 
                    >
                        {item.icon}
                        <span className='w-full text-center text-[12px]'>{item.title}</span>
                    </Link>
                ))}
                {role === "admin" && (
                    <>
                        <Link to="/employees" className={`flex flex-col justify-center items-center lg:px-[10px] max-lg:px-[6px] py-[10px] hover:bg-[#f5f5f5] cursor-pointer ${pathname === "/employees" && "bg-[#e8f0fe]"} `}>
                            <PiUsersThreeLight size={20} />
                            <span className='w-full text-center text-[12px]'>Employees</span>
                        </Link>
                        <Link to="/permissions" className={`flex flex-col justify-center items-center lg:px-[10px] max-lg:px-[6px] py-[10px] hover:bg-[#f5f5f5] cursor-pointer ${pathname === "/permissions" && "bg-[#e8f0fe]"} `}>
                            <MdOutlineAdminPanelSettings size={20} />
                            <span className='w-full text-center text-[12px]'>Permissions</span>
                        </Link>
                    </>
                )}

            </div>
            <hr />
            <div>
                <RecentChat {...props} />
                <hr />
            </div>

            <div className='' >
                <Projects onClick={props.onClick}/>
                <hr />
            </div>

            <Link to="#" {...props} className={`flex justify-start items-center px-[30px] py-[20px] hover:bg-[#e8f0fe] cursor-pointer gap-[20px] bg-white`}>
                <GoReport size={20} />
                <span className='text-center text-[12px]'>Report</span>
            </Link>
            <hr />
            <Link to="/settings" {...props} className={`flex justify-start items-center px-[30px] py-[20px] hover:bg-[#e8f0fe] cursor-pointer gap-[20px] bg-white`}>
                <TfiSettings size={20} />
                <span className='text-center text-[12px]'>Settings</span>
            </Link>
            <hr />
        </>
    )
};

const navLinks = [
    {
        title: "Home",
        handle: "/",
        icon: <IoHomeOutline size={20} />
    },
    {
        title: "Account",
        handle: "/account",
        icon: <PiUser size={20} />,
        role: "admin"
    },
    {
        title: "Notes",
        handle: "/notes",
        icon: <TbNotebook size={20} />
    },
    {
        title: "Tasks",
        handle: "/tasks",
        icon: <GoTasklist size={20} />,
        role: "other"
    },
    {
        title: "Events",
        handle: "/events",
        icon: <SlCalender size={20} />,
        role: "other"
    }
    // {
    //     title: "Chat",
    //     handle: "/chat",
    //     icon: <IoChatbubblesOutline size={20} />,
    //     role: "other"
    // },

]

export default Layout;