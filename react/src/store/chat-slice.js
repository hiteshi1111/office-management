import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentChat: null,
    forwardData: null,
    replyData: null,
    chatList: [],
    onlineUsers: [],
    assigneeList: [],
    messageRequests: [],
    triggerChat: 0,
    allMessages: [],
    receivedmsg: [],
    currentChatRequest: null,
    isSearched: false,
    selectedMessage: "",
    openActions: false,
    isCalling: null,
    msgRequest: false,
    triggerRequests: 0,
    loadingChat: false,
    allNotes: [],
    message: "",
    editing: null
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat(state, action){
            state.currentChat = action.payload;
        },
        logOut(){
            return initialState;
        },
        setForwardData(state, action){
            state.forwardData = action.payload;
        },
        setReplyData(state, action){
            state.replyData = action.payload;
        },
        setChatList(state, action) {
            state.chatList = action.payload;
        },
        setOnlineUsers(state, action){
            state.onlineUsers = action.payload;
        },
        setAssigneeList(state, action){
            state.assigneeList = action.payload;
        },
        setMessageRequests(state, action){
            state.messageRequests = action.payload;
        },
        setTriggerChat(state, action){
            state.triggerChat = action.payload;
        },
        setAllMessages(state, action){
            state.allMessages = action.payload;
        },
        setCurrentChatRequest(state, action){
            state.currentChatRequest = action.payload;
        },
        setIsSearched(state, action){
            state.isSearched = action.payload;
        },
        setSelectedMessage(state, action){
            state.selectedMessage = action.payload;
        },
        setOpenActions(state, action){
            state.openActions = action.payload;
        },
        setIsCalling(state, action){
            state.isCalling = action.payload;
        },
        setMsgRequest(state, action){
            state.msgRequest = action.payload;
        },
        setTriggerRequests(state, action){
            state.triggerRequests = action.payload;
        }, 
        setReceivedmsg(state, action){
            state.receivedmsg = action.payload;
        },      
        setLoadingChat(state, action){
            state.loadingChat = action.payload;
        },
        setAllNotes(state, action){
            state.allNotes = action.payload;
        },
        setMessage(state, action){
            state.message = action.payload;
        },
        setEditing(state, action){
            state.editing = action.payload;
        }
    }
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;