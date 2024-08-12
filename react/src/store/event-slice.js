import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: null
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEvents(state, action){
            state.events = action.payload;
        },
    }
});

export const eventActions = eventSlice.actions;

export default eventSlice.reducer;