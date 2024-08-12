import React from 'react'
import SwitchButton from '../custom/switchButton';

const Sound = ({settings={}, setSettings=()=>{}, toggleHandler=()=>{}}) => {
    return (
        <div>
            <h5 className="mb-[20px] border-b">Sounds</h5>
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>System Sounds</span>
                    <p className='text-[14px]'>This will turn on system sounds!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton 
                        checked={settings.systemSound} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, systemSound: !settings.systemSound}))
                            toggleHandler({systemSound: !settings.systemSound})
                        }}
                    />
                </div>
            </div> 
            <div className='flex items-center justify-between'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Message Sounds</span>
                    <p className='text-[14px]'>This will turn on message sounds!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton
                        checked={settings.messageSound} 
                        onToggle={() => {
                            setSettings((prevState) => ({...prevState, messageSound: !settings.messageSound}))
                            toggleHandler({messageSound: !settings.messageSound})
                        }}
                    />
                </div>
            </div>
        </div> 
    )
}

export default Sound;