import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    currentRoom: "",
    messages: [],
    rooms: [],
    isConnected: false,
    transport: "",
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setCurrentRoom: (state, action) => {
            state.currentRoom = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setTransport: (state, action) => {
            state.transport = action.payload;
        },
    },
});

export const {
    setUsername,
    setCurrentRoom,
    setMessages,
    setRooms,
    addMessage,
    clearMessages,
    setIsConnected,
    setTransport,
} = chatSlice.actions;
export default chatSlice.reducer;
