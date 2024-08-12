import React, { useState } from 'react'
import { PostRequest } from '../utils/request';
import ReactModal from '.';
import { useSelector } from 'react-redux';
import Loader from '../components/custom/loader';
import Button from '../components/custom/button';
import Error from '../components/custom/error';
import { IoAdd } from 'react-icons/io5';
import IconButton from '../components/custom/iconButton';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';

const AddProject = ({trigger=()=>{}}) => {
    const [ open, setOpen ] = useState(false);
    const [ title, setTitle ] = useState("");
    const [ error, setError ] = useState("");
    const [ disabled, setDisabled ] = useState(false);
    const { accountInfo } = useSelector((state) => state.account);

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
            PostRequest(`${process.env.REACT_APP_URL}/project/${accountInfo?.data.adminId || accountInfo?.data._id}`, {title: title}).then(response => {
                trigger();
                setDisabled(false);
                setOpen(false);
                setTitle("")
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
            <IconButton
                onClick={() => setOpen(true)}
                icon={<IoAdd size={15} color='#aaa' />}
                className='bg-transparent border-none h-[30px] w-[30px]'
            />
            <ReactModal open={open} close={closeHandler} maxWidth="600px" heading='Add Project' padding='20px'>
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
                <div className='text-center mt-[30px]'>
                    <Button
                        label='Add'
                        onClick={submitHandler}
                        secondary
                    />
                </div>
            </ReactModal>
        </>
    )
}

export default AddProject;