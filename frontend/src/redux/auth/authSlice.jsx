import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
    accessToken: null,
    refreshToken: null,
    id: null,
    username: null,
    email: null,
    profile_picture: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.profile_picture = action.payload.profile_picture;
            state.isAuthenticated = true;
            state.error = null;
        },
        setNewToken:(state, action) =>{
            state.accessToken = action.payload.newAccessToken;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearAuthData(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.id = null;
            state.username = null;
            state.email = null;
            state.role = null;
            state.profile_picture = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => {
            return initialState;
        });
    }
});

export const { setAuthData, clearAuthData, setError, setLoading, setNewToken } = authSlice.actions;
export default authSlice.reducer;