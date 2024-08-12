import React, { useState, useEffect } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { PostRequest, GetRequest } from "../utils/request";
import Loader from "../components/custom/loader";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../components/custom/avatar";
import ReactModal from ".";
import Button from "../components/custom/button";
import TextInput from "../components/custom/textInput";
import Label from "../components/custom/label";
import RichText from "../components/custom/richText";
import { chatActions } from '../store/chat-slice';
import { employeeActions } from '../store/employee-slice';
import socket from "../socket";
import TaskSocket from '../socket/task-socket';

const AddTask = ({ icon, item, projectId, milestones, setTrigger = () => { }, className = "" }) => {
    const dispatch = useDispatch()
    const { accountInfo } = useSelector((state) => state.account);
    const { assigneeList } = useSelector((state) => state.chat);
    const { employees } = useSelector((state) => state.employee);

    TaskSocket.useTaskRoomSetup(projectId, accountInfo?.data?._id)

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState("");
    const [formInput, setFormInput] = useState({
        title: "",
        description: "",
        dueDate: ""
    })
    const [milestone, setMilestone] = useState(null);
    const [assignees, setAssignees] = useState([]);
    const [show, setShow] = useState({
        milestone: false,
        assignees: false
    });

    const nameHandler = (e) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setFormInput(prevState => ({ ...prevState, title: cleanedValue }));
        setError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setError("")
        setFormInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (accountInfo) {
            GetRequest(`${process.env.REACT_APP_URL}/task/getAssignee/${accountInfo.data._id}`).then(response => {
                dispatch(chatActions.setAssigneeList(response.data));
            }).catch(error => {
                console.log("conversation error >>>", error.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo])

    useEffect(() => {
        if (accountInfo) {
            GetRequest(`${process.env.REACT_APP_URL}/user/employees/${accountInfo.data._id}`).then(response => {
                dispatch(employeeActions.setEmployees(response.data))
            }).catch((error) => {
                console.log("admin error >", error);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo]);

    const taskSubmitHandler = (e) => {
        setDisabled(true)
        setError("")
        if (!formInput.title) {
            setError("Title must not be empty!")
            setDisabled(false)
        } else {
            PostRequest(`${process.env.REACT_APP_URL}/task`, {
                ...formInput,
                projectId,
                milestoneId: milestone,
                assignees: assignees.map((assignee) => assignee._id),
                assignedAt: new Date().toISOString(),
                createdBy: accountInfo?.data._id,
            }).then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach((id) => {
                        socket.emit('taskadded', id, projectId) 
                    });
                }
                setDisabled(false)
                setTrigger(prev => prev + 1)
                closeHandler();
            }).catch((error) => {
                setDisabled(false)
                console.log(error.data)
                setError(error.data)
            })
        }
    }

    function closeHandler() {
        setOpen(false);
        setFormInput({ title: "", description: "", dueDate: "" });
        setAssignees([])
        setError("");
        setDisabled(false);
    }

    return (
        <>
            <button
                onClick={() => { setOpen(true); setMilestone(item) }}
                className={`bg-white rounded-full ${className}`}
            >
                {icon}
            </button>
            <ReactModal open={open} close={closeHandler} maxWidth="700px" padding="20px" heading="Add Task" >
                {disabled && <Loader />}
                <span className='text-[14px] text-[#ff0000]'>{error}</span>

                <div className="w-full">
                    <Label title="Title" className="mb-[5px]" />
                    <TextInput
                        name="title"
                        value={formInput.title}
                        onChange={nameHandler}
                        maxLength={40}
                    />
                    <div className="grid md:grid-cols-3 md:gap-[20px] max-md:gap-[15px] mt-[15px]">
                        <div className="relative">
                            <Label title="Status" className="mb-[5px]" />
                            <div className="text-white px-[10px] text-[14px] py-[10px] cursor-pointer capitalize select-none"
                                style={{ backgroundColor: milestone?.color }}
                                onClick={() => setShow(prevState => ({ ...prevState, milestone: !show.milestone }))}
                            >{milestone?.title}</div>
                            <div onMouseLeave={() => setShow(prevState => ({ ...prevState, milestone: false }))} className={`mt-[5px] absolute top-[55px] w-full bg-white p-[10px] shadow-md z-10 ${show.milestone ? "grid" : "hidden"}`}>
                                {milestones?.length > 0 && milestones.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-[10px] cursor-pointer py-[3px]"
                                        onClick={() => {
                                            setMilestone(item);
                                            setShow(prevState => ({ ...prevState, milestone: false }));
                                        }}
                                    >
                                        <div className='h-[13px] min-w-[13px] rounded-full border flex justify-center items-center mt-[5px]' style={{ borderColor: item.color }}>
                                            <div className='h-[9px] min-w-[9px] rounded-full' style={{ backgroundColor: item.color }} />
                                        </div>
                                        <span className="text-[14px] capitalize select-none">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <Label title="Assignees" className="mb-[5px]" />
                            <div className="flex flex-wrap items-center" >
                                {assignees.map((item, i) => (
                                    <Avatar
                                        key={i}
                                        src={item?.avatar}
                                        alt={item?.fullName}
                                        noOnline
                                        className={`border mb-[5px] ml-[-5px] first:ml-0 bg-white`}
                                    />
                                ))}
                                <button onClick={() => setShow(prevState => ({ ...prevState, assignees: true }))} className="mt-[10px]">
                                    <IoAdd size={20} />
                                </button>
                            </div>
                            <div onMouseLeave={() => setShow(prevState => ({ ...prevState, assignees: false }))} className={`absolute top-[60px] bg-white p-[10px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] z-[1] overflow-hidden overflow-y-auto max-h-[180px] ${show.assignees ? "grid" : "hidden"}`}>
                                <button className="absolute top-[5px] right-[5px]" onClick={() => setShow(prevState => ({ ...prevState, assignees: false }))}>
                                    <IoClose size={20} />
                                </button>
                                {accountInfo.data.role.title === 'Admin' ?
                                    (employees?.length > 0 && employees.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-[10px] cursor-pointer p-[5px] items-center"
                                            onClick={() => {
                                                if (!assignees.some(assignee => assignee._id === item?._id)) {
                                                    const updatedItems = [...assignees, item];
                                                    setAssignees(updatedItems)
                                                } else {
                                                    const filtered = assignees.filter(index => {
                                                        return index._id !== item._id
                                                    })
                                                    setAssignees(filtered)
                                                }
                                            }}
                                        >
                                            <Avatar
                                                src={item?.avatar}
                                                alt={item?.fullName}
                                                noOnline
                                                className={`${assignees.some(assignee => assignee._id === item?._id) && "!border-[2px] border-black"}`}
                                            />
                                            <span className="text-[14px] capitalize select-none">{item?.fullName}</span>
                                        </div>
                                    ))
                                    )
                                    :
                                    (
                                        assigneeList?.length > 0 && assigneeList.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-[10px] cursor-pointer p-[5px] items-center"
                                                onClick={() => {
                                                    if (!assignees.some(assignee => assignee._id === item.participants[0]._id)) {
                                                        const updatedItems = [...assignees, item.participants[0]];
                                                        setAssignees(updatedItems)
                                                    } else {
                                                        const filtered = assignees.filter(index => {
                                                            return index._id !== item.participants[0]._id
                                                        })
                                                        setAssignees(filtered)
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    src={item?.participants[0]?.avatar}
                                                    alt={item?.participants[0]?.fullName}
                                                    noOnline
                                                    className={`${assignees.includes(item?.participants[0]) && "!border-[2px] border-black"}`}
                                                />
                                                <span className="text-[14px] capitalize select-none">{item?.participants[0]?.fullName}</span>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            <Label title="Due Date" className="mb-[5px]" />
                            <TextInput
                                name="dueDate"
                                type="datetime-local"
                                value={formInput.dueDate}
                                className="w-full border select-none px-[10px] py-[10px] text-[12px]"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-[15px]">
                        <Label title="Description" className="mb-[5px]" htmlFor="description" />
                        <RichText
                            value={formInput.description}
                            onChange={(input) => setFormInput(prevState => ({ ...prevState, description: input }))}
                            placeholder="Write description here..."
                        />
                    </div>
                    <div className="flex gap-[10px] justify-center text-center mt-[30px]">
                        <Button
                            label="Cancel"
                            secondary
                            onClick={closeHandler}
                        />
                        <Button
                            label="Submit"
                            onClick={taskSubmitHandler}
                        />
                    </div>
                </div>
            </ReactModal>
        </>
    );
};

export default AddTask;