import React from 'react'
import Toastify from '../components/custom/toastify';
import DefaultLayout from "./default";
import { useSelector } from 'react-redux';
import SuperAdmin from './superAdmin';

const Layout = ({children, containerClassName="", bgClass=""}) => {
    const { accountInfo } = useSelector((state) => state.account);
    const role = accountInfo?.data?.role?.title.toLowerCase();
    return (
        <div className='relative'>
            <Toastify />
            {role === "super admin" ? (
                <SuperAdmin>
                    {children}
                </SuperAdmin>
            ):(
                <DefaultLayout className={containerClassName} bgClass={bgClass}>
                    {children}
                </DefaultLayout>
            )}
        </div>
    )
}

export default Layout;