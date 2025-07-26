import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { Tp } from "../utils/Tp";

const UserStatus = ({
  st,
  id,
  setUser,
  numeric,
  type = true,
}: {
  st: boolean;
  id: string;
  type: boolean;
  numeric:number
  setUser: React.Dispatch<any>;
}) => {
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const socket = useAppSelector((p: RootState) => p.socket.socket);
  const location = useLocation();
  const HandleUserStatus = async (id: string) => {
    try {
      await instance.post(`${type ? "user/status" : "user/bet-status"}`, {
        status: `${st ? 0 : 1}`,
        userId: id,
      });
            if (type&&st) {
        socket.emit("logout_user", {
          numeric_id: numeric,
        });
      }
      setUser((prev: any) => ({
        ...prev,
        [type ? "uSt" : "bSt"]: type ? (prev.uSt ? 0 : 1) : prev.bSt ? 0 : 1,
      }));
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    }
  };
  useEffect(() => {
    if (error) {
      Tp(error);
    }
  }, [error]);
  return (
    <span
      style={{ cursor: "pointer" }}
      onClick={() => HandleUserStatus(id)}
      className={`badge ${st ? "bg-success" : "bg-danger"}`}
    >
      {type ? (st ? "Active" : "Inactive") : st ? "On" : "Off"}
    </span>
  );
};

export default UserStatus;
