import { createSlice } from "@reduxjs/toolkit";

const initialState={
    image:null,
}

const imageSlice= createSlice({
    name:'image',
    initialState,
    reducers:{
        setImage(state,action){
            state.image=action.payload
            console.log(state.image);
        }
    }
})


export const { setImage }=imageSlice.actions;

export default imageSlice.reducer;