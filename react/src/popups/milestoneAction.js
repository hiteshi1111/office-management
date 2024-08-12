import React, { useState } from 'react'
import colorCode from "../data/color.json";
import { DeleteRequest, PutRequest } from '../utils/request';
import Loader from '../components/custom/loader';
import ReactModal from '.';
import Button from '../components/custom/button';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import DeleteConfirmation from './deleteConfirmation';

const MilestoneAction = ({icon, data, setTrigger=()=>{}, ...props}) => {
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState("");
    const [ disabled, setDisabled ] = useState(false);
    const [ updatedInput, setUpdatedInput ] = useState({
        title: data.title || "",
        color: data.color || ""
    })

    const nameHandler = (e) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setUpdatedInput(prevState => ({ ...prevState, title: cleanedValue }));
        setError("");
    };

    function updateHandler(){
        if (!updatedInput.title){
            setError("Fields must not be empty!")
        }else{
            PutRequest(`${process.env.REACT_APP_URL}/milestone/${data._id}`, updatedInput ).then(resp => {
                setTrigger(prev => prev+1)
                closeHandler();
            }).catch(err => {
                console.log(err);
                setDisabled(false);
            })
        }
    }
    function deleteHandler(){
        setDisabled(true);
        DeleteRequest(`${process.env.REACT_APP_URL}/milestone/${data._id}`).then(response => {
            console.log("deleted")
            setTrigger(prev => prev+1)
            closeHandler();
        }).catch(err => {
            console.log(err);
            setDisabled(false);
        })
    }
    function closeHandler(){
        setOpen(false);
        setError("");
        setDisabled(false);
        setUpdatedInput({
            title: data.title || "",
            color: data.color || ""
        })
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-[20px] pt-[3px]"
                title="Edit"
                {...props}
            >
                {icon}
            </button>
            <ReactModal open={open} close={closeHandler} maxWidth="600px">
                {disabled && <Loader />}
                <div className='flex md:items-center max-md:flex-col mb-[20px] gap-[15px]'>
                    <h5 className='capitalize'>Updating:</h5>
                    <div className='flex items-center gap-[5px]'>
                        <div className='flex justify-center items-center h-[17px] min-w-[17px] rounded-full border' style={{ borderColor: data.color}}>
                            <div className='flex justify-center items-center h-[8px] min-w-[8px] rounded-full' style={{ backgroundColor: data.color}} />
                        </div>
                        <h5 className='capitalize'>{data.title}</h5>
                    </div>
                </div>
                <span className='text-[14px] text-[#ff0000]'>{error}</span>
                <div className="w-full">
                    <Label title='Title' />
                    <TextInput
                        value={updatedInput.title}
                        name="title"
                        onChange={nameHandler}
                        maxLength={30}
                    />
                </div>
                <div className='mt-[15px]'>
                    <Label title='Color' />
                    <div className='flex flex-wrap grow shrink gap-[10px]'>
                        {colorCode.map((item, i) => (
                            <button 
                                key={i} 
                                className={`${updatedInput.color === item.code && "border-[2px] border-black"} md:w-[40px] md:h-[40px] max-md:w-[32px] max-md:h-[32px] rounded-full`} 
                                style={{ backgroundColor: item.code}}
                                onClick={() => setUpdatedInput(prevState => ({ ...prevState, color: item.code }))}
                            />
                        ))}
                    </div>
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
            </ReactModal >
        </>
    )
}

export default MilestoneAction;