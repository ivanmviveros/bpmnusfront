import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentView: 'home'
};

export const mainFrameSlice = createSlice({
    name: 'mainFrame',
    initialState,
    reducers: {
        changeCurrentView: (state, action) => {
            state.currentView = action.payload;
        },
    }
});

export const {changeCurrentView} = mainFrameSlice.actions;


export const selectCurrentView = (state) => state.mainFrame.currentView;

export default mainFrameSlice.reducer;
