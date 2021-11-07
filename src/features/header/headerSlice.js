import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import im from "../../images/test.jpg"
const initialState = {
    userName: 'Guest',
    userImage: "",
    tittle: 'Bpmn Historias de Usuario'
};

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        changeUserName: (state, action) => {
            state.userName = action.payload;
        },
        changeUserImage: (state, action) => {
            state.userImage = action.payload;
        },
        changeTittle: (state, action) => {
            state.tittle = action.payload;
        }
    }
});

export const {changeUserName, changeUserImage, changeTittle} = headerSlice.actions;

export const selectTittle = (state) => state.header.tittle;
export const selectUserName = (state) => state.header.userName;
export const selectUserImage = (state) => state.header.userImage;

export default headerSlice.reducer;