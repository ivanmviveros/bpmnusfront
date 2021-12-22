import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    diagramXML: '',
    url: 'http://localhost:8000/static/xml/start.bpmn.xml'
};

const modelerSlice = createSlice({
    name: 'modeler',
    initialState,
    reducers: {
        changeDiagramXML: (state, action) => {
            state.diagramXML = action.payload;
        },
        changeUrl: (state, action) => {
            state.url = action.payload;
        },
    }
});

export const {
    changeDiagramXML,
    changeUrl
} = modelerSlice.actions;

export const selectDiagramXML = (state) => state.modeler.diagramXML;
export const selectUrl = (state) => state.modeler.url;
export default modelerSlice.reducer;