import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../components/custom/avatar";
import { useEffect, useRef, useState } from "react";
import { MdOutlineBugReport } from "react-icons/md";
import { MdBlock } from "react-icons/md";
import { IoPersonRemoveOutline, IoSettingsOutline } from "react-icons/io5";
import IconButton from "../components/custom/iconButton";
import { CgMenuLeft } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { BsChatRightHeart } from "react-icons/bs";
import { accountActions } from "../store/account-slice";
import { GetRequest, PostRequest, PutRequest } from "../utils/request";
import { chatActions } from "../store/chat-slice";
import UserSocket from "../socket/user-socket";
import TaskTopBar from "../components/task/topBar";
import UserProfile from "../popups/userProfile";
import UserOnline from "../components/shared/userOnline";
import MessageRequestList from "../components/layout/messageRequestList";
import Calling from "../popups/calling";
import { SlCallEnd } from "react-icons/sl";
import ChatSocket from "../socket/chat-socket";
import outgoingSound from "../sound/outgoing.mp3";
import useSound from 'use-sound';
import SearchBar from "./searchBar";

export default function TopBar() {
    const actionRef = useRef(null);
    const notifyRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { showProfile, currentTheme } = useSelector((state) => state.ui);
    const { currentChat, messageRequests, triggerChat, msgRequest, triggerRequests } = useSelector((state) => state.chat);
    const { accountInfo, planTrigger } = useSelector((state) => state.account);
    const { onlineUsers } = useSelector((state) => state.chat);
    const [play, { stop }] = useSound(outgoingSound, { loop: true });

    const role = accountInfo?.data?.role?.title?.toLowerCase();
    const [eventsIndex, seteventsIndex] = useState(0);
    const [events, setEvents] = useState([]);
    const [isOnline, setIsOnline] = useState(false);

    const [show, setShow] = useState({
        action: false,
        notify: false
    });
    let key = localStorage.getItem("xios");

    useEffect(() => {
        if (accountInfo && role) {
            if (role !== "super admin") {
                if (role === "admin") {
                    GetRequest(`${process.env.REACT_APP_URL}/subscription/${accountInfo.data._id}`).then((response) => {
                        dispatch(accountActions.setCurrentPlan(response.data))
                    }).catch(error => {
                        console.log("error getting plan data", error)
                    })
                } else {
                    PostRequest(`${process.env.REACT_APP_URL}/user/company/${accountInfo.data.adminId}`, { departmentId: accountInfo.data.role.departmentId }).then((response) => {
                        dispatch(accountActions.setCompanyData(response.data))
                    }).catch(error => {
                        console.log("error getting user data", error)
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, planTrigger])

    useEffect(() => {
        if (key) {
            GetRequest(`${process.env.REACT_APP_URL}/user/${key}`).then(response => {
                if (response?.data) {
                    dispatch(accountActions.setAccountInfo({ data: response.data, convoId: response.data.convoId }));

                    // dispatch(accountActions.setAccountInfo({ data: response.data.data, convoId: response.data.myConvo }))
                        // dispatch(chatActions.setCurrentChat({userData: response.data.data, blockedBy: [], convoId: response.data.myConvo}))
                } else {
                    localStorage.removeItem("xios")
                    navigate("/")
                }
            }).catch(error => {
                console.log("fetch err >", error);
                localStorage.removeItem("xios")
                navigate("/")
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    useEffect(() => {
        if (role) {
            if (role !== "super admin") {
                if (role === 'admin') {
                    GetRequest(`${process.env.REACT_APP_URL}/event/upcoming/${accountInfo?.data._id}`).then(response => {
                        setEvents(response?.data)
                    }).catch(error => {
                        console.log("err getting events>", error);
                    })
                } else {
                    GetRequest(`${process.env.REACT_APP_URL}/event/upcoming/${accountInfo?.data.adminId}`).then(response => {
                        setEvents(response?.data)
                    }).catch(error => {
                        console.log("err getting events>", error);
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role])

    const handleClickOutside = (event) => {
        if (actionRef.current && !actionRef.current.contains(event.target)) {
            setShow((prevState) => ({ ...prevState, action: false }))
        }
        if (notifyRef.current && !notifyRef.current.contains(event.target)) {
            setShow((prevState) => ({ ...prevState, notify: false }))
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(accountActions.logOut());
        dispatch(chatActions.logOut());
        navigate('/login')
        UserSocket.emitLogoutEvent(accountInfo?.data?._id)
    }

    useEffect(() => {
        if (accountInfo?.data?._id) {
            messageRequestHandler()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, msgRequest, triggerRequests])

    const messageRequestHandler = (action) => {
        GetRequest(`${process.env.REACT_APP_URL}/request?me=${accountInfo?.data?._id}&adminId=${accountInfo?.data?.adminId}`).then((response) => {
            dispatch(chatActions.setMessageRequests(response.data))
            if (response?.data) {
                const isNewRequest = response?.data?.some((user) => user?.isRead === false)
                if (isNewRequest) {
                    dispatch(chatActions.setMsgRequest(true))
                    if (action && action === "clicked") {
                        readRequestHandler(response.data)
                    }
                }
                else {
                    dispatch(chatActions.setMsgRequest(false))
                }
            }
        }).catch((error) => {
            console.log(error, "error getting requests")
        })
    }

    const readRequestHandler = (allRequests) => {
        let ids = [];
        for (let i = 0; i < allRequests.length; i++) {
            ids.push(allRequests[i]._id);
        }
        PostRequest(`${process.env.REACT_APP_URL}/request/read`, ids).then((response) => {
            console.log("read")
            dispatch(chatActions.setTriggerRequests(triggerRequests + 1))
        }).catch((error) => {
            console.log(error, "error accepting request")
        })
    }

    useEffect(() => {
        if (eventsIndex < events.length) {
            const timer = setTimeout(() => {
                seteventsIndex(prev => prev + 1)
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            seteventsIndex(0)
        }
    }, [eventsIndex, events])

    useEffect(() => {
        const isActive = onlineUsers.some(item => item?.userId === currentChat?.userData?._id);
        setIsOnline(isActive);
    }, [onlineUsers, currentChat]);

    function blockHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/friend/block/${currentChat?.convoId}`, {
            blockedBy: accountInfo?.data?._id
        }).then((response) => {
            dispatch(chatActions.setCurrentChat({ ...currentChat, blockedBy: response.data }))
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            ChatSocket.emitBlockUser(currentChat?.userData?._id, response.data, accountInfo?.data?._id)
        }).catch((error) => {
            console.log(error, "error blocking user");
        });
    }

    function removeFriendHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/friend/remove/${currentChat?.convoId}`, {
            blockedBy: accountInfo?.data?._id
        }).then((response) => {
            dispatch(chatActions.setIsSearched(true));
            dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: false }));
            dispatch(chatActions.setTriggerRequests(triggerRequests + 1))
            ChatSocket.emitBlockUser(currentChat?.userData?._id, [accountInfo?.data?._id], accountInfo?.data?._id, "removed")

        }).catch((error) => {
            console.log(error, "error removig friend");
        });
    };
    return (
        <div className={`${currentTheme} sticky top-0 bg-white shadow-md w-full max-md:px-[10px] md:px-[20px] lg:px-[30px] h-[70px] flex items-center justify-between z-[99]`}>
            <Calling stopOutgoing={stop} />
            {showProfile && (
                <UserProfile isOnline={isOnline} />
            )}
            {pathname === "/tasks" ? (
                <TaskTopBar />
            ) : (
                <>
                    <div className='flex items-center'>
                        <CgMenuLeft size={30} onClick={() => dispatch(uiActions.setDrawer(true))} className="lg:hidden cursor-pointer" />
                        {pathname === "/chat" ? (
                            currentChat ? (
                                <>
                                    <Avatar
                                        id={currentChat?.userData?._id}
                                        src={currentChat
                                            ? currentChat.blockedBy?.length > 0
                                                ? ""
                                                : currentChat?.settings
                                                    ? currentChat?.settings.showAvatar
                                                        ? currentChat?.userData?.avatar
                                                        : ""
                                                    : currentChat?.userData?.avatar
                                            : ""
                                        }
                                        isOnline
                                        className="max-lg:ml-[10px] h-[45px] w-[45px]"
                                        onClick={() => dispatch(uiActions.setShowProfile(true))}
                                    />
                                    <div className='grid ml-[10px]'>
                                        <span>{currentChat?.userData?.fullName}</span>
                                        {(!currentChat?.blockedBy?.includes(accountInfo?.data?._id) && !currentChat?.blockedBy?.includes(currentChat?.userData?._id)) && currentChat?.isFriend &&
                                            <UserOnline isOnline={isOnline} />
                                        }
                                    </div>
                                </>
                            ) : (
                                <SearchBar />
                            )
                        ) : (
                            pathname === "/notes" ? (
                                <>
                                    <Avatar
                                        id={currentChat?.userData?._id}
                                        src={currentChat
                                            ? currentChat.blockedBy?.length > 0
                                                ? ""
                                                : currentChat?.settings
                                                    ? currentChat?.settings.showAvatar
                                                        ? currentChat?.userData?.avatar
                                                        : ""
                                                    : currentChat?.userData?.avatar
                                            : ""
                                        }
                                        className="max-lg:ml-[10px] h-[45px] w-[45px]"
                                    />
                                    <div className='grid ml-[10px]'>
                                        <span>{currentChat?.userData?.fullName}</span>
                                        <span className="text-[#aaa] text-[12px]">(My Notes)</span>
                                    </div>
                                </>
                            ):(
                                role !== "super admin" && (
                                    <SearchBar />
                                )
                            )
                        )}
                    </div>
                    <div className="flex gap-[10px] items-center">
                        {(pathname === "/chat" && currentChat) && (
                            <SearchBar />
                        )}
                        <div ref={notifyRef} className='relative'>
                            <IconButton
                                icon={<BsChatRightHeart size={18} color="#264348" />}
                                className="h-[40px] w-[40px] bg-[#f8f4ff] shadow-md"
                                onClick={() => {
                                    setShow((prevState) => ({ ...prevState, notify: !show.notify }));
                                    dispatch(chatActions.setMsgRequest(false))
                                    if (!show.notify) {
                                        messageRequestHandler("clicked");
                                    }
                                }}
                            />
                            {msgRequest && (
                                <span className="absolute bottom-0 right-0 flex h-[10px] w-[10px]">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-[#e50914]"></span>
                                </span>
                            )}
                            <MessageRequestList
                                messageRequests={messageRequests}
                                show={show.notify}
                                messageRequestHandler={messageRequestHandler}
                            />
                        </div>
                        {pathname === "/chat" ? (
                            <>
                                {currentChat && (
                                    <IconButton
                                        icon={<SlCallEnd size={15} className="group-hover:animate-bounce" />}
                                        className="h-[40px] w-[40px] rotate-180 group shadow-md"
                                        title="Call"
                                        onClick={() => {
                                            dispatch(chatActions.setIsCalling(true))
                                            play();
                                            ChatSocket.emitCalling(currentChat?.userData, accountInfo?.data);
                                        }}
                                    />
                                )}
                                {currentChat && (

                                    <div ref={actionRef} className='relative'>
                                        <IconButton
                                            icon={<BsThreeDotsVertical size={15} />}
                                            className="h-[40px] w-[40px] bg-[#aaa] shadow-md"
                                            onClick={() => setShow((prevState) => ({ ...prevState, action: !show.action }))}
                                            title="Actions"
                                        />
                                        <div className={`absolute right-0 top-[55px] bg-white shadow-[1px_1px_5px_0px_rgba(0,0,0,0.2)] px-[5px] before:content-[""] before:absolute before:right-[12px] before:top-[-16px] before:border-[8px] before:border-solid before:border-transparent before:border-b-[#e5e7eb] ${show.action ? "block" : "hidden"}`}>
                                            {currentChat?.isFriend && (
                                                <button onClick={removeFriendHandler} className="px-[20px] py-[8px] flex flex-start items-center">
                                                    <IoPersonRemoveOutline size={16} className="mr-[5px]" /> Remove
                                                </button>
                                            )}
                                            <hr />
                                            <button className="px-[20px] py-[8px] flex flex-start items-center">
                                                <MdOutlineBugReport size={18} className="mr-[5px]" /> Report
                                            </button>
                                            <hr />
                                            {currentChat?.convoId && (

                                                <button onClick={blockHandler} className="px-[20px] py-[8px] flex flex-start items-center text-[#FF0000]">
                                                    <MdBlock size={18} className="mr-[5px]" />
                                                    {currentChat?.blockedBy?.includes(accountInfo?.data._id) ? "Unblock" : "Block"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/settings" className="h-[40px] w-[40px] bg-[#f0f8ff] shadow-md rounded-full border flex justify-center items-center overflow-hidden">
                                    <IoSettingsOutline size={20} color="#264348" className="animate-spin" title="Settings" />
                                </Link>
                                <IconButton
                                    icon={<IoIosLogOut size={20} />}
                                    className="h-[40px] w-[40px] shadow-md"
                                    onClick={handleLogout}
                                    title="Logout"
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}