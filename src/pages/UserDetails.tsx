import axios from "axios";

export interface UserData {
  username: string;
  name: string;
  parent: {
    username: string;
  };
  balance: number;
  siteUrl: string;
  bonusBalance: number;
  techAdmin: string;
  exposure: number;
  limit: number;
  referralCode: string;
  credit: number;
  roles: string[];
  exposerLimit: number;
  _id: string;
}
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../helper/store";
import UserProfile from "../components/UserProfile";
import UserProfileBetHistory from "../components/UserProfileBetHistory";
import UserProfileLedger from "../components/userProfileLedger";
import UserCasino from "../components/UserCasin";
import type { ActivityLogEntry, CurrentBet } from "../types/vite-env";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import DateInput from "../components/DateInput";
import Loading from "../components/Loading";
import BottomNav from "../components/BottomNav";
import SearchCom from "../components/SearchCom";

const UserDetails = () => {
  const [activeTab, setActiveTab] = useState<string>("LEDGER");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const LToDate = useRef<HTMLInputElement>(null);
  const LFromDate = useRef<HTMLInputElement>(null);
  const HToDate = useRef<HTMLInputElement>(null);
  const HFromDate = useRef<HTMLInputElement>(null);
  const [LPage, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [LEDGER, setLEDGER] = useState({ NAME: "", LEDGER: [], total: 1 });
  const [active, setActive] = useState<ActivityLogEntry[] | []>([]);
  const location = useLocation();

  const [betHistoryData, setBetHistoryData] = useState<{
    results: CurrentBet[];
    total: number;
    totallist: any;
  } | null>(null);
  const [betHistoryDataSearch, setBetHistoryDataSearch] = useState<{
    results: CurrentBet[];
    total: number;
    totallist: any;
  } | null>(null);
  const [casino, setCasino] = useState<{
    results: CurrentBet[];
    total: number;
    totallist: any;
  } | null>(null);
  const [betHistoryLoading, setBetHistoryLoading] = useState<boolean>(false);
  const [betHistoryError, setBetHistoryError] = useState<string | null>(null);

  const [betHistoryPage, setBetHistoryPage] = useState<number>(1);
  const [betHistoryStatus, setBetHistoryStatus] = useState<string>("All");

  const { id } = useParams();
  const betHistoryNumericId = Number(id);

  const dispatch = useDispatch();
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);
  const navigate = useNavigate();
  const fetchUserData = async (id: string): Promise<UserData> => {
    const API_URL = import.meta.env.VITE_Api_Url;
    try {
      const response = await axios.get<UserData>(`${API_URL}user/me`, {
        params: {
          numeric_id: id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData(String(id));
        setUserData(data);
      } catch (err) {
        ErrorHandler({
          err: error,
          dispatch,
          navigation: navigate,
          pathname: location.pathname,
          setError,
        });
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);
  const getBetHistoryData = async () => {
    try {
      setBetHistoryLoading(true);
      setBetHistoryError(null);
      const data = await fetchCurrentBets(String(id));
      setBetHistoryData(data);
      setBetHistoryDataSearch(data);
    } catch (err) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setBetHistoryLoading(false);
    }
  };

  const fetchCurrentBets = async (
    numeric_id: string
  ): Promise<{ results: CurrentBet[]; total: number; totallist: any }> => {
    const API_BASE_URL = import.meta.env.VITE_Api_Url;
    if (!API_BASE_URL) {
      console.error(
        "VITE_Api_Url is not defined in your environment variables."
      );
      throw new Error("API base URL is not configured.");
    }
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_Api_Url
        }betting/history?page=${betHistoryPage}&offset=0&limit=10&marketId=&eventId=${betHistoryStatus=="All"?"":betHistoryStatus}&matchId=&from=${HFromDate.current?.value || ""}&to=${HToDate.current?.value}`,
        {
          params: {
            numeric_id: numeric_id,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error fetching current bets: ${error.message}`);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          throw new Error(
            `Failed to fetch current bets: ${error.response.status} - ${
              error.response.data.message || "Server Error"
            }`
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("No response received from the server.");
        } else {
          console.error("Error setting up request:", error.message);
          throw new Error(`Error setting up the request: ${error.message}`);
        }
      } else {
        console.error("Unexpected error fetching current bets:", error);
        throw new Error("An unexpected error occurred.");
      }
    }
  };
  const fetchAccountStatement = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_Api_Url
        }user/account-statements?page=${LPage}&limit=${20}&numeric_id=${id}&txType=3&from=${LFromDate.current?.value || ""}&to=${LToDate.current?.value || ""}`,
        {
          headers: { Authorization: `Token ${token}`, _id: user._id },
        }
      );

      setLEDGER({
        NAME: response.data.username,
        LEDGER: response.data.results,
        total: response.data.totalPagesCount,
      });
      setLoading(false);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
        setError,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "BET-HISTORY") {
      getBetHistoryData();
    } else if (activeTab === "LEDGER") {
      fetchAccountStatement();
    } else if (activeTab === "CAS-Report") {
      const fetchAccountStatement = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_Api_Url
            }betting/history?page=1&offset=0&limit=10&reportType=casino`,
            {
              params: {
                numeric_id: betHistoryNumericId,
              },
            }
          );
          setCasino(response.data);
          setLoading(false);
        } catch (err) {
          ErrorHandler({
            err,
            dispatch,
            navigation: navigate,
            pathname: location.pathname,
            setError,
          });
          setLoading(false);
        }
      };
      fetchAccountStatement();
    } else if (activeTab === "ACTIVITY-LOGS") {
      const fetchAccountStatement = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_Api_Url}user/activitylogs?userId=${
              userData?._id
            }`
          );
          setActive(response.data);
          setLoading(false);
        } catch (err) {
          ErrorHandler({
            err,
            dispatch,
            navigation: navigate,
            pathname: location.pathname,
            setError,
          });
          setLoading(false);
        }
      };
      fetchAccountStatement();
    }
  }, [activeTab, betHistoryPage, betHistoryNumericId, LPage]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }
  const handleBetSearch = (e: string) => {
    const p = betHistoryDataSearch;
    setBetHistoryData(
      p
        ? {
            ...p,
            results: p?.results.filter((o) =>
              o.runnerName.toLowerCase().includes(e.toLowerCase())
            ),
          }
        : p
    );
  };

  return (
    <section className="mian-content">
      <div className="profile-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <Link to="/list-of-clients" className="modal-submit-btn">
                <i className="fa fa-arrow-left"></i> Back
              </Link>
            </div>
          </div>
        </div>
        <div className="profile-tabs-section">
          <ul
            className="nav nav-pills profile-tabs"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "PROFILE" ? "active" : ""
                }`}
                id="pills-PROFILE-tab"
                type="button"
                role="tab"
                aria-controls="pills-PROFILE"
                aria-selected={activeTab === "PROFILE"}
                onClick={() => handleTabClick("PROFILE")}
              >
                PROFILE
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "BET-HISTORY" ? "active" : ""
                }`}
                id="pills-BET-HISTORY-tab"
                type="button"
                role="tab"
                aria-controls="pills-BET-HISTORY"
                aria-selected={activeTab === "BET-HISTORY"}
                onClick={() => handleTabClick("BET-HISTORY")}
              >
                BET HISTORY
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "LEDGER" ? "active" : ""}`}
                id="pills-LEDGER-tab"
                type="button"
                role="tab"
                aria-controls="pills-LEDGER"
                aria-selected={activeTab === "LEDGER"}
                onClick={() => handleTabClick("LEDGER")}
              >
                LEDGER
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "ACTIVITY-LOGS" ? "active" : ""
                }`}
                id="pills-ACTIVITY-LOGS-tab"
                type="button"
                role="tab"
                aria-controls="pills-ACTIVITY-LOGS"
                aria-selected={activeTab === "ACTIVITY-LOGS"}
                onClick={() => handleTabClick("ACTIVITY-LOGS")}
              >
                ACTIVITY-LOGS
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "CAS-Report" ? "active" : ""
                }`}
                id="pills-CAS-Report-tab"
                type="button"
                role="tab"
                aria-controls="pills-CAS-Report"
                aria-selected={activeTab === "CAS-Report"}
                onClick={() => handleTabClick("CAS-Report")}
              >
                CAS.Report
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${
                activeTab === "PROFILE" ? "show active" : ""
              }`}
              id="pills-PROFILE"
              role="tabpanel"
              aria-labelledby="pills-PROFILE-tab"
              tabIndex={0}
            >
              {userData != null && <UserProfile userData={userData} />}
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "BET-HISTORY" ? "show active" : ""
              }`}
              id="pills-BET-HISTORY"
              role="tabpanel"
              aria-labelledby="pills-BET-HISTORY-tab"
              tabIndex={0}
            >
              <div className="pro-tabs-inner-content">
                <div className="container-fluid">
                  <div className="page-heading-box">
                    <h1 className="heading-one">BET HISTORY</h1>
                  </div>
                  <div className="profile-card-one">
                    <div className="profile-card-body">
                      <div className="row align-items-end">
                        <div className="col-md-2 mb-3">
                          <label htmlFor="chooseType" className="lable-two">
                            Choose Type
                          </label>
                          <select
                            className="form-select"
                            id="chooseType"
                            aria-label="Default select example"
                          >
                            <option defaultValue="All">All</option>
                            <option value="Matched">Matched</option>
                            <option value="Declare">Declare</option>
                            <option value="Delete">Delete</option>
                          </select>
                        </div>
                        <div className="col-md-2 mb-3">
                          <label htmlFor="marketType" className="lable-two">
                            Market Type
                          </label>
                          <select
                            className="form-select"
                            id="marketType"
                            aria-label="Default select example"
                            onChange={(e) =>
                              setBetHistoryStatus(e.target.value)
                            }
                          >
                            <option value="">All</option>
                            <option value="4">Cricket</option>
                            <option value="2">Tennis</option>
                            <option value="1">footbal</option>
                            <option value="">Virtual</option>
                            <option value="">Ball by Ball</option>
                          </select>
                        </div>
                        <DateInput label="From" ref={HFromDate} />
                        <DateInput label="To" ref={HToDate} />
                        <div className="col-md-2 mb-3">
                          <button
                            type="button"
                            className="dark-button"
                            onClick={() => getBetHistoryData()}
                          >
                            Load
                          </button>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <SearchCom
                          handleChange={handleBetSearch}
                          type="runnerName"
                        />
                      </div>
                      {betHistoryLoading ? (
                        <div className="text-center">
                          Loading bet history...
                        </div>
                      ) : betHistoryError ? (
                        <div className="text-center text-danger">
                          {betHistoryError}
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-four ">
                            <thead>
                              <tr>
                                <th>Event_Type</th>
                                <th>Event_Name</th>
                                <th>User_Name</th>
                                <th>Runner_Name</th>
                                <th>Bet_Type</th>
                                <th>User_Rate</th>
                                <th>Amount</th>
                                <th>Time</th>
                                <th>Match_Date</th>
                                <th>P&L</th>
                              </tr>
                            </thead>
                            {betHistoryData != null && (
                              <UserProfileBetHistory
                                userData={userData?.username ?? ""}
                                betHistoryData={betHistoryData}
                              />
                            )}
                          </table>
                        </div>
                      )}
                    </div>

                    <BottomNav
                      current={betHistoryPage}
                      total={betHistoryData?.total || 1}
                      LEDGER={betHistoryData?.results || []}
                      setPage={setBetHistoryPage}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "LEDGER" ? "show active" : ""
              }`}
              id="pills-LEDGER"
              role="tabpanel"
              aria-labelledby="pills-LEDGER-tab"
              tabIndex={0}
            >
              <div className="pro-tabs-inner-content">
                <div className="container-fluid">
                  <h1 className="heading-one">LEDGER</h1>
                  <div className="profile-card-one">
                    <div className="profile-card-body">
                      <div className="row align-items-end">
                        <div className="col-md-2 mb-3">
                          <label htmlFor="accountType" className="lable-two">
                            Account Type
                          </label>
                          <select
                            className="form-select"
                            id="accountType"
                            aria-label="Default select example"
                          >
                            <option defaultValue="All">All</option>
                            <option value="1">Balance Report</option>
                            <option value="2">Game Report</option>
                            <option value="3">Credit Reference</option>
                          </select>
                        </div>
                        <div className="col-md-2 mb-3">
                          <label htmlFor="gameName" className="lable-two">
                            Game Name
                          </label>
                          <select
                            className="form-select"
                            id="gameName"
                            aria-label="Default select example"
                          >
                            <option defaultValue="All">All</option>
                            <option value="1">Cricket</option>
                            <option value="2">Tennis</option>
                            <option value="3">Soccer</option>
                            <option value="3">Virtual</option>
                            <option value="3">Ball by Ball</option>
                          </select>
                        </div>
                        <DateInput label="From" ref={LFromDate} />
                        <DateInput label="To" ref={LToDate} />
                        <div className="col-md-2 mb-3">
                          <button
                            type="button"
                            onClick={() => fetchAccountStatement()}
                            className="dark-button"
                          >
                            Load
                          </button>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-four ">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Credit</th>
                              <th>Debit</th>
                              <th>Closing</th>
                              <th>Description</th>
                              <th>From/To</th>
                            </tr>
                          </thead>
                          {LEDGER != null && (
                            <UserProfileLedger
                              name={user.displayName}
                              LEDGER={LEDGER}
                            />
                          )}
                        </table>
                      </div>
                    </div>
                    <BottomNav
                      LEDGER={LEDGER.LEDGER}
                      current={LPage}
                      total={LEDGER.total}
                      setPage={setPage}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "ACTIVITY-LOGS" ? "show active" : ""
              }`}
              id="pills-ACTIVITY-LOGS"
              role="tabpanel"
              aria-labelledby="pills-ACTIVITY-LOGS-tab"
              tabIndex={0}
            >
              <div className="pro-tabs-inner-content">
                <div className="container-fluid">
                  <h1 className="heading-one">ACTIVITY-LOGS</h1>
                  <div className="profile-card-one">
                    <div className="profile-card-body">
                      <div className="table-responsive">
                        <table className="table table-four">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Date</th>
                              <th>Name</th>
                              <th>Login Status</th>
                              <th>IP Address</th>
                              <th>ISP</th>
                              <th>City/State/Country</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {active.length > 0 ? (
                              active.map((log, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    {new Date(log.updatedAt).toLocaleString(
                                      "en-IN",
                                      {
                                        timeZone: log.timezone,
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )}
                                  </td>
                                  <td>{log.name}</td>
                                  <td>{log.status}</td>
                                  <td>{log.ip}</td>
                                  <td>{log.org}</td>
                                  <td>
                                    {log.city},{log.region}
                                  </td>
                                  <td>{log.remark}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center">
                                  No activity logs available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "CAS-Report" ? "show active" : ""
              }`}
              id="pills-CAS-Report"
              role="tabpanel"
              aria-labelledby="pills-CAS-Report-tab"
              tabIndex={0}
            >
              <div className="pro-tabs-inner-content">
                <div className="container-fluid">
                  <h1 className="heading-one">Casino Report</h1>
                  <div className="profile-card-one">
                    <div className="profile-card-body">
                      <div className=" text-center">
                        <h4>
                          <span className="fa fa-history"></span> Game History
                        </h4>
                        {!userData ? (
                          <small>There is no data to display</small>
                        ) : (
                          <div className="profile-card-one">
                            <div className="profile-card-body">
                              {loading ? (
                                <div className="text-center">
                                  Loading bet history...
                                </div>
                              ) : error ? (
                                <div className="text-center text-danger">
                                  {error}
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <table className="table table-four ">
                                    <thead>
                                      <tr>
                                        <th>Event_Name</th>
                                        <th>User_Name</th>

                                        <th>Amount</th>
                                        <th>Time</th>
                                        <th>Match_Date</th>
                                      </tr>
                                    </thead>
                                    {casino != null && (
                                      <UserCasino
                                        userData={userData.username}
                                        casino={casino}
                                      />
                                    )}
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade modal-one addbonusModal"
        id="addbonusModal"
        tabIndex={-1}
        aria-labelledby="addbonusModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="addbonusModalLabel">
                Add Bonus
              </h1>
              <button
                type="button"
                className="modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-4 mb-3">
                  <label className="form-label">Amount</label>
                </div>
                <div className="col-8 mb-3">
                  <input
                    type="text"
                    className="mgray-input-box form-control text-end"
                    placeholder=""
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Remark</label>
                </div>
                <div className="col-8 mb-3">
                  <textarea
                    name=""
                    id=""
                    className="mgray-input-box form-control"
                    rows={
                      5
                    } 
                  ></textarea>
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Transaction Password</label>
                </div>
                <div className="col-8 mb-3">
                  <input
                    type="password"
                    className="mgray-input-box form-control text-end"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn modal-back-btn"
                data-bs-dismiss="modal"
              >
                <i className="fas fa-undo"></i> Back
              </button>
              <button type="button" className="btn modal-green-btn">
                Add Bonus <i className="fas fa-sign-in-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default UserDetails;
