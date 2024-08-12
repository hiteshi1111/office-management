import React, { useEffect, useState } from 'react';
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import Dropdown from '../components/custom/dropdown';
import Gender from '../components/shared/gender';
import { checkEmptyFields, validateEmail } from '../utils/formValidation';
import Error from '../components/custom/error';
import { DeleteRequest, GetRequest, PutRequest } from '../utils/request';
import { useSelector, useDispatch } from 'react-redux';
import { employeeActions } from '../store/employee-slice';
import DeleteConfirmation from './deleteConfirmation';
import Button from '../components/custom/button';
import Loader from '../components/custom/loader';

const UpdateEmployee = ({ setTrigger=()=>{}, departments=[] }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [roles, setRoles] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const { updateEmployee } = useSelector((state) => state.employee);

    const [formInput, setFormInput] = useState({
        fullName: updateEmployee?.fullName,
        email: updateEmployee?.email,
        gender: updateEmployee?.gender,
        department: updateEmployee?.role.departmentId,
        role: updateEmployee?.role._id,
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

    useEffect(() => {
        if (selectedDepartment && selectedDepartment._id) {
            GetRequest(`${process.env.REACT_APP_URL}/department/roles/${selectedDepartment._id}`).then(response => {
                setRoles(response.data);
                setSelectedRole(null);
                setTrigger(prev => prev + 1)
            }).catch((error) => {
                console.error("roles error >", error);
                setRoles([]);
            });
        } else {
            setRoles([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment]);

    const updateHandler = () => {
        setDisabled(true)
        setError("")
        if(checkEmptyFields(formInput)){
            setError("Field must not be empty!")
            setDisabled(false)
        }else if(!validateEmail(formInput.email)) {
            setError("Invalid Email!")
            setDisabled(false)
        }else {
            PutRequest(`${process.env.REACT_APP_URL}/user/${updateEmployee?._id}`, formInput).then((response) => {
                setDisabled(false)
                setTrigger(prev => prev+1)
                dispatch(employeeActions.setUpdateEmployee(null))
            }).catch((error) => {
                console.log(error)
                setError("Unable to update account")
                setDisabled(false)
            })
        }
    }

    const handleClose = () => {
        setFormInput({
            fullName: "",
            email: "",
            password: "",
            gender: "prefer not to say",
            department: "",
            role: ""
        })
        dispatch(employeeActions.setUpdateEmployee(null))
        setError("")
    }

    function deleteHandler(id){
        DeleteRequest(`${process.env.REACT_APP_URL}/user/${id}`).then(response => {
            setTrigger(prev => prev+1)
            dispatch(employeeActions.setUpdateEmployee(null))
        }).catch(error => {
            console.log("delete error", error)
            setError("Something went wrong.")
        })
    }
    
    return (
        <ReactModal open={updateEmployee} close={handleClose} maxWidth="600px" heading="Update Employee">
            {disabled && (
                <Loader />
            )}
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
                    <Label title='Password' />
                    <TextInput
                        name="password"
                        value="********"
                        className='mt-[5px]'
                        disabled
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
            <div className='flex justify-center gap-[10px] mt-[40px]'>
                <DeleteConfirmation
                    onClick={() => deleteHandler(updateEmployee?._id)}
                    className='max-w-[120px]'
                    close={() => dispatch(employeeActions.setUpdateEmployee(null))}
                />
                <Button
                    label='Update'
                    onClick={updateHandler}
                    secondary
                />
            </div>
        </ReactModal>
    );
};

export default UpdateEmployee;