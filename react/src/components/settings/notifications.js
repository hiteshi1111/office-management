import React, { useEffect } from 'react';
import SwitchButton from '../custom/switchButton';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../../store/notification-slice';

const Notifications = ({ settings = {}, setSettings = () => {}, toggleHandler = () => {} }) => {
    const dispatch = useDispatch();
    const { notificationMsg, chatNotify } = useSelector((state) => state.notification);

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }

        try {
            let permission = Notification.permission;
            if (permission === "denied") {
                dispatch(notificationActions.setChatNotify(false));
                dispatch(notificationActions.setNotificationMsg("Notifications are blocked. Please enable them in your browser settings."));
            } else if (permission === "granted") {
                dispatch(notificationActions.setChatNotify(true));
                dispatch(notificationActions.setNotificationMsg("Notifications are enabled. You can disable them in your browser settings."));
            } else {
                const newPermission = await Notification.requestPermission();
                if (newPermission === "granted") {
                    dispatch(notificationActions.setChatNotify(true));
                    dispatch(notificationActions.setNotificationMsg("Notifications are enabled. You can disable them in your browser settings."));
                } else {
                    dispatch(notificationActions.setChatNotify(false));
                    dispatch(notificationActions.setNotificationMsg("Notifications are blocked. Please enable them in your browser settings."));
                }
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
        }
    };

    useEffect(() => {
        const permission = Notification.permission;
        dispatch(notificationActions.setChatNotify(permission === "granted"));
        dispatch(notificationActions.setNotificationMsg(permission === "granted" ? "Notifications are enabled. You can disable them in your browser settings." : "Notifications are blocked. Please enable them in your browser settings."));
    }, [dispatch]);

    const handleNotification = () => {
        requestNotificationPermission();
    };

    return (
        <div className='mb-[30px]'>
            <h5 className="mb-[20px] border-b">Notifications</h5>
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Chat Notifications</span>
                    <p className='text-[14px]'>Receive push notifications for new messages</p>
                    <p className='text-[10px]'>{notificationMsg}</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton
                        checked={chatNotify}
                        onToggle={handleNotification}
                    />
                </div>
            </div>
            <div className='flex items-center justify-between mb-[15px]'>
                <div className='w-[70%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Notification Sound</span>
                    <p className='text-[14px]'>Play sounds for new messages</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton
                        checked={settings.notifySound}
                        onToggle={() => {
                            const newNotifySound = !settings.notifySound;
                            setSettings((prevState) => ({ ...prevState, notifySound: newNotifySound }));
                            toggleHandler({ notifySound: newNotifySound });
                        }}
                    />
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div className='w-[90%]'>
                    <span className='mb-[5px] text-[14px] font-semibold'>Show call notifications</span>
                    <p className='text-[14px]'>Receive push call notifications!</p>
                </div>
                <div className='w-[30%]'>
                    <SwitchButton
                        checked={settings.callNotify}
                        onToggle={() => {
                            const newCallNotify = !settings.callNotify;
                            setSettings((prevState) => ({ ...prevState, callNotify: newCallNotify }));
                            toggleHandler({ callNotify: newCallNotify });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Notifications;
