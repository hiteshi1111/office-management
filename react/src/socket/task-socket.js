import { useEffect } from "react";
import socket from ".";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "../store/task-slice";

const useTaskRoomSetup = (projectId, userId) => {
    socket.emit('join', projectId);
    socket.emit('task', userId);
};

const emitProjectUpdate = (userId, assignees) => {
    socket.emit("projectupdated", {
        userId,
        assignees,
    })
};

const emitTaskUpdate = (projectId, data, taskAssignees, msg) => {
    socket.emit("taskupdated", {
        projectId,
        data,
        taskAssignees,
        message: msg
    })
};

const useProjectUpdate = () => {
    const dispatch = useDispatch()
    const { accountInfo } = useSelector((state) => state.account);
    const { projectTrigger } = useSelector((state) => state.task);

    useEffect(() => {
        const handleProjectUpdate = (data) => {
            if (data.id === accountInfo?.data?._id) {
                dispatch(taskActions.setProjectTrigger(projectTrigger + 1))
            }
        }
        socket.on('updation in project', handleProjectUpdate);
        return () => {
            socket.off('updation in project', handleProjectUpdate);
        };
    },)
}

const useTaskAdded = () => {
    const dispatch = useDispatch()
    const { accountInfo } = useSelector((state) => state.account);
    const { projectTrigger } = useSelector((state) => state.task);

    useEffect(() => {
        const handleTaskAdded = (data) => {
            if (data.id === accountInfo?.data?._id) {
                console.log("reached")
                dispatch(taskActions.setProjectTrigger(projectTrigger + 1))
            }
        }
        socket.on('new task added', handleTaskAdded);
        return () => {
            socket.off('new task added', handleTaskAdded);
        };
    },)
}



const useTaskUpdate = (taskTrigger, setTaskTrigger) => {
    const dispatch = useDispatch();
    const { selectedTaskData, modalOpen, projectTrigger } = useSelector((state) => state.task);
    useEffect(() => {
        const handleTaskUpdate = (data) => {
            // console.log("data", data)
            // console.log("selectedTaskData", selectedTaskData)
            if (data && selectedTaskData?._id === data.data._id) {
                if (data.message === "task updated") {
                    dispatch(taskActions.setSelectedTaskData(data.data))
                } else if (data.message === "milestone updated") {
                    dispatch(taskActions.setSelectedMilestone(data.data.milestoneId))
                } else {
                    dispatch(taskActions.setTaskAssignees(data.data.assignees))
                }
                dispatch(taskActions.setProjectTrigger(projectTrigger + 1));
            }
            if (data && (selectedTaskData?._id === data.data.taskId || selectedTaskData?._id === data.data)) {
                dispatch(taskActions.setCommentTrigger(prev => prev + 1))
            }
            if (data && data.message === 'task deleted') {
                dispatch(taskActions.setModalOpen(false));
                setTaskTrigger(prev => prev + 1);
                dispatch(taskActions.setProjectTrigger(projectTrigger + 1));
            }
            if (!selectedTaskData && data) {
                setTaskTrigger(prev => prev + 1);
                dispatch(taskActions.setProjectTrigger(projectTrigger + 1));
            }
        };
        socket.on('updation in task', handleTaskUpdate);
        return () => {
            socket.off('updation in task', handleTaskUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskTrigger, modalOpen, projectTrigger]);
}

const socketEvents = {
    useTaskRoomSetup,
    emitProjectUpdate,
    useProjectUpdate,
    useTaskAdded,
    emitTaskUpdate,
    useTaskUpdate
}

export default socketEvents;