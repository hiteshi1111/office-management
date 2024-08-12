import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accountInfo: null,
    projects: [],
    currentPlan: null,
    companyData: null,
    planTrigger: 0
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountInfo(state, action) {
            state.accountInfo = action.payload;
        },
        setProjects(state, action) {
            state.projects = action.payload;
        },
        setCurrentPlan(state, action) {
            state.currentPlan = action.payload;
        },
        setCompanyData(state, action) {
            state.companyData = action.payload;
        },
        logOut() {
            localStorage.removeItem("xios");
            return initialState;
        },
        setPlanTrigger(state, action) {
            state.planTrigger = action.payload;
        },
    }
});

export const accountActions = accountSlice.actions;

export default accountSlice.reducer;