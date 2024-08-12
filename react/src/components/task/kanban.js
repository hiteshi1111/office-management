import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { CiEdit } from "react-icons/ci";
import AddTask from '../../popups/addTask';
import MilestoneAction from '../../popups/milestoneAction';
import Avatar from '../custom/avatar';
import { CiMenuKebab } from "react-icons/ci";
import { taskActions } from '../../store/task-slice';
import { useDispatch } from 'react-redux';

const Kanban = ({ milestones, projectId, setTrigger = () => { } }) => {
    const dispatch = useDispatch();
    return (
        <div className="scrollar-width overflow-hidden overflow-x-auto md:h-[calc(100vh_-_160px)] max-md:h-[75vh] mt-[10px] pb-[30px]">
            <div className="flex grow shrink gap-[10px]">
                {milestones.map((item, i) => (
                    <div className='w-[350px] grow-0 shrink-0'>
                        <div key={i} className="p-[10px] bg-[#e8f0feaa] rounded-b-[20px] shadow-md">
                            <div className="group flex justify-between items-start mb-[10px] px-[10px] py-[8px]" style={{ backgroundColor: item.color }}>
                                <h6 className="capitalize text-[14px] text-[#fff]">{item.title}</h6>
                                <MilestoneAction
                                    icon={<CiEdit className='group-hover:block hidden text-[#fff]' />}
                                    data={item}
                                    setTrigger={setTrigger}
                                />
                            </div>
                            <div className='scrollar-width grid gap-[5px] overflow-hidden overflow-y-auto md:max-h-[calc(100vh_-_250px)] max-md:max-h-[calc(100vh_-_36vh)]'>
                                {item.tasks.length > 0 ? (
                                    item.tasks.map((task, i) => (
                                        <button
                                            onClick={() => {
                                                dispatch(taskActions.setModalOpen(true))
                                                dispatch(taskActions.setSelectedMilestone(item))
                                                dispatch(taskActions.setSelectedTaskData(task))
                                                dispatch(taskActions.setTaskAssignees(task.assignees))
                                            }}
                                            className={`border p-[10px] bg-white flex justify-between items-center gap-[10px] overflow-hidden min-h-[60px]`}
                                        >
                                            <>
                                                <h6 className="text-left text-[12px] capitalize">{task.title}</h6>
                                                <div className="flex items-center" >
                                                    {task.assignees.length > 0 && (
                                                        task.assignees.length > 5 ? (
                                                            <div className='flex items-center'>
                                                                {task.assignees.slice(0, 3).map((item, i) => (
                                                                    <Avatar
                                                                        src={item.avatar}
                                                                        alt={item.fullName}
                                                                        key={i}
                                                                        noOnline
                                                                        className={`ml-[-5px] first:ml-0`}
                                                                    />
                                                                ))}
                                                                <CiMenuKebab size={20} className='rotate-90' />
                                                            </div>
                                                        ) : (
                                                            task.assignees.map((item, i) => (
                                                                <Avatar
                                                                    src={item.avatar}
                                                                    alt={item.fullName}
                                                                    key={i}
                                                                    noOnline
                                                                    className={`ml-[-5px] first:ml-0`}
                                                                />
                                                            ))
                                                        )
                                                    )}
                                                </div>
                                            </>

                                        </button>
                                    ))
                                ) : (
                                    <div className='text-[14px] text-center my-[10px]'>No Tasks</div>
                                )}
                                <AddTask
                                    icon={<div className='flex items-center justify-center gap-[5px] py-[5px]'><IoMdAdd color="#000" size={16} /> <span className='text-[14px]'>Add Task</span></div>}
                                    projectId={projectId}
                                    milestones={milestones}
                                    item={item}
                                    setTrigger={setTrigger}
                                    className='mt-[3px]'
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Kanban;