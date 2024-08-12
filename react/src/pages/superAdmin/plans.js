import React from "react";
import Layout from "../../layout/superAdmin";
import { BsStars } from "react-icons/bs";
import { useSelector } from "react-redux";
import AddPlan from "../../popups/addPlan";
import UpdatePlan from "../../popups/updatePlan";
import dashbgimg from '../../assets/images/bg-blue-img.png';

const Plans = () => {
    const { planList } = useSelector((state) => state.superadmin);
    return (
        <Layout>
            <div className="max-md:px-[15px] md:px-[30px] pt-[40px] pb-[30px]">
                <div className="flex justify-between items-center mb-[30px] border-b px-[10px] lg:px-[30px]">
                    <h3>All Plans</h3>
                </div>
                <AddPlan />
                <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px] px-[10px] lg:px-[30px]">
                    {planList.length > 0 && planList.map((item, i) => (
                        <div key={i} className='group relative overflow-hidden w-full flex rounded-[10px] px-[20px] py-[20px] drop-shadow items-center shadow-md flex-col bg-gradient-to-r from-violet-200 to-pink-200 hover:bg-gradient-to-r hover:from-violet-300 hover:to-pink-300'>
                            <img 
                                src={dashbgimg} 
                                alt="admin" 
                                className='absolute top-0 left-0 w-full h-full object-center object-cover z-[-1]' 
                            />
                            <div className="absolute right-[10px] top-[10px] group-hover:block hidden">
                                <UpdatePlan data={item} />
                            </div>
                            <div className="relative w-full">
                                <div className="mb-[10px]">
                                    <BsStars size={60} color="#594cda" className="animate-pulse" />
                                </div>
                                <h4 className="text-[#fff] font-semibold text-[40px] leading-normal mb-[5px]">₹{item?.price}<span className="text-[18px] leading-normal"> /month</span></h4>
                                
                                <div className="w-full flex justify-between items-center gap-[20px]">
                                    <p className="text-[#eb427e] text-[22px] font-semibold mb-[0px] capitalize break-all">{item?.title}</p>
                                    <p className="text-[#fff] text-[16px] text-[#000] capitalize mb-[0px]">{item?.employees} employees</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Plans;