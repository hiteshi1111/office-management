import React, { useEffect, useState } from 'react'
import ReactModal from '.';
import TextInput from '../components/custom/textInput';
import Label from '../components/custom/label';
import { PostRequest } from '../utils/request';
import { useSelector } from 'react-redux';
import Dropdown from '../components/custom/dropdown';

const Designation = ({ label = "", className = "", setTrigger = () => { } }) => {
    const [open, setOpen] = useState(false);
    const { accountInfo } = useSelector((state) => state.account);
    const { departments } = useSelector((state) => state.employee);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [formInput, setFormInput] = useState({
        department: "",
        role: ""
    })
    const [allRoles, setAllRoles] = useState([]);
    const [error, setError] = useState({
        message: "",
        success: false
    })

    useEffect(() => {
        const newArray = formInput.role.split(',').map(item => item.trim());
        const removedEmpty = newArray.filter(index => index.length > 0)
        setAllRoles(removedEmpty);
    }, [formInput.role])

    const handleSubmit = () => {
        setError({ message: "", success: false })
        if (!formInput.department || !formInput.role) {
            setError({ message: "Fields must not be empty" })
        } else {
            PostRequest(`${process.env.REACT_APP_URL}/department/designation/${accountInfo?.data._id}`, {
                deptId: formInput.department,
                role: allRoles
            }).then((response) => {
                setError({ message: response?.data, success: true })
                setFormInput({ department: "", role: "" })
                setTrigger(prev => prev + 1)
                setOpen(false)
                setSelectedDepartment(null)
            }).catch((error) => {
                console.log(error)
                setError({ message: error?.data, success: false })
            })
        }
    }

    const handleClose = () => {
        setOpen(false)
        setFormInput({ department: "", role: "" })
        setSelectedDepartment(null)
        setError("")
    }
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };
    const validateRoleOnChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/[^A-Za-z, ]/g, '');
        const capitalizedValue = capitalizeWords(cleanedValue);
        setFormInput((prevState) => ({
            ...prevState,
            [name]: capitalizedValue
        }));
        setError(prevState => ({ ...prevState, message: "" }))
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className={className}>{label}</button>
            <ReactModal open={open} close={handleClose} maxWidth="600px" heading="Designation">
                {!error.success && <div className="text-[#fd5901]">{error.message}</div>}
                <Label title='Department' />
                {/* <TextInput
                    value={formInput.department}
                    name="department"
                    onChange={validateInputOnChange}
                    placeholder='Example: IT'
                    className='mt-[5px]'
                /> */}
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
                <div className='mt-[10px]'>
                    <Label title='Designations' />
                    <TextInput
                        name="role"
                        value={formInput.role}
                        placeholder='Example: Development'
                        className='mt-[5px]'
                        maxLength={50}
                        onChange={validateRoleOnChange}
                    />
                    <p className='text-[#aaa] text-[12px]'>Enter comma to separate the designations.</p>

                    {allRoles.length > 0 && (
                        <ul className='flex gap-[10px] mt-[10px] flex-wrap'>
                            {allRoles.map((item, index) => (
                                <div key={index} className='border shadow-md px-[10px] capitalize'>{item}</div>
                            ))}
                        </ul>
                    )}
                </div>
                <button className='w-full border mt-[30px] h-[40px] bg-[#ff4081] text-white rounded-full' onClick={handleSubmit}>Create</button>
            </ReactModal>
        </>
    )
}

export default Designation;