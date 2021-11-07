import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
    loading: 'idle',
    loggedIn: false,
    token: ''
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setLoading, setLoggedIn, setToken } = loginSlice.actions;

export const selectLoggedIn = (state) => state.loggedIn;
export default loginSlice.reducer;
