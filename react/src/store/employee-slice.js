import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employees: [],
    filteredResults: [],
    departments: [],
    roles: [],
    selectedDepartment: null,
    selectedRole: null,
    searchKey: "",
    updateEmployee: null,
    viewEmployee: null,
    enquiryList: []
}

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployees(state, action){
            state.employees = action.payload;
        },
        setFilteredResults(state, action){
            state.filteredResults = action.payload;
        },
        setDepartments(state, action){
            state.departments = action.payload;
        },
        setRoles(state, action){
            state.roles = action.payload;
        },
        setSelectedDepartment(state, action){
            state.selectedDepartment = action.payload;
        },
        setSelectedRole(state, action){
            state.selectedRole = action.payload;
        },
        setSearchKey(state, action){
            state.searchKey = action.payload;
        },
        setUpdateEmployee(state, action){
            state.updateEmployee = action.payload;
        },
        setViewEmployee(state, action){
            state.viewEmployee = action.payload;
        },
        setEnquiryList(state, action){
            state.enquiryList = action.payload;
        }
    }
});

export const employeeActions = employeeSlice.actions;

export default employeeSlice.reducer;