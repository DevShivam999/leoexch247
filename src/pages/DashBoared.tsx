import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../helper/store";
import Loading from "../components/Loading";
import type { DashBoardType } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import { setIsActive } from "../helper/IsActiveSlice"

const DashBoard = () => {
  const [User, setuser] = useState({
    active_user: 6,
    inactive_user: 0,
    online_users: 0,
    total_user: 6,
  });
  const [balance, setbalance] = useState<DashBoardType | null>(null);

  const navigation = useNavigate();
  const [click, setclick] = useState(true);
  const { socket } = useAppSelector((p: RootState) => p.socket);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = "DashBoard";
    socket.emit("dashboard");
    socket.on(
      "dashboard",
      (data: {
        active_user: number;
        inactive_user: number;
        online_users: number;
        total_user: number;
      }) => {
        setuser(data);
      }
    );
  }, [socket, click]);

  const ApiBalance = async () => {
    try {
      const data = await instance.get(`betting/dashboard_wallet`);
      setbalance(data.data.data);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    }
  };

  useEffect(() => {
    ApiBalance();
  }, []);

  if (!error && !balance) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="main-layout">
      <section className="mian-content">
        <div className="dashboard-page">
          <div className="container-fluid">
            <div className="page-heading">
              <div className="page-heading-box">
                <h1 className="heading-one">Dashboard</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-green">
                  <div className="deshboard-body justify-content-between">
                    <div>
                      <p className="mb-0 text-secondary">Active User</p>
                      <h3 className="my-1">
                        {User.active_user} <i className="fas fa-sync"></i>
                      </h3>
                      <Link
                        to="list-of-clients"
                        onClick={() => {
                          setclick((p) => !p);
                          dispatch(setIsActive(true))
                        }}
                        className=""
                      >
                        Click here
                      </Link>
                    </div>
                    <div className="widgets-icons-2 widgets-icons">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-blue">
                  <div className="deshboard-body justify-content-between">
                    <div>
                      <p className="mb-0 text-secondary">Online User</p>
                      <h3 className="my-1">
                        {User.online_users} <i className="fas fa-sync"></i>
                      </h3>
                      <Link
                        to="/online-users"
                        onClick={() => setclick((p) => !p)}
                        className=""
                      >
                        Click here
                      </Link>
                    </div>
                    <div className="widgets-icons-2 widgets-icons">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-red">
                  <div className="deshboard-body justify-content-between">
                    <div>
                      <p className="mb-0 text-secondary">InActive User</p>
                      <h3 className="my-1">
                        {User.inactive_user}
                        <i className="fas fa-sync"></i>
                      </h3>
                      <Link
                        to="list-of-clients"
                         onClick={() => {
                          setclick((p) => !p);
                          dispatch(setIsActive(false))
                        }}
                        className=""
                      >
                        Click here
                      </Link>
                    </div>
                    <div className="widgets-icons-2 widgets-icons">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-green">
                  <div className="deshboard-body">
                    <ul className="Dashboard-card-ul">
                      <li>
                        <span>Upper Level Credit Referance:</span>
                        <span>{balance?.UpperlevelCreditRef}</span>
                      </li>
                      <li>
                        <span>Total Master Balance:</span>
                        <span>{balance?.TotalMasterBal}</span>
                      </li>
                      <li>
                        <span>Available Balance:</span>
                        <span>{balance?.AvailableBalance}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-blue">
                  <div className="deshboard-body">
                    <ul className="Dashboard-card-ul">
                      <li>
                        <span>Down Level Occupy Balance:</span>
                        <span>{balance?.DownLevelOccupyBal}</span>
                      </li>
                      <li>
                        <span>Upper Level:</span>
                        <span>{balance?.UpperLevel}</span>
                      </li>
                      <li>
                        <span>Available Balance With Profit/Loss:</span>
                        <span>{balance?.AvailableBalWPL}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="dashboard-card card-red">
                  <div className="deshboard-body">
                    <ul className="Dashboard-card-ul">
                      <li>
                        <span>Down Level Credit Referance:</span>
                        <span>{balance?.DownLevelCreditRef}</span>
                      </li>
                      <li>
                        <span>Down Level Profit/Loss:</span>
                        <span>{balance?.DownLevelPL}</span>
                      </li>
                      <li>
                        <span>My Profit/Loss:</span>
                        <span>{balance?.MyPL}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashBoard;
