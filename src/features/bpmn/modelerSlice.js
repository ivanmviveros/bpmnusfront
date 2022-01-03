import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    diagramXML: '',
    url: 'http://localhost:8000/static/xml/start.bpmn.xml',
    selectedItem: '',
    diagramPropierties: {
        'StartEvent_1': {}
    }
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
        changeSelectedItem: (state, action) => { 
            state.selectedItem = action.payload; 
        },
        changeDiagramPropierties: (state, action) => {
            const elementId = action.payload.id;
            const propierty = action.payload.propierty;
            const value = action.payload.value;
            if (state.diagramPropierties[elementId] === undefined)
                state.diagramPropierties[elementId] = {}
            state.diagramPropierties[elementId][propierty] = value
        },
    }
});

export const {
    changeDiagramXML,
    changeUrl,
    changeSelectedItem,
    changeDiagramPropierties
} = modelerSlice.actions;

export const selectDiagramXML = (state) => state.modeler.diagramXML;
export const selectUrl = (state) => state.modeler.url;
export const selectSelectedItem = (state) => state.modeler.selectedItem;
export const selectDiagramPropierties = (state) => state.modeler.diagramPropierties;
export default modelerSlice.reducer;