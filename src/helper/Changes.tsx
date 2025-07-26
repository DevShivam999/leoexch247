import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user");
const completeUser = user ? JSON?.parse(user || "") : "";

const token = localStorage.getItem("token");
const completeToken = token ? JSON?.parse(token || "") : "";

const initialState = {
  showNav: true,
  user: completeUser,
  token: completeToken,
};

const changesSlice = createSlice({
  name: "changes",
  initialState,
  reducers: {
    toggleNav: (state) => {
      state.showNav = !state.showNav;
    },
    removeUser: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
    setToken: (state, Payload) => {
      state.token = Payload.payload.token;
    },
    setUser: (state, Payload) => {
      state.user = Payload.payload.user;
    },
  },
});

export const { toggleNav, removeUser, setToken, setUser } =
  changesSlice.actions;
export default changesSlice.reducer;
