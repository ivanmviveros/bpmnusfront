import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import headerReducer from "../features/header/headerSlice";
import mainFrameReducer from "../features/frame/mainFrameSlice";
import tableReducer from "../features/table/tableSlice";
import loginReducer from "../features/login/loginSlice";
import counterReducer from "../features/counter/counterSlice";
import projectFormReducer from "features/projects/projectFormSlice";
import modelerReducer from "features/bpmn/modelerSlice";
import diagramsReducer from "features/diagrams/diagramsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    header: headerReducer,
    mainFrame: mainFrameReducer,
    table: tableReducer,
    login: loginReducer,
    projectForm: projectFormReducer,
    modeler: modelerReducer,
    diagrams: diagramsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});
