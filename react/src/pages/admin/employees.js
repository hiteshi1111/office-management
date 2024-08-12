import React, { useEffect, useState } from 'react';
import Avatar from '../../components/custom/avatar';
import Department from '../../popups/department';
import Designation from '../../popups/designation'
import { useDispatch, useSelector } from 'react-redux';
import { GetRequest } from '../../utils/request';
import kitty from "../../assets/icons/kitty-strong.svg";
import Label from '../../components/custom/label';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { formatDate } from '../../utils/formatDate';
import isBirthdayToday from '../../utils/isBirthdayToday';
import IconButton from '../../components/custom/iconButton';
import AddEmployee from '../../popups/addEmployee';
import Search from '../../components/custom/search';
import Dropdown from '../../components/custom/dropdown';
import Layout from '../../layout';
import { employeeActions } from '../../store/employee-slice';
import EmployeeProfile from '../../popups/employeeProfile';
import { GrFormEdit } from "react-icons/gr";
import UpdateEmployee from '../../popups/updateEmployee';

const Employees = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { updateEmployee, viewEmployee } = useSelector((state) => state.employee);

    const { 
        employees, 
        filteredResults, 
        departments, 
        roles, 
        selectedDepartment, 
        selectedRole,
        searchKey
    } = useSelector((state) => state.employee);

    const [loader, setLoader] = useState(true);
    const [searchBirthday, setSearchBirthday] = useState(false);  
    const [trigger, setTrigger] = useState(false);

    useEffect(() => { 
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/department/${accountInfo.data._id}`).then(response => {
                dispatch(employeeActions.setDepartments(response.data));
            }).catch((error) => {
                console.log("department error >", error);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInfo, trigger])

    useEffect(() => {
        if (selectedDepartment && selectedDepartment._id) {
            GetRequest(`${process.env.REACT_APP_URL}/department/roles/${selectedDepartment._id}`).then(response => {
                dispatch(employeeActions.setRoles(response.data));
                dispatch(employeeActions.setSelectedRole(null));
            }).catch((error) => {
                console.log("roles error >", error);
                dispatch(employeeActions.setRoles([]));
            });
        } else {
            dispatch(employeeActions.setRoles([]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment]);

    useEffect(() => {
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/user/employees/${accountInfo.data._id}`).then(response => {
                dispatch(employeeActions.setEmployees(response.data))
                dispatch(employeeActions.setFilteredResults(response.data))
                setLoader(false)
            }).catch((error) => {
                setLoader(false)
                console.log(" employee error >", error);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInfo, trigger])

    // FILTER DATA THROUGH SEARCH BAR AND KEY
    useEffect(() => {
        if (searchKey.length > 0){
            const filtered = employees.filter(index => {
                return index.fullName.toLowerCase().includes(searchKey.toLowerCase()) || index.email.toLowerCase().includes(searchKey.toLowerCase())
            })
            dispatch(employeeActions.setFilteredResults(filtered))
        }else{
            dispatch(employeeActions.setFilteredResults(employees))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[employees, searchKey]);

    useEffect(() => {
        if (selectedRole){
            const filtered = employees.filter(index => {
                return index.role._id === selectedRole?._id;
            })
            dispatch(employeeActions.setFilteredResults(filtered))
        } else if (selectedDepartment) {
            const filtered = employees.filter(index => {
                return index.role.departmentId === selectedDepartment?._id;
            });
            dispatch(employeeActions.setFilteredResults(filtered))
        } else {
            dispatch(employeeActions.setFilteredResults(employees))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[employees, selectedRole, selectedDepartment]);

    useEffect(() => {
        if (searchBirthday){
            const filtered = employees.filter(index => {
                return isBirthdayToday(index.birthday);
            })
            dispatch(employeeActions.setFilteredResults(filtered))
        }else{
            dispatch(employeeActions.setFilteredResults(employees))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchBirthday, employees]);

    return (
        <Layout>
            {updateEmployee && (
                <UpdateEmployee setTrigger={setTrigger} departments={departments} />
            )}
            {viewEmployee && (
                <EmployeeProfile />
            )}
            <div className='flex max-md:flex-wrap pt-[30px] lg:pt-[50px]'>
                <Department label="Add Department" className='border h-[60px] w-full rounded-r-full mr-[-20px] relative bg-[#fff0f5] z-[3]' setTrigger={setTrigger} />
                <Designation label="Add Designation" className='border h-[60px] w-full rounded-r-full mr-[-20px] relative bg-white z-[2]' setTrigger={setTrigger} />
                <AddEmployee 
                    label="Add Employee" 
                    className='border h-[60px] w-full rounded-r-full mr-[-20px] relative bg-[#f5f5dc] z-[1]' 
                    departments={departments} 
                    setTrigger={setTrigger}
                />
            </div>
            <div className='flex gap-[10px] flex-col-reverse lg:flex-row justify-between item-center mt-[50px] mb-[50px]'>
                <div className='flex gap-[20px]'>
                    <div className='relative group w-full'>
                        <Label title='Department' className='text-[#aaa]' />
                        <Dropdown
                            value={selectedDepartment ? selectedDepartment.title : "All"} 
                            onChange={(option) => {
                                if (option.title === "All") {
                                    dispatch(employeeActions.setSelectedDepartment(null));
                                    dispatch(employeeActions.setSelectedRole(null));
                                } else {
                                    dispatch(employeeActions.setSelectedDepartment(option));
                                }
                                dispatch(employeeActions.setFilteredResults(employees))
                            }}
                            options={[{ title: "All" }, ...departments]} 
                            className='mt-[5px] bg-[#f9ffe3] w-full lg:w-[200px]'
                        />
                    </div>
                    <div className='relative group w-full'>
                        <Label title='Designation' className='text-[#aaa]' />
                        <Dropdown
                            value={selectedRole ? selectedRole.title : "All"}
                            onChange={(option) => {
                                if (option.title === "All") {
                                    dispatch(employeeActions.setSelectedRole(null));
                                } else {
                                    dispatch(employeeActions.setSelectedRole(option));
                                }
                                dispatch(employeeActions.setFilteredResults(employees))
                            }}
                            options={[{ title: "All" }, ...roles]} 
                            className='mt-[5px] bg-[#faf0e6] w-full lg:w-[170px]'
                        />
                    </div>
                </div>
                <div className='flex gap-[10px]'>
                    <h2 className='my-auto'>Employees</h2>
                    <img
                        src={kitty}
                        alt="kitty"
                        className='max-w-[80px] w-full h-auto'
                    />
                </div>
            </div>
            <div className='flex justify-between items-center gap-[30px]'>
                <button onClick={() => setSearchBirthday(prev => !prev)} className={`w-[80px] border bg-white rounded-full flex ${searchBirthday ? "justify-end" : "justify-start"}`}>
                    <IconButton 
                        icon={<LiaBirthdayCakeSolid size={20} color={searchBirthday ? "#880000" : "#aaa"} />}
                        className={`h-[40px] w-[40px] ${searchBirthday ? "bg-[#fff0f5]" : "bg-[#f5f5f5]"}`}
                    />
                </button>
                <Search
                    placeholder='I will help you find... :)'
                    value={searchKey}
                    onChange={(e) => dispatch(employeeActions.setSearchKey(e.target.value))} 
                    className='max-w-[250px]'
                />
            </div>
            {loader ? (
                <div className='text-center mt-[30px]'>Loading...</div>
            ):(
                filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] mt-[30px] pb-[50px]">
                        {filteredResults.map((item, i) => (
                            <div key={i} className="group relative w-full bg-white border border-gray-200 rounded-lg shadow p-[20px] flex gap-[30px] items-start overflow-hidden">
                                {isBirthdayToday(item.birthday) && (
                                    <BirthdayTag />
                                )}
                                <Avatar 
                                    src={item.avatar} 
                                    alt={item.fullName} 
                                    size={20} 
                                    className={`h-[50px] min-w-[50px] border-[2px] ${isBirthdayToday(item.birthday) ? "!border-[#ff0000]" : item.gender === "female" ? "!border-[#FF69B4] border-[2px]" : item.gender === "male" ? "!border-[#6ca0dc]" : "border-[#aaa]"}`} 
                                    noOnline
                                    onClick={() =>  dispatch(employeeActions.setViewEmployee(item)) }
                                />
                                <div>
                                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">{item.fullName}</h5>
                                    <p className="text-[#aaa] break-all">{item.email}</p>
                                    <p className="text-[#aaa] capitalize">({item.role.title})</p>
                                    <p className="capitalize flex mt-[5px] text-[#fc0fc0] items-center"> <LiaBirthdayCakeSolid size={15} className='mr-[5px]' /> {item.birthday ? formatDate(item.birthday) : "---"}</p>
                                </div>
                                <div className='absolute top-[5px] right-[5px] group-hover:block hidden'>
                                    <IconButton 
                                        icon={<GrFormEdit size={20} color='#000' />}
                                        className='bg-white h-[30px] w-[30px] border-none'
                                        title="Edit"
                                        onClick={() => dispatch(employeeActions.setUpdateEmployee(item))}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    searchKey.length > 0 ? (
                        <div className='mt-[30px] text-center'>No Employee found!</div>
                    ):(
                        <div className='mt-[30px] text-center'>{searchBirthday ? "No Birthday Today!" : "No Employees added!"}</div>
                    )
                )
            )}
        </Layout>
    );
};

function BirthdayTag(){
    return(
        <div className='text-[#ff0000] -rotate-[40deg] bg-[#ffe4e1] px-[21px] absolute top-[10px] left-[-20px] z-[1] shadow-md'>
            Birthday
        </div>
    )
}

export default Employees;