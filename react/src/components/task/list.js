import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { formatDate } from '../../utils/formatDate';
import { MdDelete } from 'react-icons/md';
import MilestoneAction from '../../popups/milestoneAction';
import AddTask from '../../popups/addTask';
import Avatar from '../custom/avatar';
import IconButton from '../custom/iconButton';
import { useDispatch } from 'react-redux';
import { taskActions } from '../../store/task-slice';

const List = ({ milestones, projectId, deleteTaskHandler = () => { }, setTrigger = () => { } }) => {
    const dispatch = useDispatch();
    
  
    return (
        <div className="px-[30px] mt-[10px] pb-[50px] grid gap-[10px]">
            {milestones.map((item, i) => (
                <div key={i} className='mb-[20px] last:mb-0'>
                    <div className='flex items-center mb-[10px]'>
                        <MilestoneAction
                            icon={<h4 className="capitalize font-medium text-white text-[14px]">{item.title}</h4>}
                            data={item}
                            setTrigger={setTrigger}
                            style={{ backgroundColor: item.color }}
                            className="rounded-[5px] mr-[5px] px-[10px] py-[5px]"
                        />
                        <AddTask
                            icon={<IoMdAdd color="#000" size={16} />}
                            projectId={projectId}
                            activeMilestone={item}
                            color={item.color}
                            milestones={milestones}
                        />
                    </div>

                    {item.tasks.length > 0 ? (
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b h-[40px]'>
                                    <td className='text-[14px] font-semibold'>Name</td>
                                    <td className='text-[14px] font-semibold'>Assignee</td>
                                    <td className='text-[14px] font-semibold'>Due Date</td>
                                    <td className=''></td>
                                </tr>
                            </thead>
                            <tbody>
                                {item.tasks.map((task, i) => (
                                    <tr key={i} className="px-[10px] border-b last:border-b group">
                                        <td className='w-[30%]'>
                                            <button
                                                onClick={() => {
                                                    dispatch(taskActions.setModalOpen(true))
                                                    dispatch(taskActions.setSelectedMilestone(item))
                                                    dispatch(taskActions.setSelectedTaskData(task))
                                                    dispatch(taskActions.setTaskAssignees(task.assignees))
                                                }}
                                                className='border-none bg-white'
                                            >
                                                <div className='flex gap-[10px] cursor-pointer'>
                                                    <div className='h-[13px] min-w-[13px] mt-[1px] rounded-full flex justify-center items-center border' style={{ borderColor: item.color }}>
                                                        <div className='h-[9px] w-[9px] rounded-full' style={{ backgroundColor: item.color }} />
                                                    </div>
                                                    <h6 className="text-[12px]">{task.title}</h6>
                                                </div>
                                            </button>

                                        </td>
                                        <td className='w-[30%] p-[10px]'>
                                            {task.assignees.length > 0 ? (
                                                <div className="relative flex items-center w-full" >
                                                    {task.assignees.map((item, i) => (
                                                        <Avatar
                                                            key={i}
                                                            src={item?.avatar}
                                                            alt={item?.fullName}
                                                            className={`ml-[-5px] first:ml-0 bg-white`}
                                                            noOnline
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className='ml-[10px]'> --- </p>
                                            )}
                                        </td>
                                        <td className='w-[30%] p-[10px]'>
                                            <div className='text-[14px]'>{formatDate(task.dueDate)}</div>
                                        </td>
                                        <td className='w-[10%] hidden group-hover:block p-[10px]'>
                                            <IconButton
                                                icon={<MdDelete size={20} className='text-[#000]' />}
                                                onClick={() => deleteTaskHandler(task._id)}
                                                className='h-[40px] w-[40px] bg-transparent'
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='text-[12px] text-left border-y p-[10px]'>No Tasks</div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default List;