import React, { useEffect, useState } from "react";
import Avatar from "../../components/custom/avatar";
import { useSelector } from "react-redux";
import { GetRequest } from "../../utils/request";
import { formatDate } from "../../utils/formatDate";
import { RiSignalWifiErrorFill } from "react-icons/ri";

const AdminProfile = ({ selectedAdmin="" }) => {
    const { accountInfo } = useSelector((state) => state.account);
    const [adminDetail, setAdminDetail] = useState(null)

    const getAdmins = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo?.token}`,
            },
        }
        GetRequest(`${process.env.REACT_APP_URL}/superadmin/admin?id=${selectedAdmin}`, config).then((response) => {
            setAdminDetail(response.data)
        }).catch((error) => {
            console.log("Errors fetching admin data", error);
        });
    }
    useEffect(() => {
        if (accountInfo) {
            getAdmins();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo]);

    return (
        <div className="px-[10px] lg:px-[30px]">
            {adminDetail ? (
                <>
                    <div className='flex max-lg:flex-col max-lg:gap-[20px] lg:gap-[30px]'>
                    <div className='w-full xl:w-1/3'>
                        <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow max-lg:mb-[20px] lg:mb-[30px]'>
                            <div>
                                <Avatar src={adminDetail?.admin?.avatar} noOnline size={60} className='!w-[100px] !h-[100px] mx-auto' />
                            </div>
                            <h3 className='text-[20px] text-center mt-[15px] mb-[2px] capitalize'>{adminDetail?.admin?.fullName || '---'}</h3>
                            <p className="text-[16px] text-center text-gray-400">{adminDetail?.admin?.email || '---'}</p>
                        </div>
                        {adminDetail?.subscription.map((item, i) => (
                            <div key={i} className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow w-full inline-flex flex-col overflow-hidden'>
                                <ExpiredTag />
                                <h4 className="text-[20px] mb-[20px]">Current Plan</h4>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Plan</span>
                                    <span className='max-w-[400px] text-right'>{item?.plan?.title || "---"}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Started Date</span>
                                    <span className='max-w-[400px] text-right'>{formatDate(item?.startedOn) || "---"}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Expiry Date</span>
                                    <span className='max-w-[400px] text-right'>{formatDate(item?.expiryOn) || "---"}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Total No. of Employees</span>
                                    <span className='max-w-[400px] text-right'>{item?.plan?.employees || "---"}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Employees Added</span>
                                    <span className='max-w-[400px] text-right'>{item?.employeesAdded || "0"}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Employees Left</span>
                                    <span className='max-w-[400px] text-right'>{(item?.plan?.employees) - (item?.employeesAdded) || "---"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='w-full xl:w-2/3'>
                        <div className='relative bg-[#fff] rounded-[10px] px-[30px] py-[30px] drop-shadow'>
                            <div className="mb-[30px]">
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Full Name</span>
                                    <span className='max-w-[400px] text-right capitalize'>{adminDetail?.admin?.fullName || '---'}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Email</span>
                                    <span className='max-w-[400px] text-right'>{adminDetail?.admin?.email || '---'}</span>
                                </div>
                                <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                    <span>Mobile</span>
                                    <span className='max-w-[400px] text-right'>{adminDetail?.admin?.companyContact || '---'}</span>
                                </div>
                            </div>
                            <div className="mb-[10px]">
                                <h4 className="text-[20px] mb-[10px]">About Company</h4>
                                <div>
                                    <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                        <span>Name</span>
                                        <span className='capitalize max-w-[400px] text-right'>{adminDetail?.admin?.companyTitle || '---'}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                        <span>Email</span>
                                        <span className='max-w-[400px] text-right'>{adminDetail?.admin?.companyEmail || '---'}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                        <span>Mobile</span>
                                        <span className='max-w-[400px] text-right'>{adminDetail?.admin?.companyContact || '---'}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-[10px] gap-[20px] border-b-[1px]'>
                                        <span>Full Address</span>
                                        <span className='max-w-[400px] text-right'>{adminDetail?.admin?.companyAddress || '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    </div>
                </>
            ):(
                <div className="flex justify-center items-center gap-[10px]"><RiSignalWifiErrorFill size={20} /> Unable to load details!</div>
            )}
        </div>
    )
};

function ExpiredTag() {
    return (
        <div className='text-[#ff0000] rotate-[40deg] bg-[#ffe4e1] w-[120px] text-center absolute top-[13px] right-[-30px] z-[1] shadow-md pt-[3px] pb-[4px]'>
            Expired
        </div>
    )
}

export default AdminProfile;