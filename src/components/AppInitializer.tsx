import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import { fetchUserPermissions } from "../api/fetchUserPermissions";

const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const Permissions = useAppSelector((p) => p.Permissions.permissions);
  const path = useLocation();

  useEffect(() => {
    Permissions == null &&
     path.pathname.split("/")[1]!= "login" &&
      dispatch(fetchUserPermissions());
  }, [path.pathname]);

  return null;
};

export default AppInitializer;
