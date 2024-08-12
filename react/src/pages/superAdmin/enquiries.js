import React, { useEffect, useState } from 'react';
import SuperAdminLayout from '../../layout/superAdmin';
import { GetRequest } from '../../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateAndTime } from '../../utils/formatDate';
import { trimText } from '../../utils/trimText';
import Search from '../../components/custom/search';
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { employeeActions } from '../../store/employee-slice';

const Enquiries = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { enquiryList } = useSelector((state) => state.employee);

    const [searchKey, setSearchKey] = useState("");
    const [filteredList, setFilteredList] = useState("");
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("latest");

    useEffect(() => {
        if (accountInfo){
            const config = {
                headers: {
                    Authorization: `Bearer ${accountInfo?.token}`,
                },
            }
            GetRequest(`${process.env.REACT_APP_URL}/contact`, config).then(response => {
                dispatch(employeeActions.setEnquiryList(response.data))
                setFilteredList(enquiryList)
            }).catch(error => {
                console.log("fetch enquiries error >>>", error.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInfo])

    useEffect(() => {
        if (searchKey.length > 0){
            const filtered = enquiryList.length > 0 && enquiryList.filter(index => {
                return index.fullName?.includes(searchKey) || index.email?.includes(searchKey) || index.phone?.toString().includes(searchKey)
            })
            setFilteredList(filtered);
        }else{
            setFilteredList(enquiryList);
        }
    },[searchKey, enquiryList])

    useEffect(() => {
        if (enquiryList.length > 0){
            if (sortBy === "latest"){
                let sortedLatest = enquiryList.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFilteredList(sortedLatest);
            }else{
                let sortedOldest = enquiryList.slice().sort((a, b) =>  new Date(a.createdAt) - new Date(b.createdAt));
                setFilteredList(sortedOldest);
            }
        }
    },[sortBy, enquiryList])

    return (
        <SuperAdminLayout>
            <div className="max-md:px-[15px] md:px-[30px] pt-[40px] pb-[30px]">
                <div className="flex justify-between items-center mb-[30px] border-b px-[10px] lg:px-[30px]">
                    <h3>Enquiries</h3>
                </div>
                <div className='mt-[20px] pb-[50px] w-full'>
                    <div className='flex justify-between items-center'>
                        <Search
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            className='max-w-[250px]'
                            placeholder="Can't find? Search here..."
                        />
                        <div className='relative border rounded-full bg-white max-w-[120px] px-[10px] h-[40px] w-full text-center flex justify-center items-center'>
                            <button onClick={() => setOpen(prev => !prev)} className='w-full capitalize'>Sort By: {sortBy}</button>
                            <div className={`absolute top-[40px] left-[10px] right-[10px] z-[99] bg-white shadow-md ${open ? "grid" : "hidden"}`} onMouseLeave={() => setOpen(false)}>
                                {sortList.map((index) => (
                                    <button 
                                        onClick={() => {
                                            setSortBy(index.label)
                                            setOpen(false)
                                        }} 
                                        className='py-[5px] hover:bg-[#f8f8ff] capitalize flex items-center gap-[10px] justify-between px-[15px] border-b last-child:border-none'
                                    >{index.label} {index.icon}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <table className='mt-[20px] relative'>
                        <thead>
                            <tr className='bg-[#dcdcdc] py-[120px]'>
                                {columns.map((col, i) => (
                                    <td
                                        key={i}
                                        style={{ width: col.width, textAlign: col.textAlign}}
                                        className='!font-bold !text-[14px] text-left px-[10px] py-[10px]'
                                    >{col.header}</td>
                                ))}
                                <td className='text-left'></td>
                            </tr>
                        </thead>
                        {filteredList.length > 0 ? (
                            <tbody>
                                {filteredList.map((user, i) => (
                                    <tr key={i} className={`bg-[#f8f8ff] border-b`}>
                                        <td className='text-left text-[14px] px-[10px] py-[5px] capitalize'>{user.fullName || "----"}</td>
                                        <td className='text-left text-[14px] px-[10px] py-[5px]'>{user.email || "----"}</td>
                                        <td className='text-left text-[14px] px-[10px] py-[5px]'>{user.phone || "----"}</td>
                                        <td className='relative group text-left text-[14px] px-[10px] py-[5px]'>
                                            {trimText(user.message, 30) || "----"}
                                            <div className='bg-white z-[99] w-full p-[10px] absolute top-[10px] left-0 hidden group-hover:block shadow-md'>
                                                <strong>Message:</strong> <br/>
                                                {user.message}
                                            </div>
                                        </td>
                                        <td className='text-right text-[14px] px-[10px] py-[5px]'>{formatDateAndTime(user.createdAt) || "----"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ):(
                            <p className='text-center w-full absolute top-[70px]'>No Results found!</p>
                        )}
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    )
}

const sortList = [
    {
        label: "latest",
        icon: <FiArrowUp />
    },
    {
        label: "oldest",
        icon: <FiArrowDown />
    }
];

const columns = [
    { 
        header: 'Full Name', 
        width: '20%',
        textAlign: "left"
    },
    { 
        header: 'Email', 
        width: '20%',
        textAlign: "left"
    },
    { 
        header: 'Phone', 
        width: '15%',
        textAlign: "left"
    },
    { 
        header: 'Message', 
        width: '25%',
        textAlign: "left"
    },
    { 
        header: 'Received On', 
        width: '20%',
        textAlign: "right"
    }
];

export default Enquiries;