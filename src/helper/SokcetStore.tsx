// socketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socketInstance = io(import.meta.env.VITE_Socket_Url, {
  transports: ["websocket"],
});

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: socketInstance,
  },
  reducers: {
    connectSocket: (state) => {
      state.socket.connect();
    },
    disconnectSocket: (state) => {
      state.socket.disconnect();
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
