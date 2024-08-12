import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toastify: "",
    showDrawer: false,
    showProfile: false,
    currentTheme: "",
    chatTheme: {
        title: "White",
        className: "bg-[#f5fffa]",
        textColor: "text-black"
    }
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setToastify(state, action){
            state.toastify = action.payload;
        },
        setDrawer(state, action){
            state.showDrawer = action.payload;
        },
        setShowProfile(state, action){
            state.showProfile = action.payload;
        },
        setCurrentTheme(state, action){
            state.currentTheme = action.payload;
        },
        setChatTheme(state, action){
            state.chatTheme = action.payload;
        }
    },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;