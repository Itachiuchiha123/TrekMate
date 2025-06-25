import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activePage: "dashboard", // Default page
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setActivePage: (state, action) => {
            state.activePage = action.payload;
        },
    },
});

export const { setActivePage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
