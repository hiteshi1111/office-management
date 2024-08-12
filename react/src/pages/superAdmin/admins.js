import React, { useEffect, useState } from 'react';
import Avatar from '../../components/custom/avatar';
import Layout from '../../layout/superAdmin';
import { DeleteRequest, GetRequest } from '../../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import AdminProfile from '../../components/superadmin/adminProfile';
import { superadminActions } from '../../store/superadmin-slice';
import { IoChevronBack } from 'react-icons/io5';
import { GiSadCrab } from "react-icons/gi";
import Loader from '../../components/custom/loader';
import DeleteConfirmation from '../../popups/deleteConfirmation';

const Admins = () => {
    const dispatch = useDispatch();
    const { accountInfo } = useSelector((state) => state.account);
    const { adminList } = useSelector((state) => state.superadmin);

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const [loading, setLoading] = useState(false);

    const getAdmins = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo?.token}`,
            },
        }
        GetRequest(`${process.env.REACT_APP_URL}/subscription`, config).then((response) => {
            dispatch(superadminActions.setAdminList(response.data))
        }).catch((error) => {
            console.log("Errors fetching data", error);
        });
    }
    
    useEffect(() => {
        if (accountInfo) {
            getAdmins();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo, trigger]);
    
    const deleteHandler = () => {
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo?.token}`,
                'Content-Type': 'application/json',
            },
        };
        if (selectedAdmin){
            DeleteRequest(`${process.env.REACT_APP_URL}/subscription/${selectedAdmin._id}`,config).then((response) => {
                setSelectedAdmin(false)
                setTrigger(prev => prev+1)
                setLoading(false)
            }).catch((error) => {
                setLoading(false)
                console.log("delete error", error);
                alert("Something went wrong. Try again later!") 
            });
        }
    };

    return (
        <Layout>
            {loading && (
                <Loader />
            )}
            <div className='max-md:px-[15px] md:px-[30px] pt-[40px] pb-[30px]'>
                <div className="flex justify-between items-center mb-[30px] border-b gap-[10px] px-[10px] lg:px-[30px]">
                    <div className="flex justify-between items-center gap-[10px]">
                        {selectedAdmin && (
                            <IoChevronBack size={25} onClick={() => setSelectedAdmin(null)} className="cursor-pointer" title='Back' />
                        )}
                        <h3 className='capitalize'>{selectedAdmin ? selectedAdmin.fullName : "Subscribers"}</h3>
                    </div>
                    {selectedAdmin && (
                        <DeleteConfirmation 
                            onClick={deleteHandler} 
                            description="Are you sure you want to delete this subscriber and all of its data? This can not be undone!"
                        />
                    )}
                </div>
                {selectedAdmin ? ( 
                    <AdminProfile selectedAdmin={selectedAdmin?._id} />
                ):(
                    adminList.length > 0 ? (
                        <div className="grid max-md:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px] mt-[30px] px-[10px] lg:px-[30px]">
                            {adminList.map((item, i) => (
                                <button key={i} className="relative w-full flex flex-col gap-[15px] bg-[#fff] rounded-[10px] px-[20px] py-[20px] drop-shadow cursor-pointer" onClick={() => setSelectedAdmin(item)}>
                                    <Avatar 
                                        src={item.avatar} 
                                        alt={item.companyTitle} 
                                        size={30} 
                                        className='mx-auto min-h-[100px] min-w-[100px]' 
                                    />
                                    <div className='w-full'>
                                        <h4 className="text-[18px] mb-[2px] capitalize text-center">{item.fullName}</h4>
                                        <p className="text-[14px] leading-normal text-gray-400 text-center">({item.email})</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ):(
                        <div className='flex justify-center items-center gap-[10px]'>
                            <GiSadCrab size={40} />
                            <p className='text-[16px]'>No Purchases!</p>
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
};
export default Admins;
