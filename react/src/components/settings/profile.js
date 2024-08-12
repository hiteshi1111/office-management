import React from 'react'
import SwitchButton from '../custom/switchButton';

const Profile = ({settings={}, setSettings=()=>{}, toggleHandler=()=>{}}) => {
    return (
        <div className='mb-[30px]'>
            <h5 className="mb-[20px] border-b">Profile</h5>
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Show Profile Picture</span>
                    <p className='text-[14px]'>You can still see your profile picture while others can't!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton 
                        checked={settings.showAvatar} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, showAvatar: !settings.showAvatar}))
                            toggleHandler({showAvatar: !settings.showAvatar})
                        }}
                    />
                </div>
            </div> 
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Show Online Status</span>
                    <p className='text-[14px]'>Others can see when you are online!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton
                        checked={settings.showOnlineStatus} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, showOnlineStatus: !settings.showOnlineStatus}))
                            toggleHandler({showOnlineStatus: !settings.showOnlineStatus})
                        }}
                    />
                </div>
            </div> 
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Show Birthday</span>
                    <p className='text-[14px]'>Keep it on so that we can arrange a party for you! ;)</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton 
                        checked={settings.showBirthday} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, showBirthday: !settings.showBirthday}))
                            toggleHandler({showBirthday: !settings.showBirthday})
                        }}
                    />
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Show Gender</span>
                    <p className='text-[14px]'>You can hide your true identity. Hehe!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton 
                        checked={settings.showGender} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, showGender: !settings.showGender}))
                            toggleHandler({showGender: !settings.showGender})
                        }}
                    />
                </div>
            </div>
        </div> 
    )
}

export default Profile