import React, { useEffect, useRef, useState } from 'react';
import { GiChatBubble } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { GetRequest, PostRequest, PutRequest } from '../../utils/request';
import ChatSocket from "../../socket/chat-socket";
import Layout from '../../layout';
import MessageRequest from '../../components/chat/messageRequest';
import InputActions from '../../components/chat/inputActions';
import { chatActions } from '../../store/chat-slice';
import BlockedMessage from '../../components/chat/blockedMessage';
import Typing from '../../components/shared/typing';
import Timestamp from '../../components/chat/timestamp';
import { encrypt } from '../../utils/encryption';
import SingleMessage from '../../components/chat/singleMessage';

const Chat = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const messageEl = useRef(null);
    const messageRef = useRef(null);

    const { accountInfo } = useSelector((state) => state.account);
    const { chatTheme } = useSelector(state => state.ui);
    const {
        currentChat,
        replyData,
        allMessages,
        currentChatRequest,
        isSearched,
        triggerChat,
        message,
        editing
    } = useSelector((state) => state.chat);

    const [image, setImage] = useState(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [receivedmsg, setReceivedmsg] = useState([]);

    const [indicator, setIndicator] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState({
        emoji: "",
        action: ""
    })

    ChatSocket.useMessageEvent(setReceivedmsg, setIndicator, receivedmsg, indicator);
    ChatSocket.useMyMessageEvent(setReceivedmsg);
    // ChatSocket.useSeenMessageEvent(setOpenedMyChat);
    ChatSocket.useFriendChatEvent();
    ChatSocket.useTypingIndicatorEvent(currentChat?.userData?._id, accountInfo?.data?._id, setIndicator);
    ChatSocket.useShowReactionEvent(receivedmsg, setReceivedmsg);
    ChatSocket.useRemoveMessageEvent();
    ChatSocket.useSingleMsgSeenEvent(receivedmsg, setReceivedmsg);
    ChatSocket.useEditMsgEvent();

    const blockedByMe = currentChat?.blockedBy?.includes(accountInfo?.data._id) || false;

    function getRequest(id) {
        GetRequest(`${process.env.REACT_APP_URL}/request/${id}`).then(response => {
            dispatch(chatActions.setCurrentChatRequest(response.data))
        }).catch(error => {
            console.log("request error >>>", error);
        });
    };
         
    function messageHandler() {
        setOpenEmoji(false)
        if (message.trim() !== '') {
            const formData = new FormData();
            formData.append('conversationId', currentChat?.convoId);
            formData.append('from', accountInfo?.data._id);
            formData.append('to', currentChat?.userData._id);
            formData.append('message', encrypt(message));
            if (replyData && replyData?._id) {
                formData.append('replyTo', replyData._id);
            }
            PostRequest(`${process.env.REACT_APP_URL}/message`, formData).then(response => {
                dispatch(chatActions.setReplyData(null));
                dispatch(chatActions.setIsSearched(true))
                if (!currentChat.convoId) {
                    ChatSocket.emitSendMsgRequest(response?.data?.message?.to)
                    dispatch(chatActions.setCurrentChat({ ...currentChat, convoId: response.data.convoId }))
                    ChatSocket.emitFirstMessage(response.data.message, accountInfo?.data);
                    dispatch(chatActions.setTriggerChat(triggerChat + 1))
                }
                else {
                    ChatSocket.emitNewMessage(response.data.message, accountInfo?.data);
                }
                dispatch(chatActions.setMessage(""))
            }).catch(error => {
                console.log("message error >>>", error);
            });
        }
    }

    function editMessageHandler() {
        PutRequest(`${process.env.REACT_APP_URL}/message/${editing}`, {
            message: encrypt(message),
            isEdited: true
        }).then(response => {
            // if (!currentChat.convoId) {
            //     ChatSocket.emitSendMsgRequest(response?.data?.message?.to)
            //     dispatch(chatActions.setCurrentChat({ ...currentChat, convoId: response.data.convoId }))
            //     ChatSocket.emitFirstMessage(response.data.message, accountInfo?.data);
            //     dispatch(chatActions.setTriggerChat(triggerChat + 1))
            // }
            // else {
            //     ChatSocket.emitNewMessage(response.data.message, accountInfo?.data);
            // }
            ChatSocket.emitEditMessage(currentChat?.userData?._id)
            dispatch(chatActions.setEditing(null))
            dispatch(chatActions.setMessage(""))
            dispatch(chatActions.setTriggerChat(triggerChat + 1));

        }).catch(error => {
            console.log("edit message error >>>", error)
        })
    }

    useEffect(() => {
        if (messageEl.current) {
            const handleNodeInserted = () => {
                messageEl.current.scroll({ top: messageEl.current.scrollHeight, behavior: 'auto' });
            };
            handleNodeInserted(); // Scroll to bottom on mount
            const currentEl = messageEl.current;
            currentEl.addEventListener('DOMNodeInserted', handleNodeInserted);

            return () => {
                currentEl.removeEventListener('DOMNodeInserted', handleNodeInserted);
            };
        }
    }, []);

    useEffect(() => {
        if (messageEl.current) {
            messageEl.current.scroll({ top: messageEl.current.scrollHeight, behavior: 'auto' });
        }
    }, [receivedmsg, allMessages]);

    useEffect(() => {
        if (accountInfo && currentChat && currentChat.convoId) {
            GetRequest(`${process.env.REACT_APP_URL}/message/${currentChat.convoId}`).then(response => {
                const filteredMessage = response.data.filter(item => item?.deletedBy !== accountInfo?.data?._id)
                // const sortedMessages =  filteredMessage.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
                dispatch(chatActions.setAllMessages(filteredMessage))
                setReceivedmsg([])
                const timer = setTimeout(() => {
                    dispatch(chatActions.setLoadingChat(false))
                }, 1000);
                return () => clearTimeout(timer);
            }).catch(error => {
                console.log("fetch message error >>>", error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, currentChat, triggerChat])

    useEffect(() => {
        if (accountInfo && currentChat?.convoId) {
            getRequest(currentChat.convoId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, currentChat, isSearched])

    function messageActionHandler(id) {
        if (selectedMessage.action) {
            setSelectedMessage((prevState) => ({ ...prevState, action: "" }))
        } else {
            setSelectedMessage((prevState) => ({ ...prevState, action: id }))
        }
    }
    const handleTyping = (e) => {
        dispatch(chatActions.setMessage(e.target.value))
        ChatSocket.emitTypingIndicatorEvent(currentChat?.userData._id, accountInfo?.data?._id);
    };
    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            if (message.length > 0) {
                if(editing) {
                    editMessageHandler()
                }
                else {
                    messageHandler()
                }
                // editing ? editMessageHandler() : messageHandler()
                // messageHandler();
            }
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle non-image file selection
            alert("Please select an image file.");
        }
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
        setOpenEmoji(false)
    };

    const handleEmojiClick = (emoji) => {
        dispatch(chatActions.setMessage(message + emoji?.emoji))
    };

    function togglePicker(id) {
        if (selectedMessage.emoji && selectedMessage.emoji.toString() === id) {
            setSelectedMessage((prevState) => ({ ...prevState, emoji: "" }))
        } else {
            setSelectedMessage((prevState) => ({ ...prevState, emoji: id }))
        }
    };
    // console.log("currentChat", currentChat)
    // console.log("lastmsg", lastMsg)
    // //seen live msg
    // useEffect(() => {
    //     if ((lastMsg !== "") && currentChat) {
    //         // const hasUnreadMessagesFromOthers = lastMsg.data.from !== accountInfo?.data?._id;

    //         if (lastMsg?.data?.from !== accountInfo?.data?._id) {
    //             PutRequest(`${process.env.REACT_APP_URL}/message/seenmsg/${lastMsg.data._id}`)
    //                 .then((response) => {
    //                     console.log("response", response);
    //                     ChatSocket.emitOpenChat(currentChat?.userData?._id, accountInfo?.data?._id, response?.data._id, "single msg");
    //                 })
    //                 .catch((error) => {
    //                     console.log("error seeing messages", error);
    //                 });
    //         }
    //     }
    // }, [lastMsg, currentChat, accountInfo]);

    // console.log("messageRef >", messageRef.current.id);

    return (
        <Layout bgClass={chatTheme.className}>
            {messageRef.current?.id && (
                <Timestamp date={messageRef.current.id} />
            )}
            {currentChat ? (
                <>
                    <div className='scrollar-width-zero w-full h-[calc(100vh_-_157px)] overflow-hidden overflow-y-auto pt-[20px] md:px-[10px] flex-end' ref={messageEl}>

                        {/* {/ GET REQUEST OR SHOW PENDING APPROVAL /} */}
                        {(currentChat?.blockedBy?.length === 0) && currentChatRequest && (
                            <MessageRequest
                                getRequest={getRequest}
                                request={currentChatRequest}
                            />
                        )}

                        {/* {/ PREVIOUS MESSAGES /} */}
                        {allMessages.length > 0 && allMessages.map((item, i) => (
                            <SingleMessage
                                i={i}
                                item={item}
                                messageActionHandler={messageActionHandler}
                                allMessages={allMessages}
                                selectedAction={selectedMessage.action}
                                selectedEmoji={selectedMessage.emoji}
                                togglePicker={togglePicker}
                                messageRef={messageRef}
                            />
                        ))}

                        {/* {/ LIVE MESSAGES /} */}
                        {receivedmsg.length > 0 && receivedmsg.map((item, i) => (
                            ((item.data.from === accountInfo?.data._id || item.data.from === currentChat?.userData._id) &&
                                (item.data.to === accountInfo?.data._id || item.data.to === currentChat?.userData._id)) && (
                                <SingleMessage
                                    i={i}
                                    item={item?.data}
                                    messageActionHandler={messageActionHandler}
                                    allMessages={receivedmsg}
                                    selectedAction={selectedMessage.action}
                                    selectedEmoji={selectedMessage.emoji}
                                    togglePicker={togglePicker}
                                    messageRef={messageRef}
                                />
                            )
                        ))}
                        {indicator &&
                            <Typing />
                        }
                    </div>

                    {/* {/ CHAT INPUT ACTIONS /} */}
                    {(currentChat?.blockedBy?.length === 0 && (!currentChatRequest || (currentChatRequest && currentChatRequest.from._id === accountInfo?.data._id))) && (
                        <InputActions
                            fileInputRef={fileInputRef}
                            image={image}
                            setImage={setImage}
                            openEmoji={openEmoji}
                            setOpenEmoji={setOpenEmoji}
                            handleEmojiClick={handleEmojiClick}
                            messageHandler={editing ? editMessageHandler : messageHandler}
                            handleIconClick={handleIconClick}
                            handleFileChange={handleFileChange}
                            handleKeyDown={handleKeyDown}
                            handleTyping={handleTyping}
                            typing={indicator}
                        />
                    )}
                    {currentChat?.blockedBy?.length > 0 &&
                        <BlockedMessage blockedByMe={blockedByMe} />
                    }
                </>
            ) : (
                <div className='w-full text-center h-[90vh] flex flex-col justify-center items-center'>
                    <GiChatBubble size={40} color='#adaee5' className='animate-bounce' />
                    <p className='mt-[10px] text-[20px]'>Select chat to continue...</p>
                </div>
            )}
        </Layout>
    )
}

export default Chat;