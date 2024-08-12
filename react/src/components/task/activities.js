import React, { useEffect, useState } from 'react'
import { DeleteRequest, GetRequest, PostRequest } from '../../utils/request';
import { useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { formatActivityDate, formatDate } from '../../utils/formatDate';
import Avatar from '../custom/avatar';
import IconButton from '../custom/iconButton';
import TaskSocket from "../../socket/task-socket";
import RichText from '../custom/richText';

const Activities = ({ taskData, trigger = 0, setTrigger = () => { }, projectId}) => {
    const { accountInfo } = useSelector((state) => state.account);
    const { commentTrigger } = useSelector((state) => state.task);

    const [activity, setActivity] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        GetRequest(`${process.env.REACT_APP_URL}/activity/${taskData._id}`).then(response => {
            setActivity(response.data);
        }).catch(error => {
            console.log("getting activity error", error);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, commentTrigger])

    // ADDS COMMENT ON THE TASK
    function commentHandler() {
        PostRequest(`${process.env.REACT_APP_URL}/activity/${taskData._id}`, {
            comment: message,
            userId: accountInfo?.data._id
        }).then(response => {
            TaskSocket.emitTaskUpdate(projectId, response.data, "comment added")
            setMessage("")
            setTrigger(prev => prev + 1);
        }).catch(error => {
            console.log("error adding comment", error);
        });
    }

    // DELETE COMMENT ON THE TASK
    function deleteActivityHandler(id) {
        DeleteRequest(`${process.env.REACT_APP_URL}/activity/${id}`).then(response => {
            TaskSocket.emitTaskUpdate(projectId, taskData._id, "comment deleted")
            setTrigger(prev => prev + 1);
        }).catch(error => {
            console.log("delete activity error >>>", error.data);
        });
    }

    const removeEmptyTags = (input) => {
        const emptyTags = ['<p><br></p>', '<p><br/></p>', '<p><br /></p>'];
        let cleanedInput = input;
        emptyTags.forEach(tag => {
            cleanedInput = cleanedInput.replace(tag, '');
        });
        return cleanedInput;
    };

    return (
        <div className='relative lg:w-[30%] lg:border-l py-[20px] lg:px-[10px] relative'>
            <h5 className='lg:px-[5px]'>Activity</h5>
            <div className='mt-[20px] grid gap-[10px] h-full overflow-hidden overflow-y-auto lg:px-[10px]'>
                <div className='overflow-hidden overflow-y-auto pr-[10px] pb-[15px] h-[calc(100%_-_105px)] flex flex-col gap-[10px] scroll-it'>
                    <div className='text-[12px] flex justify-between items-start py-[10px] text-[#808080] px-[10px] gap-[10px]'>
                        <div className='max-w-[75%] flex'>
                            ~ <p className='text-[12px] activity-richtext ml-[5px]'> Task created</p>
                        </div>
                        <span className='text-[12px]'>{formatActivityDate(taskData?.createdAt)}</span>
                    </div>
                    {activity.length > 0 && activity.map((item, i) => (
                        item.isComment ? (
                            <div key={i} className='group border rounded-[5px] bg-[#fff]'>
                                <div className='flex items-center justify-between border-b p-[10px]'>
                                    <div className='flex items-center gap-[10px]'>
                                        <Avatar
                                            src={item?.userId?.avatar}
                                            alt="user"
                                            className='h-[25px] w-[25px] min-w-[25px]'
                                            noOnline
                                        />
                                        <h6 className='text-[14px]'>{item?.userId?.fullName}</h6>
                                    </div>
                                    <IconButton
                                        icon={<MdDelete size={15} />}
                                        className='bg-white border-none group-hover:flex hidden h-[20px] w-[20px]'
                                        onClick={() => deleteActivityHandler(item._id)}
                                    />
                                    <span className='text-[12px] group-hover:hidden block'>{formatDate(item.createdAt)}</span>
                                </div>
                                <div className='text-[14px] p-[10px] richtext whitespace-break-spaces break-words' dangerouslySetInnerHTML={{ __html: item.comment }} />
                            </div>
                        ) : (
                            <div key={i} className='text-[12px] flex justify-between items-start py-[10px] text-[#808080] px-[10px] gap-[10px]'>
                                <div className='max-w-[75%] flex'>
                                    ~ <p className='text-[12px] activity-richtext ml-[5px]' dangerouslySetInnerHTML={{ __html: item.comment }} />
                                </div>
                                <span className='text-[12px]'>{formatActivityDate(item.createdAt)}</span>
                            </div>
                        )
                    ))}
                </div>
                <div className='activity-chat-msg flex gap-[5px] absolute bottom-0 w-full left-0 lg:px-[15px]'>
                    <RichText
                        value={message}
                        onChange={(input) => setMessage(removeEmptyTags(input))}
                        placeholder="Write a comment"
                        className='w-full comment-richtext bg-white overflow-hidden'
                    />
                    <div className='flex items-end'>
                        <button onClick={commentHandler} className={`text-white px-[10px] py-[14.5px] text-[14px] rounded-[5px] ${message ? "pointer-events-auto bg-black" : "pointer-events-none bg-[#555555]"}`}>Comment</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Activities;