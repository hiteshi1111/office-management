import React, { useState } from 'react';
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import { checkEmptyFields } from '../utils/formValidation';
import Error from '../components/custom/error';
import { MdOutlinePostAdd } from "react-icons/md";
import { PostRequest } from '../utils/request';
import Button from '../components/custom/button';
import { useDispatch, useSelector } from 'react-redux';
import { superadminActions } from '../store/superadmin-slice';

const AddPlan = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { triggerPlans } = useSelector((state) => state.superadmin);

    const [open, setOpen] = useState(false);
    const [error, setError] = useState("")
    const [formInput, setFormInput] = useState({
        title: "",
        employees: "",
        price: "",
        days: ""
    })

    // TITLE INPUT HANDLER
    const titleHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z0-9\s]/g, '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    // EMAIL INPUT HANDLER
    const employeeHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^0-9]/g, '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: Number(cleanedValue)
        }));
        setError("");
    };

    // PRICE INPUT HANDLER
    const priceHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^0-9]{4}/g, '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: Number(cleanedValue)
        }));
        setError("");
    };

    const handleAddPlan = () => {
        if (checkEmptyFields(formInput)) {
            setError("Fields must not be empty!");
        } else {
            const config = {
                headers: {
                    Authorization: `Bearer ${accountInfo?.token}`,
                    'Content-Type': 'application/json',
                },
            };
            PostRequest(`${process.env.REACT_APP_URL}/plan/${accountInfo?.data._id}`, formInput, config).then(response => {
                dispatch(superadminActions.setTriggerPlans(triggerPlans+1))
                setOpen(false);
                setFormInput({ title: "", employees: "", price: "", days: "" });
            }).catch(error => {
                console.log("Error adding plan:", error);
                // setError(error.data);
            });
        }
    };

    function closeHandler() {
        setOpen(false)
        setFormInput({
            title: "",
            employees: "",
            price: "",
        })
    }
    
    return (
        <>
            <button 
                title="Add Plan"
                onClick={() => setOpen(true)} 
                className='fixed bottom-[50px] right-[50px] flex justify-center items-center gap-[5px] font-medium text-[15px] text-[#fff] bg-[#594cda] hover:text-[#fff] hover:bg-[#eb427e] rounded-full h-[60px] w-[60px]'
            >
                <MdOutlinePostAdd size={30} />
            </button>

            <ReactModal open={open} close={closeHandler} maxWidth="600px" heading="Add Plan">
                {error && <Error message={error} />}
                <div>
                    <div>
                        <Label title='Title' isImportant />
                        <TextInput
                            name="title"
                            value={formInput.title}
                            onChange={titleHandler}
                            className='mt-[5px]'
                            maxLength={20}
                        />
                    </div>
                    <div className='mt-3'>
                        <Label title='No of Employees' isImportant />
                        <TextInput
                            name="employees"
                            value={formInput.employees}
                            onChange={employeeHandler}
                            className='mt-[5px]'
                            maxLength={5}
                        />
                    </div>
                    <div className='mt-3'>
                        <Label title='Time Period (in days)' isImportant />
                        <TextInput
                            name="days"
                            value={formInput.days}
                            onChange={priceHandler}
                            className='mt-[5px]'
                            maxLength={10}
                        />
                    </div>
                    <div className='mt-3'>
                        <Label title='Price Per Month' isImportant />
                        <div className='relative'>
                            <span className='absolute inset-y-[13px] left-[5px]'>₹</span>
                            <TextInput
                                name="price"
                                value={formInput.price}
                                onChange={priceHandler}
                                className='mt-[5px] pl-[20px]'
                                maxLength={6}
                            />
                        </div>
                    </div>
                    <div className='text-center mt-[30px]'>
                        <Button
                            label='Create'
                            onClick={handleAddPlan}
                            secondary
                        />
                    </div>
                </div>
            </ReactModal>
        </>
    )
}
export default AddPlan;