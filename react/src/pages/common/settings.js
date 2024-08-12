import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Layout from '../../layout/default';
import Notifications from '../../components/settings/notifications';
import Profile from '../../components/settings/profile';
import Password from '../../components/settings/password';
import Sound from '../../components/settings/sound';
import { GetRequest, PutRequest } from '../../utils/request';
import LayoutTheme from '../../components/settings/layoutTheme';
import ChatTheme from '../../components/settings/chatTheme';

const Settings = () => {
    const { accountInfo } = useSelector(state => state.account);
    const [allSettings, setSettings] = useState({
        chatNotify: true,
        notifySound: true,
        callNotify: true,
        showAvatar: true,
        showOnlineStatus: true,
        showBirthday: true,
        showGender: true,
        systemSound: true
    })

    useEffect(() => {
        if (accountInfo){
            GetRequest(`${process.env.REACT_APP_URL}/settings/${accountInfo.data._id}`).then((response) => {
                if (response.data){
                    setSettings(response.data)
                }
            }).catch((error) => {
                console.log(error.data, "error getching user");
            });
        }
    },[accountInfo])

    function toggleHandler(body){
        PutRequest(`${process.env.REACT_APP_URL}/settings/${accountInfo.data._id}`, body).then((response) => {
            console.log("updated");
        }).catch((error) => {
            console.log(error.data, "error updating settings");
        });
    }
    return (
        <Layout className='max-w-[1000px]'>
            <div className='pt-[30px] lg:pt-[50px] pb-[50px]'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-[30px] mb-[30px]'>
                    <h3>General Settings</h3>
                </div>
                <Notifications 
                    settings={allSettings} 
                    setSettings={setSettings} 
                    toggleHandler={toggleHandler} 
                />
                <Profile
                    settings={allSettings} 
                    setSettings={setSettings} 
                    toggleHandler={toggleHandler} 
                />
                <Sound
                    settings={allSettings} 
                    setSettings={setSettings} 
                    toggleHandler={toggleHandler} 
                />
            </div>
            <div className='pt-[30px] pb-[50px]'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-[30px] mb-[30px]'>
                    <h3>Password Settings</h3>
                </div>
                <Password />
            </div>
            <div className='pt-[30px] lg:pt-[50px] pb-[50px]'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-[30px] mb-[30px]'>
                    <h3>Theme Settings</h3>
                </div>
                <ChatTheme />
                <LayoutTheme />
            </div>
        </Layout>
    )
}

export default Settings;