import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import im from "../../images/test.jpg"
const initialState = {
    userName: 'guest',
    userImage: "",
    tittle: 'Bpmn Historias de Usuario'
};

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        changeuserName: (state, action) => {
            state.userName = action.payload;
        },
        changeTittle: (state, action) => {
            state.tittle = action.payload;
        }
    }
});

export const {changeuserName, changeTittle} = headerSlice.actions;

export const selectTittle = (state) => state.header.tittle;
export const selectUserName = (state) => state.header.userName;
export const selectUserImage = (state) => state.header.userImage;

export default headerSlice.reducer;