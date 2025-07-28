import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorHandler from "../utils/ErrorHandle";
import ColorTd from "../components/ColorTd";
import Loading from "../components/Loading";

interface CommissionUser {
  match?: string;
  matchName?: string;
  user?: string;
}

interface CommissionData {
  MComm: number;
  SComm: number;
  TComm: number;
}

interface Commission {
  user: string | CommissionUser;
  userRole: string[];
  DENA_HAI: CommissionData;
  MILA_HAI: CommissionData;
  username: string;
}

const CommissionLoss = () => {
  const [data, setData] = useState<Commission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAppSelector((state: RootState) => state.changeStore.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();

  const [show, setshow] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const fetchCommissionData = async (userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = userId
        ? `/admin/commdata?parentId=${userId || user._id}`
        : "/admin/commdata";

      const { data: response } = await instance.get(endpoint);
      setData(response.data);
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
      setError("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserWiseData = async (userId: string) => {
    setLoading(true);
    setshow(true);
    try {
      const { data: response } = await instance.get(
        `/admin/commdatauserwise?id=${userId}`
      );
      setData(response.data);
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string, userRole: string[]) => {
    if (id) {
      if (userRole[0] !== "user") {
        updateQueryParam(userId);
      } else {
        fetchUserWiseData(userId);
      }
    } else {
      updateQueryParam(user._id);
    }
  };

  const updateQueryParam = (userId: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("id", userId);
    navigation(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const refreshData = () => {
    fetchCommissionData(id || undefined);
  };

  useEffect(() => {
    fetchCommissionData(id || undefined);
    return () => setshow(false);
  }, [location.search]);

  const getUserRoleName = (role: string[]) => {
    if (!role || role.length === 0) return "User";
    return role[0].charAt(0).toUpperCase() + role[0].slice(1).toLowerCase();
  };

  return (
    <section className="mian-content">
      <div className="commission-loss-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Client Commission Ledger</h1>
            </div>
          </div>

          <div className="row justify-content-between">
            <div className="col-md-2 mb-3">
              <button className="button-teen" onClick={refreshData}>
                <i className="fas fa-sync"></i> REFRESH
              </button>
            </div>
            <div className="col-md-2 mb-3 text-end">
              <button
                className="button-teen"
                data-bs-toggle="modal"
                data-bs-target="#all-resetlogModal"
              >
                <i className="far fa-file-alt"></i> All Reset Log
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-commission-loss">
              <thead>
                <tr>
                  <th style={{ width: "250px" }} rowSpan={2}>
                    Name
                  </th>
                  {show && (
                    <th style={{ width: "250px" }} rowSpan={2}>
                      Match
                    </th>
                  )}
                  <th colSpan={3} className="text-center">
                    MILA HAI (Received)
                  </th>
                  <th colSpan={3} className="text-center">
                    DENA HAI (Given)
                  </th>
                </tr>
                <tr>
                  <th>M.Comm</th>
                  <th>S.Comm</th>
                  <th>T.Comm</th>
                  <th>M.Comm</th>
                  <th>S.Comm</th>
                  <th>T.Comm</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td>
                      <Loading />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td>{error}</td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="container-div">
                          <span
                            onClick={() =>
                              handleUserClick(
                                typeof item.user === "string"
                                  ? item.user
                                  : item.user?.user || "",
                                item.userRole
                              )
                            }
                            style={{ cursor: "pointer" }}
                            className="user-link"
                          >
                            {item.username}
                            <small className="d-block text-muted">
                              {getUserRoleName(item.userRole)}
                            </small>
                          </span>
                          <span className="action-buttons">
                            <button className="link-btn">
                              <i className="far fa-file-alt"></i>
                            </button>
                            <button className="reset-btn">Reset</button>
                          </span>
                        </div>
                      </td>
                      {typeof item.user !== "string" &&
                        item.user?.matchName && (
                          <td>
                            <div className="container-div">
                              <span>{item.user.matchName}</span>
                            </div>
                          </td>
                        )}
                      <ColorTd amount={item.MILA_HAI?.MComm||0} />
                      <ColorTd amount={item.MILA_HAI?.SComm||0} />
                      <ColorTd amount={item.MILA_HAI?.TComm||0} />
                      <ColorTd amount={item.DENA_HAI?.MComm||0} />
                      <ColorTd amount={item.DENA_HAI?.SComm||0} />
                      <ColorTd amount={item.DENA_HAI?.TComm||0} />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No commission data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommissionLoss;
