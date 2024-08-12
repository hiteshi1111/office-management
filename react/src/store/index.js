import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui-slice";
import accountReducer from "./account-slice";
import superAdminReducer from "./superadmin-slice";
import chatReducer from "./chat-slice";
import taskReducer from "./task-slice";
import eventReducer from "./event-slice";
import employeeReducer from "./employee-slice";
import notificationReducer from "./notification-slice";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        account: accountReducer,
        superadmin: superAdminReducer,
        chat: chatReducer,
        task: taskReducer,
        event: eventReducer,
        employee: employeeReducer,
        notification: notificationReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export default store;