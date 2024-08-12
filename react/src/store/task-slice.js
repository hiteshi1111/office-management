import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: [],
    activeProject: null,
    milestones: [],
    layout: "kanban",
    projectTrigger: 0,
    assignees: [],
    modalOpen: false,
    selectedTaskData: null,
    selectedMilestone: null,
    taskAssignees: [],
    commentTrigger: 0
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setProjects(state, action) {
            state.projects = action.payload;
        },
        setActiveProject(state, action) {
            state.activeProject = action.payload;
        },
        setMilestones(state, action) {
            state.milestones = action.payload;
        },
        setLayout(state, action) {
            state.layout = action.payload;
        },
        setProjectTrigger(state, action) {
            state.projectTrigger = action.payload;
        },
        setAssignees(state, action) {
            state.assignees = action.payload;
        },
        setModalOpen(state, action) {
            state.modalOpen = action.payload;
        },
        setSelectedTaskData(state, action) {
            state.selectedTaskData = action.payload;
        },
        setSelectedMilestone(state, action) {
            state.selectedMilestone = action.payload;
        },
        setTaskAssignees(state, action) {
            state.taskAssignees = action.payload;
        },
        setCommentTrigger(state, action) {
            state.commentTrigger = action.payload;
        }
    }
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;