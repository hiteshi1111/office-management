import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatNotify: false,
    notificationMsg: null,

}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setChatNotify(state, action) {
            state.chatNotify = action.payload;
        },
        setNotificationMsg(state, action) {
            state.notificationMsg = action.payload;
        }
    }
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;