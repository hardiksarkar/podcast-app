import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slices/userSlice";
import podcastReducer from "../Slices/podcastSlice";

const store = configureStore({
    reducer:{
        user:userReducer,
        podcasts:podcastReducer,
    },
})

export default store;