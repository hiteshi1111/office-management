import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../../store/chat-slice';
import ChatSocket from "../../socket/chat-socket";
import { GetRequest, PostRequest } from '../../utils/request';
import Layout from '../../layout';
import InputActions from '../../components/chat/inputActions';
import Loader from '../../components/custom/loader';
import SingleMessage from '../../components/chat/singleMessage';
import { encrypt } from '../../utils/encryption';

const Notes = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const messageEl = useRef(null);
    const [loading, setLoading] = useState(true);
    const { accountInfo } = useSelector((state) => state.account);
    const { chatTheme } = useSelector(state => state.ui);
    const { currentChat, replyData, allNotes, triggerChat, message } = useSelector((state) => state.chat);

    const [image, setImage] = useState(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [receivedNote, setReceivedNote] = useState([]);
    const [indicator, setIndicator] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState({
        emoji: "",
        action: ""
    })

    ChatSocket.useMessageEvent(setReceivedNote, setIndicator, receivedNote, indicator);
    ChatSocket.useMyMessageEvent(setReceivedNote);
    // ChatSocket.useSeenMessageEvent(setOpenedMyChat);
    ChatSocket.useFriendChatEvent();
    ChatSocket.useRemoveMessageEvent();
  
    function noteHandler() {
        setOpenEmoji(false)
        if (message.trim() !== '') {
            const formData = new FormData();
            formData.append('conversationId', currentChat?.convoId);
            formData.append('from', accountInfo?.data._id);
            formData.append('message', encrypt(message));
            if (replyData && replyData?._id) {
                formData.append('replyTo', replyData._id);
            }
            PostRequest(`${process.env.REACT_APP_URL}/message/notes`, formData).then(response => {
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

    useEffect(() => {
        if (accountInfo){
            dispatch(chatActions.setCurrentChat({ userData: accountInfo?.data, convoId: accountInfo?.data.convoId}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInfo])
    
    useEffect(() => {
        if (accountInfo && currentChat && currentChat.convoId) {
            GetRequest(`${process.env.REACT_APP_URL}/message/notes/${currentChat.convoId}`).then(response => {
                const filteredMessage  = response.data?.filter(item => item?.deletedBy !== accountInfo?.data?._id)
                dispatch(chatActions.setAllNotes(filteredMessage))
                setReceivedNote([])
                setLoading(false);
            }).catch(error => {
                console.log("fetch message error >>>", error);
            });
        }else{
            setLoading(false);
            dispatch(chatActions.setAllNotes([]))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, currentChat, triggerChat])

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
    }, [receivedNote]);

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
                noteHandler();
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
    
    return (
        <Layout bgClass={chatTheme.className}>
            {loading && (
                <Loader className='bg-[#F5FFFA]' loaderCss="text-[#000]" />
            )}
            <div className='scrollar-width-zero w-full h-[calc(100vh_-_157px)] overflow-hidden overflow-y-auto pt-[20px] md:px-[10px] flex-end' ref={messageEl}>
                {/* PREVIOUS MESSAGES */}
                {allNotes.length > 0 && allNotes.map((item, i) => (
                    <SingleMessage
                        i={i}
                        item={item}
                        messageActionHandler={messageActionHandler}
                        allMessages={allNotes}
                        selectedAction={selectedMessage.action}
                        selectedEmoji={selectedMessage.emoji}
                        togglePicker={togglePicker}
                    />
                ))}

                {/* LIVE MESSAGES */}
                {receivedNote.length > 0 && receivedNote.map((item, i) => (
                    <SingleMessage
                        i={i}
                        item={item?.data}
                        messageActionHandler={messageActionHandler}
                        allMessages={receivedNote}
                        selectedAction={selectedMessage.action}
                        selectedEmoji={selectedMessage.emoji}
                        togglePicker={togglePicker}
                    />
                ))}

            </div>

            {/* CHAT INPUT ACTIONS */}
            <InputActions
                fileInputRef={fileInputRef}
                image={image}
                setImage={setImage}
                openEmoji={openEmoji}
                setOpenEmoji={setOpenEmoji}
                handleEmojiClick={handleEmojiClick}
                messageHandler={noteHandler}
                handleIconClick={handleIconClick}
                handleFileChange={handleFileChange}
                handleKeyDown={handleKeyDown}
                handleTyping={handleTyping}
                typing={indicator}
            />
        </Layout>
    )
}

export default Notes;