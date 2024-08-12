import { useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { chatActions } from "../store/chat-slice";
import socket from ".";

const emitLogoutEvent = (userId) => {
    socket.emit("logout", userId);
};

const useOnlineOfflineEvents = (userId) => {
    const dispatch = useDispatch();
    const activityTimeoutRef = useRef(null);
    const isTabActiveRef = useRef(true);

    useEffect(() => {
        if (!userId) return;

        const emitOnlineEvent = (id) => socket.emit("new-user-add", id);
        const emitOfflineEvent = (id) => socket.emit("user-inactive", id);

        const handleActivity = () => {
            if (activityTimeoutRef.current) {
                clearTimeout(activityTimeoutRef.current);
            }
            emitOnlineEvent(userId);
            activityTimeoutRef.current = setTimeout(() => {
                if (isTabActiveRef.current) {
                    emitOfflineEvent(userId);
                }
            }, 180000); // 3 minute timeout
        };

        const handleFocus = () => {
            isTabActiveRef.current = true;
            handleActivity();
        };

        const handleBlur = () => {
            isTabActiveRef.current = false;
            emitOfflineEvent(userId); // Set user offline when tab is not active
        };

        emitOnlineEvent(userId);

        socket.on("get-users", (users) => {
            dispatch(chatActions.setOnlineUsers(users));
        });

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        // window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);

        handleActivity();

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            // window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            if (activityTimeoutRef.current) {
                clearTimeout(activityTimeoutRef.current);
            }
            socket.off("get-users");
        };
    }, [userId, dispatch]);

    useEffect(() => {
        const handleUnload = () => {
            if (userId) {
                socket.emit("user-inactive", userId);
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [userId]);
};

const socketEvents = {
    emitLogoutEvent,
    useOnlineOfflineEvents
};

export default socketEvents;
