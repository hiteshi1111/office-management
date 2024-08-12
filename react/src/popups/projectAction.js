import React, { useState } from 'react';
import { DeleteRequest, PutRequest } from '../utils/request';
import { useSelector } from 'react-redux';
import DeleteConfirmation from './deleteConfirmation';
import ReactModal from '.';
import Loader from '../components/custom/loader';
import Button from '../components/custom/button';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import Error from '../components/custom/error';
import TaskSocket from '../socket/task-socket';

const ProjectAction = ({icon, data="", userId="", className="", trigger=()=>{}}) => {
    const { assignees } = useSelector((state) => state.task);

    const [ open, setOpen ] = useState(false);
    const [ title, setTitle ] = useState(data?.title);
    const [ error, setError ] = useState("");
    const [ disabled, setDisabled ] = useState(false);

    const nameHandler = (e) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setTitle(cleanedValue)
        setError("");
    };

    function closeHandler(){
        setOpen(false);
        setError("");
        setDisabled(false);
        setTitle(data?.title)
    }
    function deleteHandler(){
        setDisabled(true);
        DeleteRequest(`${process.env.REACT_APP_URL}/project/${data?._id}`).then(response => {
            trigger();
            closeHandler();
            TaskSocket.emitProjectUpdate(userId, assignees)
        }).catch(err => {
            console.log(err);
            setDisabled(false);
        })
    }
    function updateHandler(){
        setError("");
        setDisabled(true);
        if(!title){
            setError("Field must not be empty!");
            setDisabled(false);
        }
        else{
        PutRequest(`${process.env.REACT_APP_URL}/project/${data._id}`, { title: title }).then(response => {
            trigger();
            closeHandler();
        }).catch(err => {
            console.log(err);
            setDisabled(false);
        })
    }
}
    return (
        <>
            <button onClick={() => setOpen(true)} className={className}>{icon}</button>
            <ReactModal open={open} close={closeHandler} maxWidth="500px">
                <div className='w-full'>
                    {disabled && <Loader />}
                    <h5 className='mb-[20px]'>Edit Project</h5>
                    <span className='text-[14px] text-[#ff0000]'> <Error message={error} /></span>
                    <div className="w-full">
                        <Label title='Title' />
                        <TextInput
                            value={title}
                            name="title"
                            onChange={nameHandler}
                            maxLength={30}
                        />
                    </div>
                    <div className='flex justify-center gap-[10px] mt-[40px]'>
                        <DeleteConfirmation
                            onClick={deleteHandler}
                            className='max-w-[120px]'
                            close={() => setOpen(false)}
                        />
                        <Button
                            label='Update'
                            onClick={updateHandler}
                            secondary
                        />
                    </div>
                </div>
            </ReactModal>
        </>
    )
}

export default ProjectAction;