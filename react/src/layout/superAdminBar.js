import React, { useEffect } from 'react';
import { CgMenuLeft } from 'react-icons/cg';
import { uiActions } from '../store/ui-slice';
import { useDispatch, useSelector } from 'react-redux';
import { GetRequest } from '../utils/request';
import { accountActions } from '../store/account-slice';
import { useNavigate } from 'react-router-dom';

const SuperAdminBar = () => {
    const dispatch = useDispatch();
    const { currentTheme } = useSelector((state) => state.ui);
    const navigate = useNavigate();

    let key = localStorage.getItem("xios");
    let token = localStorage.getItem("tokk");

    useEffect(() => {
        if (key) {
            GetRequest(`${process.env.REACT_APP_URL}/superadmin/${key}`).then(response => {
                if (response?.data) {
                    dispatch(accountActions.setAccountInfo({ data: response.data, token: token }))
                } else {
                    localStorage.removeItem("xios")
                    navigate("/")
                }
            }).catch(error => {
                console.log("fetch err >", error);
                localStorage.removeItem("xios")
                navigate("/")
            })
        }else{
            navigate("/")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    return (
        <div className={`${currentTheme} sticky top-0 bg-white shadow-md w-full max-md:px-[10px] md:px-[20px] lg:px-[30px] h-[70px] flex items-center justify-between z-[99]`}>
            <div className='flex items-center'>
                <CgMenuLeft size={30} onClick={() => dispatch(uiActions.setDrawer(true))} className="lg:hidden cursor-pointer" />
            </div>
        </div>
    )
}

export default SuperAdminBar;