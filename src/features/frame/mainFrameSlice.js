import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentView: 'home',
    notifications: [],
    backdropOpen: false,
};

export const mainFrameSlice = createSlice({
    name: 'mainFrame',
    initialState,
    reducers: {
        changeCurrentView: (state, action) => {
            state.currentView = action.payload;
        },
        enqueueSnackbar: (state, action) => {
            state.notifications = [
                ...state.notifications,
                {
                    ...action.payload
                },
            ]
        },
        removeSnackbar: (state, action) => {
            state.notifications = state.notifications.filter(
                notification => notification.key !== action.payload,
            )
        },
        closeSnackbar: (state, action) => {
            state.notifications = state.notifications.map(
                notification => (notification.key === action.payload)
                ? { ...notification, dismissed: true }
                : { ...notification }
            )
        },
        setBackdropOpen: (state, action) => {
            state.backdropOpen = action.payload;
        },
    }
});

export const {
    changeCurrentView,
    enqueueSnackbar,
    removeSnackbar,
    closeSnackbar,
    setBackdropOpen
} = mainFrameSlice.actions;


export const selectCurrentView = (state) => state.mainFrame.currentView;
export const selectNotifications = (state) => state.mainFrame.notifications;
export const selectBackdropOpen = (state) => state.mainFrame.backdropOpen;

export default mainFrameSlice.reducer;
