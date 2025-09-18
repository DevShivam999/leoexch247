import React, { useState, useEffect } from "react";
import instance from "../services/AxiosInstance";
import Loading from "../components/Loading";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const getGameTypeName = (gameId: string): string => {
  switch (gameId) {
    case "4":
      return "Cricket";
    case "1":
      return "Tennis";
    case "2":
      return "Football";
    case "7":
      return "Horse";
    case "1101":
      return "iCasino";
    case "1102":
      return "WCO_(Casino)";
    case "4339":
      return "Greyhound";
    case "89278":
      return "Andar_Bahar";
    case "2378961":
      return "Roulette";
    case "-4":
      return "Exchange_Games";
    default:
      return `Game ID: ${gameId}`;
  }
};
const GameReport: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [accountType, setAccountType] = useState<string>("Game Report");
  const [gameTypeFilter, setGameTypeFilter] = useState<string>("All");
  const [clientType, _] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("2025-05-01");
  const [toDate, setToDate] = useState<string>("2025-05-30");
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const fetchGameReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await instance.get(
        `/user/gamereport?from=${fromDate}&to=${toDate}&lifetime=false&page=${page}&AccountType=${accountType}&clientType=${clientType}&gametype=${gameTypeFilter}`
      );
      setReportData(data);
    } catch (err: any) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "GameReport";
    fetchGameReportData();
  }, [page]);

  const handleLoadData = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    fetchGameReportData();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (reportData && page < reportData.totalPagesCount) {
      setPage(page + 1);
    }
  };

  const formatCurrency = (value = 0): string => {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getRoleName = (roles: string[]): string => {
    if (roles.includes("owner_admin")) return "Owner Admin";
    if (roles.includes("hyper-hyper")) return "Hyper Hyper";
    if (roles.includes("hyper")) return "Hyper";
    if (roles.includes("super-super")) return "Super Super";
    if (roles.includes("super-master")) return "Super Master";
    if (roles.includes("master")) return "Master";
    if (roles.includes("admin")) return "Admin";
    return "User";
  };

  return (
    <section className="mian-content">
      <div className="game-report-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Game Report</h1>
            </div>
          </div>
          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label htmlFor="accountType" className="lable-two">
                Account Type
              </label>
              <select
                id="accountType"
                className="form-select"
                aria-label="Account Type"
                value={accountType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAccountType(e.target.value)
                }
              >
                <option value="Game Report">Game Report</option>
                <option value="Balance Report">Balance Report</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="gameType" className="lable-two">
                Game Type
              </label>
              <select
                id="gameType"
                className="form-select"
                aria-label="Game Type"
                value={gameTypeFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setGameTypeFilter(e.target.value)
                }
              >
                <option value="All">All</option>
                <option value="Cricket">Cricket</option>
                <option value="Tennis">Tennis</option>
                <option value="Football">Football</option>
              </select>
            </div>
            {/* <div className="col-md-2 mb-3">
              <label htmlFor="clientType" className="lable-two">
                Client Type
              </label>
              <select
                id="clientType"
                className="form-select"
                aria-label="Client Type"
                value={clientType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setClientType(e.target.value)
                }
              >
                <option value="All">All</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Master">Master</option>
                <option value="Hyper">Hyper</option>
              </select>
            </div> */}
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
                onClick={(e) => handleLoadData(e)}
              >
                Load
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : reportData ? (
              <>
                <table className="table table-two">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Total Won</th>
                      <th>Total Loss</th>
                      <th>P/L</th>
                      <th>Upline P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.results.map((item: any) => (
                      <tr key={item._id.id}>
                        <td>{item._id.numeric_id}</td>
                        <td>{item._id.username}</td>
                        <td>{getRoleName(item._id.role)}</td>
                        <td className="text-success">
                          {formatCurrency(item.TotalWon)}
                        </td>
                        <td className="text-danger">
                          {formatCurrency(Math.abs(item.TotalLoss))}
                        </td>
                        <td
                          className={
                            item.PL >= 0 ? "text-success" : "text-danger"
                          }
                        >
                          {formatCurrency(item.PL)}
                        </td>
                        <td
                          className={
                            item.UplinePl >= 0 ? "text-success" : "text-danger"
                          }
                        >
                          {formatCurrency(item.UplinePl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="mx-3">
                    Page {page} of {reportData.totalPagesCount}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === reportData.totalPagesCount}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <section className="mian-content">
                <div className="container-fluid text-center mt-5">
                  <p>No game report data available.</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameReport;
