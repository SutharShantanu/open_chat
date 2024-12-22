import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        gender: "",
        profilePicture: "",
        joinedDate: "",
        isOnline: false,
    },
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            state.isLoggedIn = true;
        },
        updateUserProfile: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
        logoutUser: (state) => {
            state.userInfo = initialState.userInfo;
            state.isLoggedIn = false;
        },
    },
});

export const { setUserInfo, updateUserProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;
