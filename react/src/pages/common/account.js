import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetRequest } from '../../utils/request';
import Layout from '../../layout';
import ContentLoader from '../../components/custom/contentLoader';
import { accountActions } from '../../store/account-slice';
import ProfilePicture from '../../components/account/profilePicture';
import CurrentPlan from '../../components/account/currentPlan';
import MyProjects from '../../components/account/myProjects';
import CompanyInfo from '../../components/account/companyInfo';
import MyInfo from '../../components/account/myInfo';

const Account = () => {
    const dispatch = useDispatch();
    const { accountInfo, currentPlan } = useSelector((state) => state.account);

    useEffect(() => {
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/project/${accountInfo?.data?._id}`).then((response) => {
                dispatch(accountActions.setProjects(response.data))
            }).catch((error) => {
                console.error("Error fetching user details:", error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInfo])

    return (
        <Layout>
            {!accountInfo ? (
                <div className='w-full h-full pt-[30px] lg:pt-[50px] pb-[30px]'>
                    <ContentLoader />
                </div>
            ):(
                <div className='flex max-lg:flex-col gap-[20px] lg:gap-[30px] pt-[30px] lg:pt-[50px] pb-[30px]'>
                    <div className='w-full lg:max-w-[400px]'>
                        <ProfilePicture />
                        {accountInfo?.data?.role?.title.toLowerCase() === "admin" && currentPlan ? (
                            <CurrentPlan />
                        ):(
                            <MyProjects />
                        )}
                    </div>

                    <div className='p-[20px] lg:p-[30px] w-full border shadow-md bg-white relative'>
                        <MyInfo />
                        <CompanyInfo />
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Account;