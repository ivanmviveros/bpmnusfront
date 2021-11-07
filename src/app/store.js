import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import headerReducer from "../features/header/headerSlice";
import mainFrameReducer from "../features/frame/mainFrameSlice";
import tableReducer from "../features/table/tableSlice";
import loginReducer from "../features/login/loginSlice";
import counterReducer from "../features/counter/counterSlice";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    header: headerReducer,
    mainFrame: mainFrameReducer,
    table: tableReducer,
    login: loginReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});
