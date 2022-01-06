import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    project: undefined
};

const diagramsSlice = createSlice({
    name: 'diagrams',
    initialState,
    reducers: {
        changeProject: (state, action) => {
            state.project = action.payload; 
        },
    }
});

export const {
    changeProject
} = diagramsSlice.actions;

export const selectProject = (state) => state.diagrams.project;

export default diagramsSlice.reducer;