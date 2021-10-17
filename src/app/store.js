import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import headerReducer from '../features/header/headerSlice';
import mainFrameReducer from '../features/frame/mainFrameSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    header: headerReducer,
    mainFrame: mainFrameReducer,
  },
});
