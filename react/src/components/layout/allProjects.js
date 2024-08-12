import React, { useEffect } from 'react'
import { GetRequest } from '../../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { taskActions } from '../../store/task-slice';
import AddProject from '../../popups/addProject';
import getInitialLetter from '../../utils/getInitialLetter';
import ProjectAction from '../../popups/projectAction';
import { FiEdit2 } from "react-icons/fi";
import { Link, useLocation } from 'react-router-dom';
import TaskSocket from "../../socket/task-socket";

const Projects = ({onClick=()=>{}}) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { accountInfo } = useSelector((state) => state.account);
    const { projects, activeProject, projectTrigger } = useSelector((state) => state.task);

    TaskSocket.useTaskRoomSetup(accountInfo?.data?._id)
    TaskSocket.useProjectUpdate()


    useEffect(() => {
        if (accountInfo && accountInfo.data?.adminId) {
            GetRequest(`${process.env.REACT_APP_URL}/project/${accountInfo?.data._id}`).then((response) => {
                dispatch(taskActions.setProjects(response.data));
                if (!activeProject) {
                    dispatch(taskActions.setActiveProject(response.data[0]));
                }
            }).catch((error) => {
                console.error("Error fetching user details:", error);
            });
        }
        if (accountInfo && !accountInfo.data?.adminId) {
            GetRequest(`${process.env.REACT_APP_URL}/project/admin/${accountInfo?.data?._id}`).then((response) => {
                dispatch(taskActions.setProjects(response.data));
                if (!activeProject) {
                    dispatch(taskActions.setActiveProject(response.data[0]));
                }
            }).catch((error) => {
                console.error("Error fetching user details:", error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, projectTrigger]);

    return (
        <div className='bg-white overflow-hidden overflow-y-auto py-[10px] px-[10px]'>
            <div className='flex justify-between items-center'>
                <div className='text-[12px] text-[#aaa] text-left'>My Projects</div>
                {!accountInfo?.data?.adminId && (
                    <AddProject trigger={() => dispatch(taskActions.setProjectTrigger(projectTrigger + 1))} />
                )}
            </div>
            <div className='grid gap-[5px] items-start mt-[10px] overflow-y-auto max-h-[150px]'>
                {projects.length > 0 ? (
                    projects.map((item, i) => (
                        <Link 
                            key={i} 
                            to="/tasks" 
                            onClick={() => {
                                dispatch(taskActions.setActiveProject(item))
                                onClick()
                            }} 
                            className={`group flex items-center justify-between gap-[10px] px-[5px] py-[3px] ${pathname === "/tasks" && item._id === activeProject._id && "bg-[#e8f0fe] rounded-full"}`}
                        >
                            <div className='flex items-center justify-start gap-[10px]'>
                                <div className="relative uppercase min-w-[30px] h-[30px] border rounded-full flex justify-center items-center bg-white text-[12px]">
                                    {getInitialLetter(item.title)}
                                </div>
                                <div className={`break-words text-[12px] text-left break-all capitalize w-full ${activeProject._id === item._id && "text-[#264348]"}`}>{item.title}</div>
                            </div>
                            {!accountInfo.data.adminId && (
                                <ProjectAction
                                    icon={<FiEdit2 size={10} color="#aaa" />}
                                    data={item}
                                    userId={accountInfo.data._id}
                                    setTrigger={() => dispatch(taskActions.setProjectTrigger(projectTrigger + 1))}
                                    className='group-hover:block hidden mr-[5px]'
                                />
                            )}
                        </Link>
                    ))
                ) : (
                    <p className='text-[#aaa] text-[12px] text-center'>No Project!</p>
                )}
            </div>
        </div>
    )
}

export default Projects;