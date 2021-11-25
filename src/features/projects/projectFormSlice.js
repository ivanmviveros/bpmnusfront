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
        resetState: (state, action) => {
            state = {
                ...state,
                formData: { ...initialState.formData}
            };
        },
    }
});

export const { setFormData, setId, resetState } = projectFormSlice.actions;

export const selectFormData = (state) => state.projectForm.formData;
export const selectId = (state) => state.projectForm.id;

export default projectFormSlice.reducer;