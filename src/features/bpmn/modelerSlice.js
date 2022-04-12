import { createSlice } from '@reduxjs/toolkit';
import { API_URL } from "utils";


const initialState = {
    id: undefined,
    formData: {
        name: {value: '', error: false, helperText: ""},
        desc: {value: '', error: false, helperText: ""}
    },
    diagramXML: '',
    url: `${API_URL}/static/xml/start.bpmn.xml`,
    selectedItem: '',
    diagramPropierties: {
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
        deleteArtifactPropierties: (state, action) => {
            const aux = { ...state.diagramPropierties };
            delete aux[action.payload]
            state.diagramPropierties = aux;
        },
        changeId: (state, action) => {
            state.id = action.payload; 
        },
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        loadData: (state, action) => {
            state.formData = {
                name: {value: action.payload.name, error: false, helperText: ""},
                desc: {value: action.payload.desc, error: false, helperText: ""}
            };
            state.diagramPropierties = JSON.parse(action.payload.propierties);
            state.diagramXML = action.payload.xml;
        },
        cleanModeler: (state, action) => {
            state.id = undefined;
            state.formData = {
                name: {value: '', error: false, helperText: ""},
                desc: {value: '', error: false, helperText: ""}
            };
            state.diagramPropierties = {'StartEvent_1': {}};
            state.diagramXML = '';
            state.url = `${API_URL}/static/xml/start.bpmn.xml`;
            state.selectedItem = ''; 

        },
        changeSelectedItemName: (state, action) => {
            state.selectedItem.businessObject.name = action.payload; 
        },
    }
});

export const {
    changeDiagramXML,
    changeUrl,
    changeSelectedItem,
    changeArtifactPropierties,
    changeId,
    loadData,
    cleanModeler,
    setFormData,
    changeSelectedItemName,
    deleteArtifactPropierties
} = modelerSlice.actions;

export const selectDiagramXML = (state) => state.modeler.diagramXML;
export const selectUrl = (state) => state.modeler.url;
export const selectSelectedItem = (state) => state.modeler.selectedItem;
export const selectDiagramPropierties = (state) => state.modeler.diagramPropierties;
export const selectFormData = (state) => state.modeler.formData;
export const selectId = (state) => state.modeler.id;
export const selectDesc = (state) => state.modeler.desc;

export default modelerSlice.reducer;