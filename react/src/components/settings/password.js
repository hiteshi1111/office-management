import React, { useEffect, useState } from 'react'
import TextInput from '../custom/textInput';
import Label from '../custom/label';
import Button from '../custom/button';
import Error from '../custom/error';
import { checkEmptyFields, validatePassword } from '../../utils/formValidation';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { PutRequest } from '../../utils/request';

const Password = () => {
    const { accountInfo } = useSelector(state => state.account);
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formInput, setFormInput] = useState({
        oldPass: "",
        newPass: "",
        confirmNewPass: ""
    })
    const [show, setShow] = useState({
        oldPass: false,
        newPass: false,
        confirmNewPass: false
    });

    function resetHandler(){
        setError("")
        setFormInput({
            oldPass: "",
            newPass: "",
            confirmNewPass: "" 
        })
    }
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(" ", '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    function updateHandler(){
        setDisabled(true);
        setError("")
        if (checkEmptyFields(formInput)){
            setError("Fields must not be empty!")
            setDisabled(false);
        }else if (!validatePassword(formInput.newPass)){
            setError("New Password must contain atleast one uppercase, one lowercase, one number and one special character!")
            setDisabled(false);
        }else if (formInput.newPass !== formInput.confirmNewPass){
            setError("Confirm password should match new password!")
            setDisabled(false);
        }else{
            PutRequest(`${process.env.REACT_APP_URL}/user/pass/${accountInfo.data._id}`, {
                oldPassword: formInput.oldPass,
                newPassword: formInput.newPass
            }).then((response) => {
                setSuccess(true);
                resetHandler();
            }).catch((error) => {
                console.log(error.data);
                setError(error.data)
                setDisabled(false);
            });
        }
    }

    useEffect(() => {
        if (success){
            const timer = setTimeout(() => {
                setSuccess(false);
                setDisabled(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    },[success])

    return (
        <div className='max-w-[500px]'>
            <Error message={error} />
            <div className='relative'>
                <Label title='Old Password'/>
                <TextInput
                    name="oldPass"
                    type={show.oldPass ? "text" : "password"}
                    placeholder='********'
                    disabled={disabled}
                    value={formInput.oldPass}
                    onChange={onChangeHandler}
                />
                {show.oldPass ? (
                    <button onClick={() => setShow((prevState) => ({...prevState, oldPass: false}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEyeSlash size={15} title="Hide Password" />
                    </button>
                ) : (
                    <button onClick={() => setShow((prevState) => ({...prevState, oldPass: true}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEye size={15} title="Show Password" />
                    </button>
                )}
            </div>
            <div className='relative'>
                <Label title='New Password'/>
                <TextInput
                    name="newPass"
                    type={show.newPass ? "text" : "password"}
                    placeholder='********'
                    disabled={disabled}
                    value={formInput.newPass}
                    onChange={onChangeHandler}
                />
                {show.newPass ? (
                    <button onClick={() => setShow((prevState) => ({...prevState, newPass: false}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEyeSlash size={15} title="Hide Password" />
                    </button>
                ) : (
                    <button onClick={() => setShow((prevState) => ({...prevState, newPass: true}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEye size={15} title="Show Password" />
                    </button>
                )}
            </div>
            <div className='relative'>
                <Label title='Confirm New Password'/>
                <TextInput
                    name="confirmNewPass"
                    type={show.confirmNewPass ? "text" : "password"}
                    placeholder='********'
                    value={formInput.confirmNewPass}
                    disabled={disabled}
                    onChange={onChangeHandler}
                />
                {show.confirmNewPass ? (
                    <button onClick={() => setShow((prevState) => ({...prevState, confirmNewPass: false}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEyeSlash size={15} title="Hide Password" />
                    </button>
                ) : (
                    <button onClick={() => setShow((prevState) => ({...prevState, confirmNewPass: true}))} className='absolute right-[10px] top-[68%] translate-y-[-50%]' >
                        <FaRegEye size={15} title="Show Password" />
                    </button>
                )}
            </div>
            <div className='mt-[20px] grid grid-cols-2 gap-[10px]'>
                <Button 
                    label='Reset'
                    secondary
                    className='bg-white border text-black hover:border-black'
                    onClick={resetHandler}
                />
                <Button 
                    label={success ? "Updated" : "Update"}
                    secondary
                    onClick={updateHandler}
                    className={success && "!bg-[#008000]"}
                />
            </div>
        </div>
    )
}

export default Password;