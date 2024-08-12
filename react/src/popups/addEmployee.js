import React, { useEffect, useState } from 'react';
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import Dropdown from '../components/custom/dropdown';
import Gender from '../components/shared/gender';
import { checkEmptyFields, validateEmail, validatePassword } from '../utils/formValidation';
import Error from '../components/custom/error';
import { GetRequest, PostRequest } from '../utils/request';
import { useSelector, useDispatch } from 'react-redux';
import { LiaCatSolid } from "react-icons/lia";
import ExpiredPlan from '../components/shared/expiredPlan';
import { formatDateForCompare } from '../utils/formatDate';
import { FaUsersSlash } from "react-icons/fa";
import { accountActions } from '../store/account-slice';

const AddEmployee = ({ label = "", className = "", departments = [], setTrigger=()=>{} }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const { accountInfo, currentPlan, planTrigger } = useSelector((state) => state.account);
    const [formInput, setFormInput] = useState({
        fullName: "",
        email: "",
        password: "",
        gender: "prefer not to say",
        department: "",
        role: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const nameHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z\s]/g, '');
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    const emailHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(" ", "").toLowerCase();
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    const passwordHandler = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(" ", "");
        setFormInput((prevState) => ({
            ...prevState,
            [name]: cleanedValue
        }));
        setError("");
    };

    useEffect(() => {
        if (selectedDepartment && selectedDepartment._id) {
            GetRequest(`${process.env.REACT_APP_URL}/department/roles/${selectedDepartment._id}`).then(response => {
                setRoles(response.data);
                setSelectedRole(null);
                setTrigger(prev => prev + 1)
            }).catch((error) => {
                console.error("fetch roles error >", error);
                setRoles([]);
            });
        } else {
            setRoles([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment]);

    const handleSubmit = () => {
        if (checkEmptyFields(formInput)) {
            setError("Field must not be empty");
        } else if (!validateEmail(formInput.email)) {
            setError("Email is invalid");
        } else if (!validatePassword(formInput.password)) {
            setError("Password should contain at least 8 characters and must contain one uppercase, one lowercase, one digit, and one special character!");
        } else {
            PostRequest(`${process.env.REACT_APP_URL}/user/employee/${accountInfo?.data._id}`, formInput).then((response) => {
                handleClose();
                setOpen(false)
                setTrigger(prev => prev + 1)
                dispatch(accountActions.setPlanTrigger(planTrigger + 1))
            }).catch((error) => {
                console.log(error)
                setError(error.data)
            })
        }
    };

    const handleClose = () => {
        setFormInput({
            fullName: "",
            email: "",
            password: "",
            gender: "prefer not to say",
            department: "",
            role: ""
        })
        setSelectedDepartment(null)
        setSelectedRole(null)
        setOpen(false)
        setError("")
    }

    let currentdate = formatDateForCompare(new Date());
    const isExpired = formatDateForCompare(currentPlan.expiryOn) < currentdate;

    const noOfEmployees = currentPlan?.plan?.employees;
    const employeesAdded = currentPlan?.employeesAdded;
    
    return (
        <>
            <button onClick={() => setOpen(true)} className={className}>{label}</button>
            <ReactModal open={open} close={handleClose} maxWidth="600px" heading={noOfEmployees > employeesAdded && departments.length > 0 && "Add Employee"}>
                {isExpired ? (
                    <ExpiredPlan />
                ):(
                    noOfEmployees > employeesAdded ? (
                        departments.length > 0 ? (
                            <>
                            {error && <Error message={error} />}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-[10px]'>
                                <div>
                                    <Label title='Full Name' isImportant />
                                    <TextInput
                                        name="fullName"
                                        value={formInput.fullName || ""}
                                        onChange={nameHandler}
                                        className='mt-[5px]'
                                    />
                                </div>
                                <div>
                                    <Label title='Email' isImportant />
                                    <TextInput
                                        name="email"
                                        value={formInput.email || ""}
                                        onChange={emailHandler}
                                        className='mt-[5px]'
                                    />
                                </div>
                                <div>
                                    <Label title='Password' isImportant />
                                    <TextInput
                                        name="password"
                                        value={formInput.password || ""}
                                        onChange={passwordHandler}
                                        className='mt-[5px]'
                                    />
                                </div>
                                <div>
                                    <Label title='Department' isImportant />
                                    <Dropdown
                                        value={selectedDepartment ? selectedDepartment.title : ""}
                                        onChange={(option) => {
                                            setSelectedDepartment(option);
                                            setFormInput((prevState) => ({
                                                ...prevState,
                                                department: option._id
                                            }));
                                        }}
                                        options={departments}
                                        className='mt-[5px]'
                                    />
                                </div>
                                <div>
                                    <Label title='Designation' isImportant />
                                    <Dropdown
                                        value={selectedRole ? selectedRole.title : ""}
                                        onChange={(option) => {
                                                setSelectedRole(option);
                                                setFormInput((prevState) => ({
                                                    ...prevState,
                                                    role: option._id
                                                }))
                                        }}
                                        options={roles}
                                        className='mt-[5px]'
                                    />
                                </div>
                                <div>
                                    <Label title='Gender' isImportant />
                                    <Gender value={formInput.gender} onClick={handleChange} />
                                </div>
                            </div>
                            <button className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full' onClick={handleSubmit}>Create</button>
                            </>
                        ):(
                            <div className='px-[10px] py-[40px]'>
                                <LiaCatSolid className='mx-auto' size={60} />
                                <h4 className='text-center w-full'>Oops! Can not add Employee!</h4>
                                <p className='text-center w-full mt-[10px]'>Add Department and Designation first</p>
                            </div>
                        )
                    ):(
                        <div className='px-[10px] py-[40px]'>
                            <FaUsersSlash className='mx-auto' size={60} />
                            <h4 className='text-center w-full'>Oops! Can not add more Employees!</h4>
                            <p className='text-center w-full mt-[10px]'>Upgrade the plan to continue expanding network!</p>
                        </div>
                    )
                )}
            </ReactModal>
        </>
    );
};

export default AddEmployee;