import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: undefined,
    name: '',
    desc: '',
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
        changeName: (state, action) => {
            state.name = action.payload; 
        },
        changeDesc: (state, action) => {
            state.desc = action.payload; 
        },
        changeId: (state, action) => {
            state.id = action.payload; 
        },
        loadData: (state, action) => {
            state.name = action.payload.name;
            state.desc = action.payload.desc;
            state.diagramPropierties = JSON.parse(action.payload.propierties);
            state.diagramXML = action.payload.xml;
        },
        cleanModeler: (state, action) => {
            state.id = undefined;
            state.name = '';
            state.desc = '';
            state.diagramPropierties = {'StartEvent_1': {}};
            state.diagramXML = '';
            state.url = 'http://localhost:8000/static/xml/start.bpmn.xml';
            state.selectedItem = ''; 

        },
    }
});

export const {
    changeDiagramXML,
    changeUrl,
    changeSelectedItem,
    changeArtifactPropierties,
    changeId,
    changeName,
    changeDesc,
    loadData,
    cleanModeler
} = modelerSlice.actions;

export const selectDiagramXML = (state) => state.modeler.diagramXML;
export const selectUrl = (state) => state.modeler.url;
export const selectSelectedItem = (state) => state.modeler.selectedItem;
export const selectDiagramPropierties = (state) => state.modeler.diagramPropierties;
export const selectId = (state) => state.modeler.id;
export const selectName = (state) => state.modeler.name;
export const selectDesc = (state) => state.modeler.desc;

export default modelerSlice.reducer;