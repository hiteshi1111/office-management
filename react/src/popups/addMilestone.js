import React, { useState } from 'react'
import { PostRequest } from '../utils/request';
import colorCode from "../data/color.json";
import { VscMilestone } from 'react-icons/vsc';
import ReactModal from '.';
import { useSelector } from 'react-redux';
import Loader from '../components/custom/loader';
import Error from '../components/custom/error';
import Button from '../components/custom/button';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import socket from '../socket';

const AddMilestone = ({selectedProject, setTrigger=()=>{}}) => {
    const { accountInfo } = useSelector((state) => state.account);
    const { assignees } = useSelector((state) => state.task);
    const [ open, setOpen ] = useState(false);
    const [ title, setTitle ] = useState("");
    const [ color, setColor ] = useState(colorCode[0].code);
    const [ error, setError ] = useState("");
    const [ disabled, setDisabled ] = useState(false);

    const nameHandler = (e) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setTitle(cleanedValue)
        setError("");
    };

    function submitHandler(){
        setError("");
        setDisabled(true);
        if (!title){
            setError("Field must not be empty!");
            setDisabled(false);
        }else{
            PostRequest(`${process.env.REACT_APP_URL}/milestone/${accountInfo?.data.adminId || accountInfo?.data._id}`, {title: title, projectId: selectedProject, color: color}).then(response => {
                setTrigger(prev => prev+1)
                setDisabled(false);
                setOpen(false);
                setTitle("")
                // socket.emit('taskadded', id, projectId) 
                if (assignees && Array.isArray(assignees)) {
                    assignees.forEach((data) => {
                        socket.emit('taskadded', data?._id, selectedProject?._id) 
                    });
                }
            }).catch(err => {
                setError(err.data)
                setDisabled(false)
            })
        }
    }

    function closeHandler(){
        setOpen(false);
        setTitle("");
        setError("");
        setDisabled(false);
    }
    return (
        <>
            <button onClick={() => setOpen(true)} className="border border-black text-black py-[4px] px-[10px] rounded-full text-[12px] flex items-center px-[15px]">
                <VscMilestone color="#000" size={15} className='mr-[5px]' /> Milestone
            </button>
            <ReactModal open={open} close={closeHandler} maxWidth='600px' heading='Add Milestone' padding='20px' >
                {disabled && <Loader />}
                <Error message={error} />
                <div className="w-full">
                    <Label title='Title' />
                    <TextInput 
                        value={title}
                        name="title"
                        onChange={nameHandler}
                        maxLength={30}
                    />
                </div>
                <div className='mt-[15px]'>
                    <label className="block text-[14px] mb-[5px]">Color</label>
                    <div className='flex flex-wrap grow shrink gap-[10px]'>
                        {colorCode.map((item, i) => (
                            <button 
                                key={i} 
                                className={`${color === item.code && "border-[2px] border-black"} md:w-[40px] md:h-[40px] max-md:w-[32px] max-md:h-[32px] rounded-full`} 
                                style={{ backgroundColor: item.code}}
                                onClick={() => setColor(item.code)}
                            />
                        ))}
                    </div>
                </div>
                <div className='text-center mt-[40px]'>
                    <Button
                        label='Add'
                        onClick={submitHandler}
                    />
                </div>
            </ReactModal>
        </>
    )
}

export default AddMilestone;