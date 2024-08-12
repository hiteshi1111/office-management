import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from ".";
import Notifications from "../components/shared/notification";
import { chatActions } from "../store/chat-slice";
import { useLocation } from 'react-router-dom';
import { PutRequest } from "../utils/request";

const useSocketSetup = () => {
    const accountInfo = useSelector((state) => state.account?.accountInfo);
    useEffect(() => {
        if (accountInfo?.data?._id) {
            socket.emit("setup", accountInfo.data._id);
        }
    }, [accountInfo?.data?._id]);
};

// FOR CALLING
const emitCalling = (to, from) => {
    socket.emit("calling", to, from);
};

// FOR CALLING END
const emitCallEnd = (to, from) => {
    socket.emit("end calling", to, from);
};

const emitNewMessage = (data, friend) => {
    socket.emit("new message", data, friend);
};

const emitFirstMessage = (data, friend) => {
    socket.emit("first message", data, friend);
};

const emitOpenChat = (to, from, msgId, msg) => {
    socket.emit("openChat", to, from, msgId, msg);
};

const emitRefreshEvent = (id) => {
    socket.emit("refreshEvent", id);
};

const emitTypingIndicatorEvent = (to, from) => {
    socket.emit("typing", to, from);
};

const emitEmojiReactEvent = (messageId, emoji) => {
    socket.emit("reactedEmoji", messageId, emoji);
};

const emitEditMessage = (to) => {
    socket.emit("edit message", to);
};

const emitRemoveMessage = () => {
    socket.emit("removed message", "removedMsg");
};

const emitBlockUser = (frndId, data, by, message) => {
    socket.emit("user blocked", frndId, data, by, message);
};

const emitSendMsgRequest = (frndId) => {
    socket.emit("request sent", frndId);
};

const useNotificationEvent = (currentChat) => {
    const { pathname } = useLocation();
    useEffect(() => {
        const handleNotificationReceived = (newNotification) => {
            if (!(currentChat?.userData?._id === newNotification?.friend?._id && pathname === '/chat')) {
                Notifications.useshowNotification(newNotification?.data, newNotification?.friend)
            }
        };
        socket.on('notification received', handleNotificationReceived);
        return () => {
            socket.off('notification received', handleNotificationReceived);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat]);
};

const useCallingEvent = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const handleMessageReceived = (data) => {
            dispatch(chatActions.setIsCalling(data))
        };
        socket.on('calling me', handleMessageReceived);
        return () => {
            socket.off('calling me', handleMessageReceived);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

const useEndCallEvent = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const handleMessageReceived = (data) => {
            dispatch(chatActions.setIsCalling(null))
        };
        socket.on('rejecting call', handleMessageReceived);
        return () => {
            socket.off('rejecting call', handleMessageReceived);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

const useMessageEvent = (setReceivedMsg, setIndicator, receivedmsg, indicator) => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { currentChat, triggerChat } = useSelector((state) => state.chat);

    useEffect(() => {
        const handleMessageReceived = (newMessage) => {
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
            setIndicator(false);
            if (newMessage && currentChat?.convoId === newMessage?.data?.conversationId) {
                PutRequest(`${process.env.REACT_APP_URL}/message/seenmsg/${newMessage.data._id}`)
                    .then((response) => {
                        socket.emit("openChat", currentChat?.userData?._id, accountInfo?.data?._id, response?.data._id, "single msg");
                        // socket.emit("openChat", to, from, msgId, msg);
                        console.log("riyaaaaaaaaaaaa>");

                    })
                    .catch((error) => {
                        console.log("error seeing messages", error);
                    });
            }
            // Notifications.useshowNotification(newMessage?.data, newMessage?.friend)
        };
        socket.on('message received', handleMessageReceived);
        return () => {
            socket.off('message received', handleMessageReceived);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedmsg, indicator]);
};

const useMyMessageEvent = () => {
    const dispatch = useDispatch();
    const {  triggerChat } = useSelector((state) => state.chat);
    useEffect(() => {
        const handleMessageReceived = (newMessage) => {
            dispatch(chatActions.setTriggerChat(triggerChat + 1))
        };
        socket.on('my message', handleMessageReceived);
        return () => {
            socket.off('my message', handleMessageReceived);
        };
    });
};

const useSeenMessageEvent = (setOpenedMyChat) => {
    useEffect(() => {
        const handleMessageSeen = (data) => {
            setOpenedMyChat((prevData) => {
                const existingIndex = prevData.findIndex(item => item.from === data.from);
                if (existingIndex !== -1) {
                    return prevData.map((item, index) =>
                        index === existingIndex ? { ...item, to: data.to } : item
                    );
                } else {
                    return [...prevData, data];
                }
            });
        };

        socket.on('opened our chat by one', handleMessageSeen);
        return () => {
            socket.off('opened our chat by one', handleMessageSeen);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setOpenedMyChat]);
};

const useFriendChatEvent = () => {
    const dispatch = useDispatch()
    const { triggerChat } = useSelector((state) => state.chat);

    useEffect(() => {
        const handleChatEvent = (data) => {
            if (data) {
                dispatch(chatActions.setTriggerChat(triggerChat + 1));
            }
        };
        socket.on('trigger friend chat', handleChatEvent);
        return () => {
            socket.off('trigger friend chat', handleChatEvent);
        };
    });
};

const useSingleMsgSeenEvent = (receivedmsg) => {
    const dispatch = useDispatch()
    const { currentChat, triggerChat } = useSelector((state) => state.chat);
    useEffect(() => {
        const handleSingleMsgEvent = (data) => {
            // console.log("dddddddddddd", data)
            // console.log("receivedmsg", receivedmsg)
            // console.log("currentChat", currentChat)
            if (receivedmsg.length > 0 || currentChat.userData._id === data.from) {
                const updatedMessages = receivedmsg.map((msg) => {
                    if (msg.data._id === data.msgId) {
                        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                        return {
                            ...msg,
                            data: {
                                ...msg.data,
                                isRead: true
                            },
                        };
                    }

                    return msg;
                });
                console.log("updatedMessages", updatedMessages)
                dispatch(chatActions.setTriggerChat(triggerChat + 1))

            }
            // else {
            //     if (currentChat.userData._id === data.from) {
            //         console.log(">>>>>>>>>>>rrrrrrrrrrrrri>");

            //         dispatch(chatActions.setTriggerChat(triggerChat + 1))
            //     }
            // }


        };
        socket.on('msg is seen', handleSingleMsgEvent);
        return () => {
            socket.off('msg is seen', handleSingleMsgEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedmsg]);
};

const useTypingIndicatorEvent = (to, from, setIndicator) => {
    useEffect(() => {
        const handleIndicatorEvent = (isTyping) => {
            if (isTyping.from === to && isTyping.to === from) {
                setIndicator(true);
                setTimeout(() => {
                    setIndicator(false);
                }, 5000);
            }
        };

        socket.on('typing', handleIndicatorEvent);
        return () => {
            socket.off('typing', handleIndicatorEvent);
        };
    }, [to, from, setIndicator]);
};


const useEditMsgEvent = () => {
    const dispatch = useDispatch()
    const { triggerChat } = useSelector((state) => state.chat);

    useEffect(() => {
        const handleChatEvent = (data) => {
            if (data) {
                dispatch(chatActions.setTriggerChat(triggerChat + 1));
            }
        };
        socket.on('updated chat', handleChatEvent);
        return () => {
            socket.off('updated chat', handleChatEvent);
        };
    });
};

const useShowReactionEvent = (receivedmsg, setReceivedmsg) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const handleEmojiEvent = (reaction) => {
            dispatch(chatActions.setTriggerChat(prev => prev + 1));
        };
        socket.on('send emoji', handleEmojiEvent);
        return () => {
            socket.off('send emoji', handleEmojiEvent);
        };
    }, [receivedmsg, setReceivedmsg, dispatch]);
};

const useRemoveMessageEvent = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const handleRemoveEvent = (newChat) => {
            if (newChat) {
                dispatch(chatActions.setTriggerChat(prev => prev + 1));
            }
        }
        socket.on('updatedChat', handleRemoveEvent);
        return () => {
            socket.off('updatedChat', handleRemoveEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])
};

const useShowBlockedEvent = () => {
    const { triggerChat, currentChat } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);

    const dispatch = useDispatch();
    useEffect(() => {
        const handleBlock = (data) => {
            if (data?.id === accountInfo?.data?._id) {
                dispatch(chatActions.setTriggerChat(triggerChat + 1))
                if (data?.by === currentChat?.userData?._id) {
                    if (data?.message === "accepted") {
                        dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: true }));
                    }
                    else if (data?.message === "removed") {
                        dispatch(chatActions.setCurrentChat({ ...currentChat, isFriend: false }));
                    }
                    else {
                        dispatch(chatActions.setCurrentChat({ ...currentChat, blockedBy: data.data }));

                    }
                }
            }
        };
        socket.on('showBlocked', handleBlock);
        return () => {
            socket.off('showBlocked', handleBlock);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerChat, currentChat]);
};

const useMsgRequestEvent = (userId) => {
    const dispatch = useDispatch();
    const { triggerChat } = useSelector((state) => state.chat);

    useEffect(() => {
        const handleRequest = (id) => {
            if (id === userId) {
                dispatch(chatActions.setMsgRequest(true))
                dispatch(chatActions.setTriggerChat(triggerChat + 1))
            }
        };
        socket.on('show request', handleRequest);
        return () => {
            socket.off('show request', handleRequest);
        };
    });
};

const socketEvents = {
    useSocketSetup,
    emitNewMessage,
    emitFirstMessage,
    emitOpenChat,
    emitRefreshEvent,
    useNotificationEvent,
    useMessageEvent,
    useMyMessageEvent,
    useSeenMessageEvent,
    useSingleMsgSeenEvent,
    useFriendChatEvent,
    emitTypingIndicatorEvent,
    useTypingIndicatorEvent,
    emitEmojiReactEvent,
    useShowReactionEvent,
    emitRemoveMessage,
    useRemoveMessageEvent,
    emitCalling,
    useCallingEvent,
    emitCallEnd,
    useEndCallEvent,
    emitBlockUser,
    useShowBlockedEvent,
    emitSendMsgRequest,
    useMsgRequestEvent,
    emitEditMessage,
    useEditMsgEvent
};

export default socketEvents;
