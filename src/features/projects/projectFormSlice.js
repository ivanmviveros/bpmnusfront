import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    id: undefined,
    formData: {
        name: {value: '', error: false, helperText: ""},
        desc: {value: '', error: false, helperText: ""}
    }
}

export const projectFormSlice = createSlice({
    name: 'projectForm',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        cleanProjectForm: (state, action) => {
            state.id = undefined;
            state.formData = initialState.formData;
        }
    }
});

export const { 
    setFormData, 
    setId, 
    resetState,
    cleanProjectForm
} = projectFormSlice.actions;

export const selectFormData = (state) => state.projectForm.formData;
export const selectId = (state) => state.projectForm.id;

export default projectFormSlice.reducer;