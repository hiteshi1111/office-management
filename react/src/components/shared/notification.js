import { decrypt } from '../../utils/decryption';

const useshowNotification = (data, friend) => {
    const tag = `mantaraa-${data?.message?._id}`;
    const notification = new Notification(friend?.fullName, {
        body: decrypt(data?.message),
        icon: friend?.avatar,
        badge: friend?.avatar,
        vibrate: [200, 100, 200],
        dir: "rtl",
        renotify: true,
        tag: tag,
    });

    notification.onclick = () => {
        window.focus(); 
        window.location.href = 'https://demo.mantaraa.com/chat';
    };
};

const Notifications = {
    useshowNotification
}

export default Notifications;