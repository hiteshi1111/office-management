import React, { useEffect, useRef, useState } from 'react';
import { IoAdd, IoClose } from 'react-icons/io5';
import { formatDateForInput } from '../utils/formatDate';
import { FaGithub } from "react-icons/fa";
import { VscPreview } from "react-icons/vsc";
import { CiEdit } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { IoRadioButtonOnSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { LuTimer, LuUsers2 } from "react-icons/lu";
import { DeleteRequest, PutRequest } from '../utils/request';
import ReactModal from '.';
import Timer from '../components/task/timer';
import Avatar from '../components/custom/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AiTwotoneDelete } from "react-icons/ai";
import IconButton from '../components/custom/iconButton';
import RichText from '../components/custom/richText';
import { taskActions } from '../store/task-slice';
import TaskSocket from "../socket/task-socket";
import Activities from '../components/task/activities';

const TaskView = ({ setTrigger = () => { }, projectId }) => {
    const previewRef = useRef();
    const pullRequestRef = useRef();
    const dispatch = useDispatch()
    const { chatList } = useSelector((state) => state.chat);
    const { accountInfo } = useSelector((state) => state.account);
    const { modalOpen, milestones, selectedTaskData, selectedMilestone, taskAssignees } = useSelector((state) => state.task);
    const { employees } = useSelector((state) => state.employee);

    const [assignees, setAssignees] = useState(taskAssignees);
    const [show, setShow] = useState({
        milestone: false,
        assignees: false
    });
    const [milestone, setMilestone] = useState(selectedMilestone);
    const [formInput, setFormInput] = useState({
        title: selectedTaskData?.title || "",
        description: selectedTaskData?.description || "",
        dueDate: selectedTaskData?.dueDate || null,
        pullRequest: selectedTaskData?.pullRequest || "",
        previewLink: selectedTaskData?.previewLink || ""
    })
    
    useEffect(() => {
        setFormInput({
            title: selectedTaskData?.title || "",
            description: selectedTaskData?.description || "",
            dueDate: selectedTaskData?.dueDate || null,
            pullRequest: selectedTaskData?.pullRequest || "",
            previewLink: selectedTaskData?.previewLink || ""
        })
    }, [selectedTaskData]);

    useEffect(() => {
        setAssignees(taskAssignees)
    }, [taskAssignees]);

    useEffect(() => {
        setMilestone(selectedMilestone)
        setActivityTrigger(prev => prev + 1);
    }, [selectedMilestone]);

    const [edit, setEdit] = useState({
        pullRequest: false,
        previewLink: false
    })
    const [trigger, setActivityTrigger] = useState(0);

    // UPDATES MILESTONE/STATUS OF THE TASK
    function updateMilestoneHandler(milestoneId) {
        PutRequest(`${process.env.REACT_APP_URL}/task/${selectedTaskData._id}`, {
            milestoneId: milestoneId,
            updatedBy: accountInfo?.data._id
        }).then(response => {
            TaskSocket.emitTaskUpdate(projectId, response.data, "milestone updated")
            setActivityTrigger(prev => prev + 1);
        }).catch(error => {
            console.log("error updating milestone", error.data)
        })
    }

    // UPDATES ASSIGNEES OF THE TASK
    function updateAssigneeHandler(assigneeId) {
        PutRequest(`${process.env.REACT_APP_URL}/task/assignee/${selectedTaskData._id}`, {
            assignee: assigneeId
        }).then(response => {
            TaskSocket.emitTaskUpdate(projectId, response.data,assignees, "assignee updated")
            setTrigger(prev => prev + 1);
        }).catch(error => {
            console.log("error updating milestone", error)
        })
    }

    const formattedDate = formatDateForInput(formInput?.dueDate);

    // UPDATES DESCRIPTION OF THE TASK
    function updateHandler() {
        let body = formInput;
        if (formInput.dueDate) {
            body.dueDate = new Date(formInput.dueDate)
        }
        PutRequest(`${process.env.REACT_APP_URL}/task/${selectedTaskData._id}`, body).then(response => {
            console.log("updated")
            TaskSocket.emitTaskUpdate(projectId, response.data, "task updated")
        }).catch(error => {
            console.log("error updating due date", error)
        })
    }

    function closeHandler() {
        if (formInput.title?.trim().length === 0 && selectedTaskData?.title.length > 0){
            setFormInput(prevState => ({...prevState, title: selectedTaskData?.title}))
        }else if (
            formInput.title !== selectedTaskData?.title || 
            formInput.description !== selectedTaskData?.description || 
            formInput.previewLink !== selectedTaskData?.previewLink || 
            formInput.pullRequest !== selectedTaskData?.pullRequest || 
            formInput.dueDate !== selectedTaskData?.dueDate) {
            updateHandler();
        }
        dispatch(taskActions.setModalOpen(false));
        dispatch(taskActions.setSelectedMilestone(""));
        dispatch(taskActions.setSelectedTaskData(""));
        dispatch(taskActions.setTaskAssignees([]));
    }

    function deleteTaskHandler() {
        DeleteRequest(`${process.env.REACT_APP_URL}/task/${selectedTaskData._id}`).then(response => {
            dispatch(taskActions.setModalOpen(false));
            dispatch(taskActions.setSelectedMilestone(""));
            dispatch(taskActions.setSelectedTaskData(""));
            dispatch(taskActions.setTaskAssignees([]));
            setTrigger(prev => prev + 1);
            TaskSocket.emitTaskUpdate(projectId, selectedTaskData._id, taskAssignees, "task deleted")
        }).catch(error => {
            console.log("delete task error >>>", error.data);
        });
    }

    useEffect(() => {
        if (edit.previewLink && previewRef.current) {
            previewRef.current.focus();
        }
        if (edit.pullRequest && pullRequestRef.current) {
            pullRequestRef.current.focus();
        }
    }, [edit]);

    return (
        <>
            <ReactModal open={modalOpen} close={closeHandler} maxWidth='1600px' padding='20px' >
                <div className='flex max-lg:flex-col gap-[10px] h-[85vh] p-[10px]'>
                    <div className='lg:w-[70%] md:pr-[40px]'>

                        {/* TITLE OF THE TASK */}
                        <div className='border-b pb-[10px]'>
                            <input
                                maxLength={50}
                                minLength={5}
                                value={formInput.title}
                                onChange={(e) => {
                                    setFormInput(prevState => ({ ...prevState, title: e.target.value }))
                                }}
                                className='capitalize border-none select-none focus:outline-none font-semibold h-[35px] px-[10px] w-full'
                            />
                        </div>
                        <div className='grid md:grid-cols-2 md:mt-[30px] max-md:mt-[20px] gap-x-[70px] gap-y-[20px]'>

                            {/* STATUS OF THE TASK */}
                            <div className='relative flex w-full md:max-w-[300px] justify-between relative items-center'>
                                <span className='text-[14px] flex items-center w-full'><IoRadioButtonOnSharp size={15} className='mr-[5px]' /> Status</span>
                                <div className='relative w-full'>
                                    <div
                                        className="px-[10px] text-[12px] py-[5px] cursor-pointer select-none w-full text-white uppercase rounded-[5px] inline-flex"
                                        style={{ backgroundColor: milestone?.color }}
                                        onClick={() => setShow(prevState => ({ ...prevState, milestone: !show.milestone }))}
                                    >{milestone?.title}
                                    </div>
                                    <div className={`absolute top-[31px] left-0 min-w-[190px] w-full bg-[#f5f5f5] p-[10px] rounded-[10px] shadow-md z-[10] ${show.milestone ? "grid" : "hidden"}`} onMouseLeave={() => setShow(prevState => ({ ...prevState, milestone: false }))}>
                                        {milestones?.length > 0 && milestones.map((item, i) => (
                                            <button
                                                key={i}
                                                className="flex gap-[10px] cursor-pointer py-[3px] items-center border-b last:border-b-0"
                                                onClick={() => {
                                                    setMilestone(item);
                                                    updateMilestoneHandler(item?._id)
                                                    setShow(prevState => ({ ...prevState, milestone: false }));
                                                }}
                                            >
                                                <div className='h-[13px] w-[13px] rounded-full border flex justify-center items-center' style={{ borderColor: item.color }}>
                                                    <div className='h-[9px] w-[9px] rounded-full' style={{ backgroundColor: item.color }} />
                                                </div>
                                                <span className="text-[12px] uppercase select-none text-left">{item?.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ASSIGNEES OF THE TASK */}
                            <div className='flex w-full md:max-w-[300px] justify-between gap-[15px]'>
                                <span className='text-[14px] flex items-center w-full'><LuUsers2 size={15} className='mr-[5px]' /> Assignees</span>
                                <div className="relative flex items-center w-full" >
                                    {assignees.length > 0 && assignees.map((item, i) => (
                                        item && (
                                            <Avatar
                                                key={i}
                                                src={item?.avatar}
                                                alt={item?.fullName}
                                                className={`ml-[-5px] first:ml-0 bg-white`}
                                                noOnline
                                            />
                                        )
                                    ))}
                                    <button onClick={() => setShow(prevState => ({ ...prevState, assignees: true }))}>
                                        <IoAdd size={20} />
                                    </button>
                                    {/* {assignees.length > 0 && */}
                                    <div className={`absolute top-[35px] left-0 min-w-[190px] w-full bg-white py-[10px] px-[5px] rounded-[10px] shadow-lg z-[10] overflow-hidden overflow-y-auto max-h-[180px] ${show.assignees ? "grid" : "hidden"}`} onMouseLeave={() => setShow(prevState => ({ ...prevState, assignees: false }))}>
                                        <button className="absolute top-[5px] right-[5px]" onClick={() => setShow(prevState => ({ ...prevState, assignees: false }))}>
                                            <IoClose size={20} />
                                        </button>
                                        {accountInfo.data.role.title === 'Admin' ? (
                                            employees?.length > 0 && employees.map((item, i) => (
                                                <button
                                                    key={i}
                                                    className="flex gap-[10px] cursor-pointer py-[5px] px-[10px] items-center hover:bg-[#f5f5f5]"
                                                    onClick={() => {
                                                        updateAssigneeHandler(item?._id)
                                                        if (!assignees.some(assignee => assignee._id === item._id)) {
                                                            const updatedItems = [...assignees, item];
                                                            setAssignees(updatedItems);
                                                        } else {
                                                            const filtered = assignees.filter(index => {
                                                                return index._id !== item?._id;
                                                            })
                                                            setAssignees(filtered);
                                                        }
                                                    }}
                                                >
                                                    <Avatar
                                                        src={item?.avatar}
                                                        alt={item?.fullName}
                                                        noOnline
                                                        className={`${assignees.some(assignee => assignee._id === item._id) && "!border-[2px] border-black"}`}
                                                    />
                                                    <span className="text-[14px] capitalize select-none">{item?.fullName}</span>
                                                </button>
                                            ))
                                        ) : (
                                            chatList?.length > 0 && chatList.map((item, i) => (

                                                <button
                                                    key={i}
                                                    className="flex gap-[10px] cursor-pointer py-[5px] px-[10px] items-center hover:bg-[#f5f5f5]"
                                                    onClick={() => {
                                                        updateAssigneeHandler(item.participants[0]._id)
                                                        if (!assignees.some(assignee => assignee._id === item.participants[0]._id)) {
                                                            const updatedItems = [...assignees, item.participants[0]];
                                                            setAssignees(updatedItems);
                                                        } else {
                                                            const filtered = assignees.filter(index => {
                                                                return index._id !== item.participants[0]._id;
                                                            })
                                                            setAssignees(filtered);
                                                        }
                                                    }}
                                                >
                                                    <Avatar
                                                        src={item?.participants[0]?.avatar}
                                                        alt={item?.participants[0]?.fullName}
                                                        noOnline
                                                        className={`${assignees.some(assignee => assignee._id === item.participants[0]._id) && "!border-[2px] border-black"}`}
                                                    />
                                                    <span className="text-[14px] capitalize select-none">{item?.participants[0]?.fullName}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {/* } */}
                                </div>
                            </div>

                            {/* DUE DATE OF THE TASK */}
                            <div className='flex w-full md:max-w-[300px] justify-between'>
                                <span className='text-[14px] flex items-center w-full'><SlCalender size={13} className='mr-[5px]' /> Due Date</span>
                                <input
                                    type='datetime-local'
                                    value={formattedDate}
                                    className='text-[14px] w-full'
                                    onChange={(e) => {
                                        setFormInput(prevState => ({ ...prevState, dueDate: e.target.value }))
                                    }}
                                />
                            </div>

                            {/* TASK TIME TRACKER */}
                            <div className='flex w-full md:max-w-[300px] justify-between'>
                                <span className='text-[14px] flex items-center'><LuTimer size={15} className='mr-[5px]' /> Track Time</span>
                                <span className='text-[14px]'>
                                    <Timer />
                                </span>
                            </div>
                        </div>

                        {/* DESCRIPTION OF THE TASK */}
                        <div className='w-full mt-[20px]'>
                            <RichText
                                value={formInput.description}
                                placeholder="Write description here..."
                                onChange={(input) => {
                                    setFormInput(prevState => ({ ...prevState, description: input }));
                                }}
                                className='long-richtext'
                            />
                        </div>

                        {/* OTHER DATA ABOUT THE TASK */}
                        <div className='mt-[20px]'>
                            <h6 className='text-[14px]'>Custom Fields</h6>
                            <div className='rounded-[15px] pt-[15px] pb-[20px]' onMouseLeave={() => setEdit({ pullRequest: false, previewLink: false })}>
                                <table className='w-full !rounded-[15px]'>
                                    <tbody className='w-full !rounded-[15px]'>
                                        <tr className='border'>
                                            <td className='p-[10px] w-[20%] border-r !bg-[#fff]'>
                                                <div className='flex gap-[10px]'>
                                                    <FaGithub size={15} />
                                                    <span className='text-[12px]'>Pull Request</span>
                                                </div>
                                            </td>
                                            <td className='p-[10px] text-[14px] flex justify-between items-start gap-[15px] !bg-[#fff]'>
                                                {edit.pullRequest ? (
                                                    <input
                                                        ref={pullRequestRef}
                                                        value={formInput.pullRequest}
                                                        className='w-full text-[12px] px-[5px] focus:outline-none'
                                                        onChange={(e) => {
                                                            setFormInput(prevState => ({ ...prevState, pullRequest: e.target.value }))
                                                        }}
                                                    />
                                                ) : (
                                                    <Link
                                                        to={formInput.pullRequest}
                                                        className='text-[12px] text-[#00f] hover:underline break-all'
                                                    >{formInput.pullRequest}</Link>
                                                )}
                                                <button onClick={() => setEdit(prevState => ({ ...prevState, pullRequest: !edit.pullRequest }))}>
                                                    <CiEdit />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className='border'>
                                            <td className='p-[10px] w-[20%] border-r !bg-[#fff]'>
                                                <div className='flex gap-[10px]'>
                                                    <VscPreview size={15} />
                                                    <span className='text-[12px]'>Preview Link</span>
                                                </div>
                                            </td>
                                            <td className='p-[10px] text-[14px] flex justify-between items-start gap-[15px] !bg-[#fff]'>
                                                {edit.previewLink ? (
                                                    <input
                                                        ref={previewRef}
                                                        value={formInput.previewLink}
                                                        className='w-full text-[12px] px-[5px] focus:outline-none'
                                                        onChange={(e) => {
                                                            setFormInput(prevState => ({ ...prevState, previewLink: e.target.value }))
                                                        }}
                                                    />
                                                ) : (
                                                    <Link
                                                        to={formInput.previewLink}
                                                        className='text-[12px] text-[#00f] hover:underline'
                                                    >{formInput.previewLink}</Link>
                                                )}
                                                <button onClick={() => setEdit(prevState => ({ ...prevState, previewLink: !edit.previewLink }))}>
                                                    <CiEdit />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITIES ON THE TASK */}
                    <Activities taskData={selectedTaskData} trigger={trigger} setTrigger={setActivityTrigger} projectId={projectId}/>
                </div>
                <div className='absolute left-[30px] bottom-[30px]'>
                    <IconButton
                        title='Delete'
                        icon={<AiTwotoneDelete size={20} color='#000' />}
                        className='h-[40px] w-[40px] bg-white'
                        onClick={deleteTaskHandler}
                    />
                </div>
            </ReactModal>
        </>
    )
}

export default TaskView;