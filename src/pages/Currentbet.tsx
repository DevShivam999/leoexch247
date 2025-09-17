import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import type { BetData } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import SearchCom from "../components/SearchCom";
import { success } from "../utils/Tp";

export const formatDateTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (e) {
    console.error("Error parsing date:", dateTimeString, e);
    return dateTimeString;
  }
};

const CurrentBet: React.FC = () => {
  const [betType, setBetType] = useState<string>("All");
  const [marketType, setMarketType] = useState<string>("All");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [activeTab, setActiveTab] = useState<"SPORTS" | "CASINO">("SPORTS");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [allBets, setAllBets] = useState<BetData[]>([]);
  const [currentBets, setCurrentBets] = useState<BetData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

  const socket = useAppSelector((p: RootState) => p.socket);
  const navigation = useNavigate();
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);
  const dispatch = useDispatch();

  // --- Select All checkbox (with indeterminate)
  const headerCbRef = useRef<HTMLInputElement>(null);
  const allChecked = useMemo(
    () => currentBets.length > 0 && currentBets.every((b) => !!b.isSelect),
    [currentBets]
  );
  const someChecked = useMemo(
    () =>
      currentBets.length > 0 &&
      currentBets.some((b) => !!b.isSelect) &&
      !currentBets.every((b) => !!b.isSelect),
    [currentBets]
  );
  useEffect(() => {
    if (headerCbRef.current) {
      headerCbRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);
  // -------------------------------------------

  const fetchCurrentBets = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !token) {
        navigation("/login");
        return;
      }

      const offset = (page - 1) * limit;

      const response = await instance.get(
        `betting/current-bets?page=${page}&offset=${offset}&limit=${limit}&numeric_id=${user.numeric_id}`
      );

      const fetchedData: BetData[] = response.data.results || [];
      // reset selection flags on fresh fetch to avoid stale selections
      setAllBets(fetchedData.map((b) => ({ ...b, isSelect: false })));

      // server pagination (fallback if not provided)
      const srvTotal = Number(response.data.total ?? 0);
      const srvPerPage = Number(response.data.perPage ?? limit);
      const srvPage = Number(response.data.page ?? page);
      const srvTotalPages = Number(
        response.data.totalPagesCount ??
          (srvPerPage ? Math.ceil(srvTotal / srvPerPage) : 1)
      );

      if (!Number.isNaN(srvTotal)) setTotal(srvTotal);
      if (!Number.isNaN(srvPerPage)) setLimit(srvPerPage);
      if (!Number.isNaN(srvPage)) setPage(srvPage);
      if (!Number.isNaN(srvTotalPages))
        setTotalPages(Math.max(1, srvTotalPages || 1));

      setHasLoadedData(true);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
      setAllBets([]);
      setCurrentBets([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  type BetAction = "delete" | "void";

  const handleBetAction = (
    action: BetAction,
    id: string,
    oddsType: string,
    orderId: string | null
  ) => {
    socket.socket.emit("deleteBetsOrders", {
      matchId: id,
      oddsType,
      selectionId: null,
      type: action, // "delete" or "void"
      orderId,
    });
  };

  const applyFiltersToData = (data: BetData[]) => {
    let filtered = [...data];

    if (betType !== "All") {
      filtered = filtered.filter((bet) =>
        betType === "Matched" ? (bet as any).status === "matched" : true
      );
    }

    if (marketType !== "All") {
      filtered = filtered.filter((bet: BetData) => {
        switch (marketType) {
          case "Matchodds":
            return (
              bet.oddsType === "Match Odds" || bet.oddsType === "Matchodds"
            );
          case "To Win Toss":
            return bet.oddsType === "To Win Toss";
          case "Bookmaker":
            return bet.oddsType === "BOOKMAKER" || bet.oddsType === "Bookmaker";
          case "Fancy":
            return bet.oddsType === "Fancy";
          default:
            return true;
        }
      });
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((bet: BetData) =>
        bet.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCurrentBets(filtered);
  };

  const handleLoadClick = () => {
    setPage(1);
    fetchCurrentBets();
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    if (allBets.length > 0) {
      applyFiltersToData(allBets);
    }
  };

  useEffect(() => {
    fetchCurrentBets();

    // refresh after server confirms row action
    socket.socket.on("deleteBetsOrders", (data: any) => {
      if (data?.status) {
        fetchCurrentBets();
      }
    });

    const remove = setInterval(() => {
      fetchCurrentBets();
    }, 15000);

    return () => {
      clearInterval(remove);
      socket.socket.off("deleteBetsOrders");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIndividualBetSelect = (betId: string) => {
    setCurrentBets((prev) =>
      prev.map((bet) =>
        bet._id === betId ? { ...bet, isSelect: !bet.isSelect } : bet
      )
    );
  };

  // Delete all selected rows in the current view
  const handleAllDelete = () => {
    try {
      const selected = currentBets.filter((b) => b.isSelect);
      if (selected.length === 0) return;

      selected.forEach((b) =>
        handleBetAction("delete", b.matchId, b.oddsType, b._id)
      );
      success("All selected bets deleted");
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
    if (allBets.length > 0) {
      applyFiltersToData(allBets);
    }
  }, [allBets]);

  useEffect(() => {
    if (hasLoadedData) {
      fetchCurrentBets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  // pagination range
  const fromRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const toRow = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <section className="mian-content">
      <div className="current-bets-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Current Bets</h1>
            </div>
          </div>

          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label htmlFor="chooseType" className="lable-two">
                Choose Type
              </label>
              <select
                id="chooseType"
                className="form-select"
                aria-label="Choose Type"
                value={betType}
                onChange={(e) => {
                  setPage(1);
                  setBetType(e.target.value);
                }}
              >
                <option value="All">All</option>
                <option value="Matched">Matched</option>
              </select>
            </div>

            <div className="col-md-2 mb-3">
              <label htmlFor="marketType" className="lable-two">
                Market Type
              </label>
              <select
                id="marketType"
                className="form-select"
                aria-label="Market Type"
                value={marketType}
                onChange={(e) => {
                  setPage(1);
                  setMarketType(e.target.value);
                }}
              >
                <option value="All">All</option>
                <option value="Matchodds">Matchodds</option>
                <option value="To Win Toss">To Win Toss</option>
                <option value="Bookmaker">Bookmaker</option>
                <option value="Fancy">Fancy</option>
              </select>
            </div>

            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={handleLoadClick}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load"}
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-10 mb-3">
              <div className="select-box">
                <label htmlFor="showEntries">Show</label>
                <select
                  id="showEntries"
                  className="form-select"
                  aria-label="Show entries"
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
                <label htmlFor="showEntries">entries</label>
              </div>
            </div>
            <SearchCom
              handleChange={handleSearchChange}
              type="Search UserName"
            />
          </div>

          <ul
            className="nav nav-pills mb-3 nav-pills-one"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "SPORTS" ? "active" : ""}`}
                id="pills-SPORTS-tab"
                type="button"
                role="tab"
                aria-controls="pills-SPORTS"
                aria-selected={activeTab === "SPORTS"}
                onClick={() => setActiveTab("SPORTS")}
              >
                <i className="fas fa-trophy"></i> SPORTS
              </button>
            </li>

            {/* Show All Delete only if at least one bet is selected */}
            {currentBets.some((b) => b.isSelect) && (
              <li className="nav-item" role="presentation">
                <button
                  onClick={handleAllDelete}
                  className="btn btn-danger ms-2"
                >
                  All Delete
                </button>
              </li>
            )}
          </ul>

          <div className="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${
                activeTab === "SPORTS" ? "show active" : ""
              }`}
              id="pills-SPORTS"
              role="tabpanel"
              aria-labelledby="pills-SPORTS-tab"
              tabIndex={0}
            >
              {loading && <Loading />}

              {error && <div className="alert alert-danger my-3">{error}</div>}

              {!loading && !error && hasLoadedData && (
                <>
                  <div className="table-responsive">
                    <table className="table-lay-black-one table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              ref={headerCbRef}
                              type="checkbox"
                              checked={allChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCurrentBets((prev) =>
                                  prev.map((o) => ({ ...o, isSelect: checked }))
                                );
                              }}
                            />
                          </th>
                          <th>Event Type</th>
                          <th>Event Name</th>
                          <th>User Name</th>
                          <th>Runner Name</th>
                          <th>Bet Type</th>
                          <th>User Rate</th>
                          <th>Amount</th>
                          <th>Bet Time</th>
                          <th>Match Date</th>
                          <th>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBets.length > 0 ? (
                          <>
                            {currentBets.map((bet, index: number) => (
                              <tr
                                key={bet._id || index}
                                className={`${
                                  bet.orderType === "Back"
                                    ? "black-bg"
                                    : "lay-bg"
                                }`}
                              >
                                <th>
                                  <input
                                    type="checkbox"
                                    checked={!!bet.isSelect}
                                    onChange={() =>
                                      handleIndividualBetSelect(bet._id)
                                    }
                                  />
                                </th>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.orderType}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.match.name}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.user.username}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.sessionRunner ?? bet.runnerName}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.oddsType}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.rate}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.betAmount}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {formatDateTime(bet.created)}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {formatDateTime(bet.updated)}
                                </td>
                                <td style={{ backgroundColor: "transparent" }}>
                                  {bet.user_ip.replace("::ffff:", "")}
                                  <button
                                    onClick={() =>
                                      handleBetAction(
                                        "delete",
                                        bet.matchId,
                                        bet.oddsType,
                                        bet._id
                                      )
                                    }
                                    className="px-2 ms-2 btn btn-sm btn-danger"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleBetAction(
                                        "void",
                                        bet.matchId,
                                        bet.oddsType,
                                        bet._id
                                      )
                                    }
                                    className="px-2 ms-2 btn btn-sm btn-warning"
                                  >
                                    Void
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={11} className="text-center">
                              {searchTerm
                                ? `No bets found matching "${searchTerm}"`
                                : "No current bets found for Sports."}
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

                    <nav aria-label="CurrentBets pagination" className="mb-2">
                      <ul className="pagination mb-0">
                        <li
                          className={`page-item ${page === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setPage(1)}
                            aria-label="First"
                          >
                            «
                          </button>
                        </li>
                        <li
                          className={`page-item ${page === 1 ? "disabled" : ""}`}
                        >
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
                          className={`page-item ${
                            page >= totalPages ? "disabled" : ""
                          }`}
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
                          className={`page-item ${
                            page >= totalPages ? "disabled" : ""
                          }`}
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

              {!loading && !error && !hasLoadedData && (
                <div className="text-center my-5">
                  <Loading />
                </div>
              )}
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "CASINO" ? "show active" : ""
              }`}
              id="pills-CASINO"
              role="tabpanel"
              aria-labelledby="pills-CASINO-tab"
              tabIndex={0}
            >
              {!loading &&
              !error &&
              hasLoadedData &&
              activeTab === "CASINO" &&
              currentBets.length === 0 ? (
                <p className="market-not-found">
                  No current bets found for Casino.
                </p>
              ) : !hasLoadedData && activeTab === "CASINO" ? (
                <div className="text-center my-5">
                  <p className="text-muted">
                    <Loading />
                  </p>
                </div>
              ) : activeTab === "CASINO" ? (
                <p className="market-not-found">
                  Market not found! (Placeholder for Casino content)
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentBet;
