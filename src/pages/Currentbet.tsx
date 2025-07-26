import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import type { BetData } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import SearchCom from "../components/SearchCom";


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
  const [limit, setLimit] = useState<number>(25);
  const [activeTab, setActiveTab] = useState<"SPORTS" | "CASINO">("SPORTS");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allDelete, setAllDelete] = useState(false);

  const [allBets, setAllBets] = useState<BetData[]>([]);
  const [currentBets, setCurrentBets] = useState<BetData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);
  const socket = useAppSelector((p: RootState) => p.socket);
  const navigation = useNavigate();
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);
  const dispatch = useDispatch();
  const fetchCurrentBets = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user || !token) {
        navigation("/login");
        console.warn("User or token not found. Cannot fetch current bets.");
        setLoading(false);
        return;
      }

      const response = await instance.get(
        `betting/current-bets?page=1&offset=0&limit=${limit}&numeric_id=${
          user.numeric_id
        }`,
      );

      const fetchedData = response.data.results;
      if (fetchedData != allBets) {
        setAllBets(fetchedData);

        applyFiltersToData(fetchedData);
        setHasLoadedData(true);
      }
    } catch (err) {
    
            ErrorHandler({err,dispatch,navigation,pathname:location.pathname,setError})
      setAllBets([]);
      setCurrentBets([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteBet = (
    id: string,
    oddsType: string,
    orderId: string | null,
  ) => {
    socket.socket.emit("deleteBetsOrders", {
      matchId: id,
      oddsType: oddsType,
      selectionId: null,
      type: "void",
      orderId: orderId,
    });
  };

  const applyFiltersToData = (data: BetData[]) => {
   
    let filtered = [...data];

    if (betType !== "All") {
      filtered = filtered.filter((bet) => {
        return betType === "Matched" ? (bet as any).status === "matched" : true; 
      });
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
        bet.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setCurrentBets(filtered);
  };

  const handleLoadClick = () => {
    fetchCurrentBets();
  };

  const handleAllDelete = () => {
    for (let i = 0; i < currentBets.length; i++) {
      if (currentBets[i].isSelect) {
        handleDeleteBet(
          currentBets[i].matchId,
          currentBets[i].oddsType,
          currentBets[i]._id,
        );
      }
    }
  };
  const handleSearchChange = (newSearchTerm: string) => {
   
    setSearchTerm(newSearchTerm);

    if (allBets.length > 0) {
      applyFiltersToData(allBets);
    }
  };

  useEffect(() => {
    fetchCurrentBets();
    socket.socket.on("deleteBetsOrders", (data) => {
      if (data.status) {
        fetchCurrentBets();
      }
    });

    let remove = setInterval(() => {
      fetchCurrentBets();
    }, 15000);

    return () => {
      clearInterval(remove);
    };
  }, []);

  const handleIndividualBetSelect = (betId: string) => {
    setCurrentBets((prev) => {
      const updatedData = prev.map((bet) =>
        bet._id === betId ? { ...bet, isSelect: !bet.isSelect } : bet,
      );

      return updatedData;
    });
  };
  useEffect(() => {
    if (hasLoadedData) {
     
      fetchCurrentBets();
    }
   
  }, [limit]); 
  useEffect(() => {
    const newDelelte = currentBets.filter((p) => p.isSelect == true);
    if (newDelelte.length > 0) {
      setAllDelete(true);
    } else {
      setAllDelete(false);
    }
  }, [currentBets]);
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
                onChange={(e) => setBetType(e.target.value)}
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
                onChange={(e) => setMarketType(e.target.value)}
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
                  onChange={(e) => setLimit(Number(e.target.value))}
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
             <SearchCom handleChange={handleSearchChange} type="Search UserName" />
           
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
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "CASINO" ? "active" : ""}`}
                id="pills-CASINO-tab"
                type="button"
                role="tab"
                aria-controls="pills-CASINO"
                aria-selected={activeTab === "CASINO"}
                onClick={() => setActiveTab("CASINO")}
              >
                <i className="fas fa-coins"></i> CASINO
              </button>
            </li>
            {allDelete && (
              <li className="nav-item" role="presentation">
                <button onClick={() => handleAllDelete()}>All Delete</button>
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

              {/* Show table when data has been loaded */}
              {!loading && !error && hasLoadedData && (
                <div className="table-responsive">
                  <table className="table-lay-black-one table">
                    <thead>
                      <tr>
                        {/* THE FIX IS HERE: Ensure no whitespace between <th> tags */}
                        <th>
                          <input type="checkbox" />
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
                              key={bet._id || index} // Using bet._id for key if available, otherwise index (less ideal but fallback)
                              className={`${
                                bet.orderType === "Back" ? "black-bg" : "lay-bg"
                              }`}
                            >
                              <th>
                                <input
                                  type="checkbox"
                                  checked={bet.isSelect}
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
                                {bet.sessionRunner}
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
                                {bet.user_ip.replace("::ffff:","")}

                                <button
                                  onClick={() =>
                                    handleDeleteBet(
                                      bet.matchId,
                                      bet.oddsType,
                                      bet._id,
                                    )
                                  }
                                  className="px-2 ms-2"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={11} className="text-center">
                            {/* Adjusted colSpan */}
                            {searchTerm
                              ? `No bets found matching "${searchTerm}"`
                              : "No current bets found for Sports."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
