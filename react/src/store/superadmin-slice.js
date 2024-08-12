import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    planDistribution: null,
    adminList: [],
    planList: [],
    triggerPlans: 0
}

const superadminSlice = createSlice({
    name: 'superadmin',
    initialState,
    reducers: {
        setPlanDistribution(state, action) {
            state.planDistribution = action.payload;
        },
        setAdminList(state, action) {
            state.adminList = action.payload;
        },
        setPlanList(state, action) {
            state.planList = action.payload;
        },
        setTriggerPlans(state, action) {
            state.triggerPlans = action.payload;
        }
    }
});

export const superadminActions = superadminSlice.actions;

export default superadminSlice.reducer;