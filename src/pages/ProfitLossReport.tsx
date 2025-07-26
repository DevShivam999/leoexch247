import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import type { ProfitLossReportData } from "../types/vite-env";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { RoleSwitch } from "../utils/RoleSwitch";

const ProfitLossReport: React.FC = () => {
  const [reportData, setReportData] = useState<ProfitLossReportData[] | null>(
    null
  );
  const [reportData2, setReportData2] = useState<ProfitLossReportData[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchClientName, setSearchClientName] = useState<string>("");
  const [sportType, setSportType] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("2025-05-23");
  const [toDate, setToDate] = useState<string>("2025-05-30");
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [status, setstatus] = useState("All");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchProfitLossData = async () => {
    if (!user.numeric_id || !user._id || !token) {
      console.error("User or token data missing from localStorage.");
      navigate("/login");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    try {
      const url = `${
        import.meta.env.VITE_Api_Url
      }user/summaries?page=1&limit=20&status=settled&gameType=${sportType}&duration=45&numeric_id=${
        id || user.numeric_id
      }&from=${fromDate}&to=${toDate}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
          _id: user._id,
        },
      });
      setReportData(response.data.results);
      setReportData2(response.data.results);
    } catch (err: any) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setstatus("All")
    setModalError(null);
  };
  useEffect(() => {
    document.title = "ProfitLossReport";
    fetchProfitLossData();
  }, [location.search]);
  useEffect(() => {
    if (!reportData2) return;

    if (!searchClientName.trim()) {
      setReportData(reportData2);
      return;
    }

    const data = reportData2.filter((p) =>
      p._id.username.toLowerCase().includes(searchClientName.toLowerCase())
    );

    setReportData(data);
  }, [searchClientName]);

  const handleLoadData = () => {
    fetchProfitLossData();
  };

  const [numeric_id,setnumeric_id]=useState(0)
  const addIdToQuery = (id: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("id", id.toString());

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  const onuserClick = async (userdata: number) => {
    setIsModalOpen(true);

    await fetchProfitLossData2(userdata);
  };
  const fetchProfitLossData2 = async (userdata: number, isDelete = false) => {
    setModalLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_Api_Url
        }betting/getBettingHistoryPL?page=1&offset=0&limit=10&marketId=&matchId=`,
        {
          params: {
            numeric_id: userdata,
            isDeleted: isDelete,
          },
        }
      );
      setModalLoading(false);
      setModalContent(response.data.results);
      setnumeric_id(response.data.numeric_id)
    } catch (err: any) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
        setError,
      });
      setModalLoading(false);
    }
  };

  const anotherUserClick = async (userdata: ProfitLossReportData) => {
    addIdToQuery(userdata._id.numeric_id);
  };

  if (loading) {
    return (
      <section className="mian-content">
        <Loading />
      </section>
    );
  }

  if (error) {
    return <section className="mian-content">Error: {error}</section>;
  }

  return (
    <section className="mian-content">
      <div className="profit-and-loss-page">
        {isModalOpen && (
          <div
            className="modal fade show exposure-modal modal-one"
            style={{ display: "block" }}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="ExposureModalLabel"
            aria-modal="true"
          >
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title" id="ExposureModalLabel">
                    Client Ledger (Total Win Loss:
                    {(modalContent &&
                      modalContent.length > 0 &&
                      modalContent[0].amount) ||
                      (modalContent &&
                        modalContent.length > 0 &&
                        modalContent[0].amount) ||
                      0}
                    ) (Total Count: {modalContent?.length || 0}) (Total Soda:
                    {modalContent?.totalSoda || 0})
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  {modalLoading && (
                    <div className="text-center my-3">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          <Loading />
                        </span>
                      </div>
                      <p>Loading bet details...</p>
                    </div>
                  )}
                  {modalError && (
                    <div className="alert alert-danger my-3">{modalError}</div>
                  )}

                  {!modalLoading && !modalError && modalContent && (
                    <>
                      <div className="d-flex gap-2 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radioDefault"
                            id="All"
                            checked={status == "All"}
                            onClick={() => (
                              fetchProfitLossData2(numeric_id),
                              setstatus("All")
                            )}
                          />
                          <label className="form-check-label">All</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radioDefault"
                            id="Matched"
                            checked={status == "Matched"}
                            onClick={() => (
                              fetchProfitLossData2(numeric_id),
                              setstatus("Matched")
                            )}
                          />
                          <label className="form-check-label">Matched</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radioDefault"
                            id="Deleted"
                            checked={status == "Delete"}
                            onClick={() => (
                              fetchProfitLossData2(numeric_id, true),
                              setstatus("Delete")
                            )}
                          />
                          <label className="form-check-label">Deleted</label>
                        </div>
                      </div>

                      <div className="">
                        <table className="table table-lay-black-one">
                          <thead>
                            <tr>
                              <th>Uplevel</th>
                              <th>UserName</th>
                              <th>Nation</th>
                              <th>Userrate</th>
                              <th>Amount</th>
                              <th>Win/Loss</th>
                              <th>Place Date</th>
                              <th>Match Date</th>
                              <th>IP</th>
                              <th>Browser Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalContent.length > 0 ? (
                              modalContent.map((bet: any, betIndex: number) => (
                                <tr
                                  key={betIndex}
                                  className={`${bet.orderType == "Lay" ? "lay-bg" : "black-bg"}`}
                                >
                                  <td>{bet?.refUser?.username || ""}</td>
                                  <td>{bet.user.username}</td>
                                  <td>{bet.matchName}</td>
                                  <td></td>
                                  <td>{bet.amount}</td>
                                  <td
                                    className={
                                      bet.txType == "DR"
                                        ? "text-danger"
                                        : "text-success"
                                    }
                                  >
                                    {bet.txType != "CR" ? "Loss" : "Win"}
                                  </td>
                                  <td>
                                    {new Date(bet.created).toDateString()}
                                  </td>
                                  <td>
                                    {new Date(bet.created).toDateString()}
                                  </td>
                                  <td></td>
                                  <td>{bet.remarks}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={10} className="text-center">
                                  No bet details found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Profit Loss</h1>
            </div>
          </div>
          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label htmlFor="searchClient" className="lable-two">
                Search By Client Name
              </label>
              <input
                id="searchClient"
                type="text"
                className="form-control"
                placeholder="Search User Name"
                value={searchClientName}
                onChange={(e) => setSearchClientName(e.target.value)}
              />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="sportType" className="lable-two">
                Sport Type
              </label>
              <select
                id="sportType"
                className="form-select"
                aria-label="Default select example"
                value={sportType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSportType(e.target.value)
                }
              >
                <option value="">All</option>
                <option value="4">Cricket</option>
                <option value="2">Tennis</option>
                <option value="1">Soccer</option>
                <option value="1101">Casino</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="fromDate" className="lable-two">
                From
              </label>
              <input
                id="fromDate"
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFromDate(e.target.value)
                }
              />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="toDate" className="lable-two">
                To
              </label>
              <input
                id="toDate"
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setToDate(e.target.value)
                }
              />
            </div>
            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={handleLoadData}
              >
                Load
              </button>
            </div>
          </div>
          <div>
            <table className="table table-two">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Percentage [%]</th>
                  <th>myP/L</th>
                  <th>Profit & Loss</th>
                  {/* <th>Balance</th> */}
                  {/* <th>Tx Type</th>
                                    <th>Created Date</th> */}
                </tr>
              </thead>
              <tbody>
                {reportData &&
                  reportData.length > 0 &&
                  reportData.map((transaction) => (
                    <tr key={transaction._id.id}>
                      <td
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          transaction._id.role[0] == "user"
                            ? onuserClick(transaction._id.numeric_id)
                            : anotherUserClick(transaction)
                        }
                      >
                        {transaction._id.username}
                      </td>
                      <td>{RoleSwitch(transaction._id.role[0])}</td>
                      <td>{transaction.percentage}</td>
                      <td
                        className={
                          transaction.PL < 0 ? "text-red" : "text-green"
                        }
                      >
                        {transaction.PL.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td
                        className={
                          transaction.UplinePl < 0 ? "text-red" : "text-green"
                        }
                      >
                        {transaction.UplinePl.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      {/* <td className={transaction.balance < 0 ? 'text-red' : 'text-green'}>
                                            {transaction.balance.toLocaleString('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td> */}
                      {/* <td>{transaction.txType}</td>
                                        <td>{new Date(transaction.created).toLocaleString()}</td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfitLossReport;
