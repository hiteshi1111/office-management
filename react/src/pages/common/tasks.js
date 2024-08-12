import React, { useEffect, useState } from "react";
import { TbLayoutKanban } from "react-icons/tb";
import { MdBrowserNotSupported, MdOutlineChecklist } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { DeleteRequest, GetRequest } from "../../utils/request";
import Layout from "../../layout";
import AddMilestone from "../../popups/addMilestone";
import Loader from "../../components/custom/loader";
import Kanban from "../../components/task/kanban";
import List from "../../components/task/list";
import { taskActions } from "../../store/task-slice";
import TaskView from "../../popups/taskView";
import TaskSocket from '../../socket/task-socket';

const Tasks = () => {
    const dispatch = useDispatch();
    const { projects, activeProject, milestones, layout, projectTrigger, selectedTaskData } = useSelector((state) => state.task);
    const [taskTrigger, setTaskTrigger] = useState(0);
    const [loader, setLoader] = useState(false);

    TaskSocket.useTaskAdded()
    TaskSocket.useTaskUpdate(taskTrigger, setTaskTrigger)

    useEffect(() => {
                if (activeProject) {
            if (!projects.some(project => project._id === activeProject._id) && projects.length > 0) {
                dispatch(taskActions.setActiveProject(projects[0]));
            } else {
                GetRequest(`${process.env.REACT_APP_URL}/task/${activeProject?._id}`).then((response) => {
                    dispatch(taskActions.setMilestones(response.data));
                    setLoader(false);
                }).catch((error) => {
                    console.error("Error fetching user details:", error);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [activeProject, taskTrigger, projectTrigger, projects])

    function deleteTaskHandler(id) {
        DeleteRequest(`${process.env.REACT_APP_URL}/task/${id}`).then((response) => {
            setTaskTrigger(prev => prev + 1)
        }).catch((error) => {
            console.error("Error deleteing task", error);
        });
    }
    return (
        <Layout containerClassName="max-w-none">
            {loader && (
                <Loader />
            )}
            {selectedTaskData &&
                <TaskView setTrigger={setTaskTrigger} projectId={activeProject?._id} />
            }
            <div className="flex justify-end">
                <div className="flex justify-end items-center max-lg:mt-[30px] mt-[50px]">
                    <div className="flex justify-end items-center px-[30px]">
                        <span className="text-[14px] mr-[10px]">Layout:</span>
                        <button 
                            title="Kanban"
                            onClick={() => dispatch(taskActions.setLayout("kanban"))} 
                            className={`border-y border-l px-[10px] py-[5px] ${layout === "kanban" && "bg-[#aaa]"}`}
                        >
                            <TbLayoutKanban size={18} />
                        </button>
                        <button 
                            title="List"
                            onClick={() => dispatch(taskActions.setLayout("list"))} 
                            className={`border px-[10px] py-[5px] ${layout === "list" && "bg-[#aaa]"}`}
                        >
                            <MdOutlineChecklist size={18} />
                        </button>
                    </div>
                    {projects.length > 0 && (
                        <div className="flex gap-[10px]">
                            <AddMilestone selectedProject={activeProject} setTrigger={setTaskTrigger} />
                        </div>
                    )}
                </div>
            </div>

            <div>
                {projects.length > 0 ? (
                    <div className="scroll-it">
                        {milestones.length > 0 ? (
                            layout === "kanban" ? (
                                <Kanban
                                    milestones={milestones}
                                    projectId={activeProject?._id}
                                    setTrigger={setTaskTrigger}
                                />
                            ) : (
                                <List
                                    milestones={milestones}
                                    projectId={activeProject?._id}
                                    deleteTaskHandler={deleteTaskHandler}
                                    setTrigger={setTaskTrigger}
                                />
                            )
                        ) : (
                            <div className='text-center mt-[50px] flex flex-col items-center justify-center'>
                                <p className='text-[20px] flex items-center'> <MdBrowserNotSupported className="mr-[10px]" /> No Task Added!</p>
                                <p>Add Milestone to add task!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center text-center h-[50vh]">
                        <h3>No Projects</h3>
                        <p className="text-[14px] mt-[10px]">Create Project to add tasks!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Tasks;