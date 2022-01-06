import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: undefined,
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
        changeArtifactPropierties: (state, action) => {
            const elementId = action.payload.id;
            const propierty = action.payload.propierty;
            const value = action.payload.value;
            if (state.diagramPropierties[elementId] === undefined)
                state.diagramPropierties[elementId] = {}
            state.diagramPropierties[elementId][propierty] = value
        },
        changeId: (state, action) => {
            state.id = action.payload; 
        },
    }
});

export const {
    changeDiagramXML,
    changeUrl,
    changeSelectedItem,
    changeArtifactPropierties,
    changeId
} = modelerSlice.actions;

export const selectDiagramXML = (state) => state.modeler.diagramXML;
export const selectUrl = (state) => state.modeler.url;
export const selectSelectedItem = (state) => state.modeler.selectedItem;
export const selectDiagramPropierties = (state) => state.modeler.diagramPropierties;
export const selectId = (state) => state.modeler.id;
export default modelerSlice.reducer;