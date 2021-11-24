import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    formData: {
        name: '',
        desc: ''
    }
}

export const projectFormSlice = createSlice({
    name: 'projectForm',
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
    }
});

export const { setFormData } = projectFormSlice.actions;

export const selectFormData = (state) => state.projectForm.formData;

export default projectFormSlice.reducer;