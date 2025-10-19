import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activePage: "dashboard",
    animate: false,
    isSpeakerOn: true,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setActivePage: (state, action) => {
            state.activePage = action.payload;
            if (action.payload !== "messages") {
                state.animate = false;
            }

        },
        setAnimate: (state, action) => {
            state.animate = action.payload;
        },
        setSpeaker: (state, action) => {
            state.isSpeakerOn = action.payload;
        },
    },
});

export const { setActivePage, setAnimate, setSpeaker } = dashboardSlice.actions;
export default dashboardSlice.reducer;
