import React, { useEffect, useState } from 'react';
import PieChart from '../../components/superadmin/pieChart';
import CountUp from '../../components/superadmin/countUp';
import SplineChart from '../../components/superadmin/splineChart';
import dashimg from '../../assets/images/dashboard.png';
import dashbgimg from '../../assets/images/bg-blue-img.png';
import { FaFreeCodeCamp } from "react-icons/fa";
import SuperAdminLayout from '../../layout/superAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { superadminActions } from '../../store/superadmin-slice';
import { GetRequest } from '../../utils/request';
import PlanCard from '../../components/superadmin/planCard';

const Dashboard = () => {
    const dispatch = useDispatch()
    const { accountInfo } = useSelector((state) => state.account);
    const { planList } = useSelector((state) => state.superadmin);

    const [subscriptionData, setSubscriptionData] = useState([]);

    const getPlans = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo.token}`,
            },
        }
        GetRequest(`${process.env.REACT_APP_URL}/plan`, config).then((response) => {
            dispatch(superadminActions.setPlanDistribution(response.data));
        }).catch((error) => {
            console.log("Errors fetching plan", error);
        });
    }

    const getSubscription = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo.token}`,
            },
        }
        GetRequest(`${process.env.REACT_APP_URL}/subscription/all`, config).then((response) => {
            setSubscriptionData(response.data);
        }).catch((error) => {
            console.log("Errors fetching subscription", error);
        });
    }

    useEffect(() => {
        if (accountInfo?.token) {
            getPlans();
            getSubscription();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo]);

    const totalDataCount = subscriptionData.length > 0 && subscriptionData.reduce((acc, item) => acc + item.count, 0);
    
    function getPercentage(title) {
        const filtered = subscriptionData.length > 0 && subscriptionData.find(index => {
            return index.title === title
        })
        if (filtered){
            let count = filtered?.count;
            
            const percentage = (count/totalDataCount) * 100;
            return percentage.toFixed(2);
        }
        return 0;
    }

    return (
        <SuperAdminLayout>
            <div className='max-md:px-[15px] md:px-[30px] pt-[40px] pb-[30px]'> 
                <div className='lg:flex lg:gap-[30px]'>
                    <div className='lg:w-full'>
                        <div className='relative w-full overflow-hidden rounded-[10px] drop-shadow mb-[30px]'>
                            <img src={dashbgimg} alt="admin" className='absolute top-0 left-0 w-full h-full object-center object-cover' />
                            <div className='relative lg:flex px-[30px] py-[30px] rounded-[10px] items-center'>
                                <div className='lg:w-3/4'>
                                    <h2 className="text-white">Welcome 🎉</h2>
                                </div>
                                <div className='lg:w-1/4'>
                                    <img src={dashimg} alt="admin" className="w-full max-w-[180px] lg:ml-auto" />
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[30px]'>
                            <div>
                                <CountUp totalDataCount={totalDataCount} />
                            </div>
                            {planList.length > 0 && planList.map(index => (
                                <PlanCard 
                                    icon={<FaFreeCodeCamp size={35} color='#ffA500' />}
                                    label={index.title}
                                    percentage={getPercentage(index.title)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='lg:mb-[30px] mt-[30px]'>
                    <div className=''>
                        <SplineChart />
                    </div>
                    <div className='mt-[20px]'>
                        <PieChart subscriptionData={subscriptionData} />
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    )
}

export default Dashboard;