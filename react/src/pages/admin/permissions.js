import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GetRequest, PostRequest } from '../../utils/request';
import { GrShieldSecurity } from "react-icons/gr";
import Checkbox from '../../components/custom/checkbox';
import Label from '../../components/custom/label';
import Search from '../../components/custom/search';
import IconButton from '../../components/custom/iconButton';
import { FaCheck } from "react-icons/fa6"; 
import Layout from '../../layout';

const Permissions = () => {
    const [allUsers, setAllUsers] = useState([]);
    const { accountInfo } = useSelector((state) => state.account);
    const [selected, setSelected] = useState(null);
    const [userPermission, setUserPermission] = useState({
        sendMessageRequest: false,
        addEvent: false,
        addTasks: false,
        addProject: false,
        addMilestone: false,
        updateTaskStatus: false,
        addEmployee: false,
        updateProfile: false
    });
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/user/employees/${accountInfo.data._id}`).then(response => {
                setAllUsers(response.data);
            }).catch((error) => {
                console.log("employee error >", error);
            })
        }
    },[accountInfo])

    useEffect(() => {
        if (selected){
            GetRequest(`${process.env.REACT_APP_URL}/permission/${selected}`).then(response => {
                setUserPermission(response.data)
            }).catch((error) => {
                console.log("permission error >", error);
            })
        }
    },[selected])

    // FILTER DATA THROUGH SEARCH BAR AND KEY
    useEffect(() => {
        if (searchKey.length > 0){
            const filtered = allUsers.filter(index => {
                return index.fullName.toLowerCase().includes(searchKey.toLowerCase()) || index.email.toLowerCase().includes(searchKey.toLowerCase())
            })
            setFilteredResults(filtered);
        }else{
            setFilteredResults(allUsers);
        }
    },[allUsers, searchKey]);

    function openHandler(id){
        if (selected){
            if (selected === id){
                setSelected(null);
            }else{
                setSelected(id);
            }
        }else{
            setSelected(id);
        }
    }

    function updatePermissionHandler(userId){
        PostRequest(`${process.env.REACT_APP_URL}/permission/${userId}`, {...userPermission}).then((response) => {
            setSelected(null);
        }).catch(error => {
            console.log("ipdate permission error", error)
        })
    }

    return (
        <Layout>
            <div className='pt-[30px] lg:pt-[50px] pb-[50px]'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-[30px]'>
                    <h3>Employee Permissions</h3>
                    <Search 
                        value={searchKey}
                        placeholder="Need a helping hand?"
                        onChange={(e) => setSearchKey(e.target.value)} 
                        className='!max-w-[300px]'
                    />
                </div>
                <div className='mt-[20px] pb-[50px]'>
                    {filteredResults.length > 0 ? (
                        <div className='grid gap-[10px]'>
                            {filteredResults.map((item, i) => (
                                <div key={i} className='border'>
                                    <button onClick={() => openHandler(item._id)} className={`px-[20px] py-[15px] bg-white w-full flex justify-between items-center ${item._id === selected && "border-b"}`}>
                                        <div className='grid text-left'>
                                            <span className='text-[#aaa] text-[16px] text-black'>{item.fullName} </span>
                                            <span className='text-[#aaa] text-[14px]'>({item.role.title})</span>
                                        </div>
                                        <GrShieldSecurity 
                                            size={20}
                                            className='cursor-pointer'
                                        />
                                    </button>
                                    <div className={`p-[20px] ${item._id === selected ? "block shadow-md" : "hidden"}`}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Send Message Request" className='text-[14px] font-normal cursor-pointer' htmlFor="sendMessageRequest" />
                                                <Checkbox 
                                                    id="sendMessageRequest" 
                                                    checked={userPermission.sendMessageRequest} 
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, sendMessageRequest: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Add Event" className='text-[14px] font-normal cursor-pointer' htmlFor="addEvent" />
                                                <Checkbox 
                                                    id="addEvent" 
                                                    checked={userPermission.addEvent}
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, addEvent: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Add Tasks" className='text-[14px] font-normal cursor-pointer' htmlFor="addTasks" />
                                                <Checkbox 
                                                    id="addTasks" 
                                                    checked={userPermission.addTasks} 
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, addTasks: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Add Project" className='text-[14px] font-normal cursor-pointer' htmlFor="addProject" />
                                                <Checkbox 
                                                    id="addProject" 
                                                    checked={userPermission.addProject}
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, addProject: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Add Milestone" className='text-[14px] font-normal cursor-pointer' htmlFor="addMilestone" />
                                                <Checkbox 
                                                    id="addMilestone" 
                                                    checked={userPermission.addMilestone} 
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, addMilestone: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Update Task Status" className='text-[14px] font-normal cursor-pointer' htmlFor="updateTaskStatus" />
                                                <Checkbox 
                                                    id="updateTaskStatus" 
                                                    checked={userPermission.updateTaskStatus} 
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, updateTaskStatus: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Update Profile" className='text-[14px] font-normal cursor-pointer' htmlFor="updateProfile" />
                                                <Checkbox 
                                                    id="updateProfile" 
                                                    checked={userPermission.updateProfile} 
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, updateProfile: e.target.checked }))}
                                                />
                                            </div>
                                            <div className='flex gap-[10px] items-center'>
                                                <Label title="Add Employee" className='text-[14px] font-normal cursor-pointer' htmlFor="addEmployee" />
                                                <Checkbox 
                                                    id="addEmployee" 
                                                    checked={userPermission.addEmployee}
                                                    onChange={(e) => setUserPermission((prevState) => ({ ...prevState, addEmployee: e.target.checked }))}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex gap-[10px] mt-[10px] justify-end'>
                                            <IconButton
                                                icon={<FaCheck size={23} color='#fff' />}
                                                className="h-[40px] w-[40px] bg-[#ff4081]"
                                                onClick={() => updatePermissionHandler(item._id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div className='text-center mt-[50px]'>
                            No Employees found!
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Permissions;