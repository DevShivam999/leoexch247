import { lazy, useEffect } from "react";
import Nav from "../components/Nav";
import Router from "../Routes";
import type { RootState } from "../helper/store";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import { useLocation, useNavigate } from "react-router-dom";
import { removeUser } from "../helper/Changes";
import { setLocation } from "../utils/setLocation";

const AppInitializer = lazy(() => import("../components/AppInitializer"));

function App() {
  const { socket } = useAppSelector((p: RootState) => p.socket);

  const dispatch = useAppDispatch();
  const user = useAppSelector((p:RootState)=>p.changeStore.user)
  const path = useLocation();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    setLocation(path.pathname);
    dispatch(removeUser());
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      handleAdminLogout();
      return;
    }

    const socketInstance = socket;

    socketInstance.on("connect", () => {
      console.log("Connected to socket server", socketInstance.id);
    });

    socketInstance.emit("connect_user", {
      userId: user.numeric_id,
    });

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      socketInstance.disconnect();
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [socket]);

  useEffect(() => {
    const socketInstance = socket;
    socketInstance.on("logout_from_admin", handleAdminLogout);
  }, [socket]);

  
  return (
    <main>
      {path.pathname.split("/")[1] !== "login" &&path.pathname.split("/")[1]!=="firstLogin"&&path.pathname.split("/")[1]!="TransactionPasswordSuccess"&& <Nav />}
      <AppInitializer />
      <Router />
    </main>
  );
}

export default App;
