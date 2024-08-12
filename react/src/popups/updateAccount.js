import React, { useState } from 'react';
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import { FiEdit2 } from 'react-icons/fi';
import Gender from '../components/shared/gender';
import { PutRequest } from '../utils/request';
import { validatePhone } from '../utils/formValidation';
import Error from '../components/custom/error';
import { formatBirthday } from '../utils/formatDate';
import { useDispatch } from 'react-redux';
import { accountActions } from '../store/account-slice';
import Loader from '../components/custom/loader';

const UpdateAccount = ({data}) => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const role = data?.role.title.toLowerCase();
    const [error, setError] = useState("")
    const initialState = ({
        fullName: data?.fullName || "",
        email: data?.email || "",
        birthday: data?.birthday ? formatBirthday(data.birthday) : "",
        mobile: data?.mobile || "",
        companyTitle: data?.companyTitle || "",
        companyEmail: data?.companyEmail || "",
        companyAddress: data?.companyAddress || "",
        companyMobile: data?.companyMobile || "",
        gender: data?.gender || "prefer not to say"
    })
    const [updatedAccount, setUpdatedAccount] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAccount((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // PHONE INPUT HANDLER
    const phoneHandler = (e) => {
        const {name, value} = e.target
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length <= 10) {
            setUpdatedAccount((prevState) => ({ ...prevState, [name]: numericValue }));
            setError("");
        }
    };

    //FULL NAME INPUT HANDLER
    const nameHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setUpdatedAccount((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    // EMAIL INPUT HANDLER
    const emailHandler = (e) => {
        const { name, value } = e.target
        const cleanedValue = value.replace(" ", "").toLowerCase()
        setUpdatedAccount((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }))
        setError("")
    }

    const handleUpdateUser = () => {
        setDisabled(true)
        if(!updatedAccount.fullName){
            setError("Field must not be empty!")
            setDisabled(false)
        }else if(updatedAccount.mobile && !validatePhone(updatedAccount.mobile)){
            setError("Phone is not valid!")
            setDisabled(false)
        }else if(updatedAccount.companyMobile && !validatePhone(updatedAccount.companyMobile)){
            setError("Phone is not valid!")
            setDisabled(false)
        }else {
            PutRequest(`${process.env.REACT_APP_URL}/user/${data?._id}`, updatedAccount).then((response) => {
                const updateAccountInfo = { ...data, ...updatedAccount }
                dispatch(accountActions.setAccountInfo({data: updateAccountInfo}))
                setOpen(false)
                setDisabled(false)
            }).catch((error) => {
                console.log(error)
                setError("Unable to update account")
                setDisabled(false)
            })
        }
    }

    const handleClose = () => {
        setOpen(false)
        setUpdatedAccount(initialState)
        setError("")
    }

    return (
        <>
            <div className='absolute top-[20px] right-[20px]'>
                <button onClick={() => setOpen(true)} title='Update Account' >
                    <FiEdit2 size={15} color='#000000' />
                </button>
            </div>
            <ReactModal open={open} close={handleClose} maxWidth="800px" heading="Update Account" padding='20px' >
                {disabled && (
                    <Loader />
                )}
                {error && <Error message={error}/>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-[10px]">
                    <div>
                        <Label title='Full Name' isImportant/>
                        <TextInput 
                            name="fullName"
                            value={updatedAccount.fullName}
                            onChange={nameHandler}
                            className='mt-[5px]'
                            disabled={role !== "admin"}
                        />
                    </div>
                    <div>
                        <Label title='Email'/>
                        <TextInput 
                            name="email"
                            disabled
                            value={updatedAccount.email}
                            className='mt-[5px]'
                        />
                    </div>
                    {/* {role !== "admin" && ( */}
                        <div>
                            <Label title='Birthday'/>
                            <TextInput 
                                name="birthday"
                                type='date'
                                value={updatedAccount.birthday}
                                onChange={handleChange}
                                className='mt-[5px]'
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <Label title='Mobile'/>
                            <div className='relative'>
                                <span className='absolute top-[15px] left-[5px]'>+91</span>
                                <TextInput 
                                    name="mobile"
                                    value={updatedAccount.mobile}
                                    onChange={phoneHandler}
                                    className='mt-[5px] pl-[33px]'
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                    {role !== "admin" && (
                        <div>
                            <Label title='Gender'/>
                            <Gender value={updatedAccount.gender} onClick={handleChange} />
                        </div>
                    )}
                </div>
                {role === "admin" && (
                    <div className='mt-[20px]'>
                        <h4>Company Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-[10px] mt-[10px]">
                            <div>
                                <Label title='Company'/>
                                <TextInput 
                                    name="companyTitle"
                                    value={updatedAccount.companyTitle}
                                    onChange={handleChange}
                                    className='mt-[5px]'
                                    disabled={disabled}
                                />
                            </div>
                            <div>
                                <Label title='Address'/>
                                <TextInput 
                                    name="companyAddress"
                                    value={updatedAccount.companyAddress}
                                    onChange={handleChange}
                                    className='mt-[5px]'
                                    disabled={disabled}
                                />
                            </div>
                            <div>
                                <Label title='Email'/>
                                <TextInput 
                                    name="companyEmail"
                                    value={updatedAccount.companyEmail}
                                    onChange={emailHandler}
                                    className='mt-[5px]'
                                    disabled={disabled}
                                />
                            </div>
                            <div>
                                <Label title='Mobile'/>
                                <div className='relative w-full'>
                                    <span className='absolute top-[15px] left-[5px]'>+91</span>
                                    <TextInput 
                                        name="companyMobile"
                                        value={updatedAccount.companyMobile}
                                        onChange={phoneHandler}
                                        className='mt-[5px] pl-[33px]'
                                        disabled={disabled}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleUpdateUser}
                    className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full'
                >
                    Update
                </button>
            </ReactModal>
        </>
    );
}

export default UpdateAccount;
