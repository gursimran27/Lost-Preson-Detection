import { combineReducers } from "@reduxjs/toolkit"

import imageReducer from "../Slices/imageSlice";


const rootReducer = combineReducers({

    image:imageReducer

});

export default rootReducer;