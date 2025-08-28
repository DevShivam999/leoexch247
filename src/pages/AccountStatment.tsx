import { useEffect, useRef, useState } from "react";
import type {
  AccountStatementData,
  AccountStatementsApiResponse,
} from "../types/vite-env";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import SearchCom from "../components/SearchCom";
import DateInput from "../components/DateInput";

const AccountStatement = () => {
  const location = useLocation();
  const { id } = useParams();

  const user = useAppSelector((p: RootState) => p.changeStore.user);
  const numeric_id = id != user?.numeric_id ? id : user.numeric_id;

  const navigation = useNavigate();
  const dispatch = useDispatch();

  // filters
  const [accountType, setAccountType] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");

  // dates (default last 30 days)
  const dataFormate = (minus30: boolean) => {
    let d = new Date();
    if (minus30) d.setDate(d.getDate() - 30);
    return new Date(d).toISOString().split("T")[0];
  };
  const FromDate = useRef<HTMLInputElement | null>(null);
  const toDate = useRef<HTMLInputElement | null>(null);

  // table data
  const [accountStatements, setAccountStatements] = useState<
    AccountStatementData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const offset = (page - 1) * limit;

  // export helpers
  const exportPDF = async (data: any) => {
    const { PdfFile } = await import("../utils/PdfFile");
    await PdfFile(data, "AccountStatement");
  };
  const HandleExcel = async (data: any, st?: string) => {
    const ExcelFile = (await import("../utils/ExcelFile")).default;
    ExcelFile(data, st);
  };

  // modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any[] | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAccountStatements = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const base = "user/account-statements";
      const params = new URLSearchParams({
        page: String(page),
        offset: String(offset),
        limit: String(limit),
        numeric_id: id != user?.numeric_id ? String(id) : String(numeric_id),
        from: FromDate.current?.value || "",
        to: toDate.current?.value || "",
        sports: "",
      });

      if (id == user?.numeric_id) {
        if (accountType) params.set("type", accountType);
        if (gameName) params.set("sports", gameName);
      }

      const { data } = await instance.get<
        AccountStatementsApiResponse & {
          total?: number;
          page?: number;
          perPage?: number;
          totalPagesCount?: number;
        }
      >(`${base}?${params.toString()}`);

      setAccountStatements(data.results || []);

      // sync pagination with server response
      const srvTotal = Number(data.total ?? 0);
      const srvPerPage = Number((data as any).perPage ?? limit);
      const srvPage = Number((data as any).page ?? page);
      const srvTotalPages = Number(
        (data as any).totalPagesCount ??
          (srvPerPage > 0 ? Math.ceil(srvTotal / srvPerPage) : 1)
      );

      setTotal(srvTotal);
      setTotalPages(Math.max(1, srvTotalPages || 1));
      if (srvPerPage !== limit) setLimit(srvPerPage);
      if (srvPage !== page) setPage(srvPage);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
      setAccountStatements([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchBetDetails = async (
    Category: string,
    mid: string
  ): Promise<void> => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (Category === "QT") {
        const response = await instance.get(
          `getbets?numeric_id=${numeric_id}&marketId=${mid}`
        );
        setModalContent(response.data?.Tables?.orders ?? []);
      } else if (Category === "WCO") {
        const response = await instance.get(
          `betting/casino_history?numeric_id=${numeric_id}&marketId=${mid}`
        );
        setModalContent(response.data ?? []);
      } else {
        const data = await instance.get(
          `betting/current-bets?page=1&offset=0&limit=10&marketId=${mid}&matchId=&status=Success&numeric_id=${numeric_id}`
        );
        const result = (data.data?.results ?? []).map((p: any) => ({
          ...p,
          username: p?.user?.displayName ?? "",
          status: p?.status === "Loser" ? "Loss" : "Win",
          amount: p?.betAmount ?? 0,
          dateTime: p?.created,
          ip: p?.user_ip ?? "",
        }));
        setModalContent(result);
      }
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError: setModalError,
      });
      setModalContent(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDescriptionClick = (statement: AccountStatementData) => {
    const routeKey =
      (statement.category || "").trim() ||
      (statement.remarks || "").trim().split(/\s+/)[0] ||
      "";
    if (!routeKey || !statement.marketId) {
      setModalError("Missing category/marketId for this row.");
      setIsModalOpen(true);
      return;
    }
    fetchBetDetails(routeKey, statement.marketId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalError(null);
  };

  // init dates + first fetch
  useEffect(() => {
    document.title = "AccountStatement";
    if (FromDate.current) FromDate.current.value = dataFormate(true);
    if (toDate.current) toDate.current.value = dataFormate(false);
    fetchAccountStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when page/limit or filters (optional) change
  useEffect(() => {
    fetchAccountStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleLoadClick = (): void => {
    setPage(1); // restart at first page when filters applied
    fetchAccountStatements();
  };

  // client-side search (optional). For server-side, send `search` to API.
  const [search, setsearh] = useState("");
  useEffect(() => {
    if (search.trim() !== "") {
      setPage(1);
      setAccountStatements((p) =>
        p.filter((o) => o.remarks?.toLowerCase().includes(search.toLowerCase()))
      );
    } else {
      // when clearing search, refetch the current page from server
      fetchAccountStatements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const getFile = async (type = false) => {
    try {
      const response = await instance.get(
        `user/exports-data?type=Account-Statement&sports=&from=&to=`
      );
      if (type) {
        HandleExcel(response.data);
      } else {
        exportPDF(response.data);
      }
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

  // pagination footer numbers
  const fromRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const toRow = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <section className="mian-content">
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
                    modalContent[0]?.amount) ||
                    0}
                  ) (Total Count: {modalContent?.length || 0}) (Total Soda:
                  {(modalContent as any)?.totalSoda || 0})
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
                    <div className="spinner-border text-primary" role="status">
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
                          defaultChecked
                        />
                        <label className="form-check-label">All</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radioDefault"
                          id="Matched"
                        />
                        <label className="form-check-label">Matched</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radioDefault"
                          id="Deleted"
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
                              <tr key={betIndex} className="lay-bg">
                                <td>{user.displayName}</td>
                                <td>
                                  {bet?.user?.username ?? bet?.username ?? ""}
                                </td>
                                <td>
                                  {bet?.sessionRunner ?? bet?.runnerName ?? ""}
                                </td>
                                <td>{bet?.rate ?? bet?.roundId ?? ""}</td>
                                <td>{bet?.amount ?? 0}</td>
                                <td
                                  className={
                                    bet?.status
                                      ? bet.status !== "Loss"
                                        ? "text-success"
                                        : "text-danger"
                                      : (bet?.amount ?? 0) < 0
                                        ? "text-danger"
                                        : "text-success"
                                  }
                                >
                                  {bet?.status
                                    ? bet.status
                                    : (bet?.amount ?? 0) < 0
                                      ? "Loss"
                                      : "Win"}
                                </td>
                                <td>
                                  {bet?.dateTime
                                    ? new Date(bet.dateTime).toDateString()
                                    : ""}
                                </td>
                                <td>
                                  {bet?.dateTime
                                    ? new Date(bet.dateTime).toDateString()
                                    : ""}
                                </td>
                                <td>
                                  {(bet?.ip ?? "").replace("::ffff:", "")}
                                </td>
                                <td>{bet?.remarks ?? ""}</td>
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

      <div className="account-statement-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Account Statement</h1>
            </div>
          </div>

          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label className="lable-two">Account Type</label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={accountType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAccountType(e.target.value)
                }
              >
                <option value="">Select Report Type</option>
                <option value="WithdrawDeposit">
                  Deposite/Withdraw Reports
                </option>
                <option value="sport">Sport Reports</option>
                <option value="casino">Casino Reports</option>
              </select>
            </div>

            <div className="col-md-2 mb-3">
              <label className="lable-two">Game Name</label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={gameName}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setGameName(e.target.value)
                }
              >
                <option value="">All</option>
                <option value="4">Cricket</option>
                <option value="1">Football</option>
                <option value="99994">Kabaddi</option>
                <option value="2">Tennis</option>
                <option value="7">Horse Racing</option>
                <option value="11011">Casino</option>
                <option value="1102">Live Casino</option>
                <option value="2378961">Politics</option>
                <option value="89278">Rummy</option>
                <option value="4339">Greyhound Racing</option>
              </select>
            </div>

            <DateInput label="From" ref={FromDate} />
            <DateInput label="To" ref={toDate} />

            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={handleLoadClick}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load"}
              </button>
              <button
                type="button"
                onClick={() => getFile()}
                className="red-button"
              >
                <i className="far fa-file-pdf"></i> PDF
              </button>
              <button
                type="button"
                onClick={() => getFile(true)}
                className="green-button"
              >
                <i className="far fa-file-excel"></i> Excel
              </button>
            </div>
          </div>

          <div className="row ">
            <div className="col-6 mb-3">
              <div className="select-box">
                <label>Show</label>
                <select
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="form-select"
                  aria-label="Default select example"
                  value={limit}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
                <label>entries</label>
              </div>
            </div>

            <SearchCom handleChange={setsearh} type="Search" />
          </div>

          {loading && <Loading />}
          {error && <div className="alert alert-danger my-3">{error}</div>}

          {!loading && !error && (
            <>
              <div className="table-responsive">
                <table className="table table-two">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Closing</th>
                      <th>Description</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountStatements.length > 0 ? (
                      accountStatements.map((statement, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(statement.created).getDate()}-
                            {new Date(statement.created).getMonth() + 1}-
                            {new Date(statement.created).getFullYear()}
                          </td>
                          <td
                            style={{
                              color:
                                statement.txType === "CR" ? "green" : "red",
                            }}
                          >
                            {statement.txType === "CR"
                              ? statement.amount
                              : "0.00"}
                          </td>
                          <td
                            style={{
                              color:
                                statement.txType === "DR" ? "red" : "green",
                            }}
                          >
                            {statement.txType === "DR"
                              ? statement.amount
                              : "0.00"}
                          </td>
                          <td>{statement.balance.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="Description-btn"
                              onClick={() => handleDescriptionClick(statement)}
                            >
                              {statement.category}
                            </button>
                          </td>
                          <td>{statement.remarks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No account statements found for the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                <div className="text-muted small mb-2">
                  {total > 0 ? (
                    <>
                      Showing <strong>{fromRow}</strong> to{" "}
                      <strong>{toRow}</strong> of <strong>{total}</strong>{" "}
                      entries
                    </>
                  ) : (
                    <>No entries</>
                  )}
                </div>

                <nav aria-label="AccountStatement pagination" className="mb-2">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage(1)}
                        aria-label="First"
                      >
                        «
                      </button>
                    </li>
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous"
                      >
                        Prev
                      </button>
                    </li>

                    <li className="page-item disabled">
                      <span className="page-link">
                        Page {page} of {totalPages}
                      </span>
                    </li>

                    <li
                      className={`page-item ${page >= totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        aria-label="Next"
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${page >= totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(totalPages)}
                        aria-label="Last"
                      >
                        »
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountStatement;
