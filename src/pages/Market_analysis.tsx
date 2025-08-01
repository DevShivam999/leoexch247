import React, { useState, useEffect } from "react";
import type { ApiResponse, MatchResult } from "../types/vite-env";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import { getGameTypeName } from "./GameReport";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";

interface CricketMatchOddsProps {
  apiResponse: ApiResponse | null;
}

const CricketMatchOdds: React.FC<CricketMatchOddsProps> = ({ apiResponse }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [activeTab, setActiveTab] = useState<"sports" | "casino">("sports");
  const user = useAppSelector((p: RootState) => p.changeStore.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiResponse?.results) {
      setMatches(apiResponse.results);
    }
  }, [apiResponse]);
  const getBetStatus = async () => {
    const updatedMatches = await Promise.all(
      matches.map(async (match) => {
        try {
          const { data } = await instance.get(
            `admin/blockbet?matchId=${match.matchId}`
          );
          return { ...match, BetStatus: data.data };
        } catch (error) {
          console.error("Error fetching BetStatus:", error);
          return match;
        }
      })
    );
    setMatches(updatedMatches);
    setLoading(false);
  };
  useEffect(() => {
    if (matches.length > 0) {
      getBetStatus();
    }
  }, [matches.length]);

  const BetLockApi = async (matchId: string, isUser = true) => {
    try {
      if (loading) return;
      setLoading(true);
      await instance.post(`/admin/blockbet?matchId=${matchId}`, {
        matchId: Number(matchId),
        userId: user._id,
        status: isUser,
      });
      await getBetStatus();
    } catch (err) {
      ErrorHandler({ err, dispatch, navigation, pathname: location.pathname });
    }
  };

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-box">
          <h1 className="heading-one">Market Analysis</h1>
        </div>
        <small>You can view your cricket card books from sports menu.</small>
      </div>

      <ul
        className="nav nav-pills mb-3 nav-pills-one"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "sports" ? "active" : ""}`}
            id="pills-SPORTS-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-SPORTS"
            type="button"
            role="tab"
            aria-controls="pills-SPORTS"
            aria-selected={activeTab === "sports"}
            onClick={() => setActiveTab("sports")}
          >
            <i className="fas fa-trophy"></i> SPORTS
          </button>
        </li>
        {/* <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "casino" ? "active" : ""}`}
            id="pills-CASINO-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-CASINO"
            type="button"
            role="tab"
            aria-controls="pills-CASINO"
            aria-selected={activeTab === "casino"}
            onClick={() => setActiveTab("casino")}
          >
            <i className="fas fa-coins"></i> CASINO
          </button>
        </li> */}
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div
          className={`tab-pane fade ${
            activeTab === "sports" ? "show active" : ""
          }`}
          id="pills-SPORTS"
          role="tabpanel"
          aria-labelledby="pills-SPORTS-tab"
          tabIndex={0}
        >
          <div className="sports-market-container">
            {matches.length > 0 ? (
              matches.map((match, marketIndex: number) => (
                <div
                  key={`${match._id}-matchods-${marketIndex}`}
                  className="match-card-item"
                >
                  <div className="table-one-header">
                    <div className="table-one-header-left">
                      <img src="/cricketBall.png" alt="Cricket Ball" />
                      <div>
                        <Link
                          to={`/live-market/${getGameTypeName(String(match.eventId))}/${match.matchId}`}
                        >
                          {match.eventName}
                        </Link>
                        (
                        {match.fancy &&
                        match.fancy.length > 0 &&
                        match.fancy[0][0]?.name
                          ? "Fancy Details"
                          : match.matchODs &&
                              match.matchODs.length > 0 &&
                              match.matchODs[0][0]?.marketName
                            ? match.matchODs[0][0].marketName
                            : match.bookmaker &&
                              match.bookmaker.length > 0 &&
                              match.bookmaker[0][0]?.marketName}
                        )
                      </div>
                    </div>
                    <div className="table-one-header-right">
                      <div className="date">Mar 22, 2025</div>
                      <div className="dropdown">
                        <button
                          className="btn bet-lock-drop dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          aria-expanded="false"
                        >
                          Bet Lock
                        </button>

                        <ul className="dropdown-menu">
                          <li>
                            <span
                              className="dropdown-item"
                              onClick={() =>
                                BetLockApi(String(match._id), !match.BetStatus)
                              }
                            >
                              {match.BetStatus ? "Lock" : "UnLock"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="odds-tables-wrapper">
                    {!match?.fancy &&
                      match.matchODs &&
                      match.matchODs.length > 0 && (
                        <table className="table-one table">
                          <tbody>
                            {match.matchODs.map((marketArray, marketIndex) => (
                              <tr key={`${match._id}-matchods-${marketIndex}`}>
                                <th>
                                  <strong>
                                    {marketArray[0]?.marketName ||
                                      `Market ${marketIndex + 1}`}
                                  </strong>
                                </th>
                                {marketArray.map((odd, index) => (
                                  <td
                                    key={`${
                                      odd.marketId
                                    }-matchods-${index}-${new Date().getTime()}`}
                                  >
                                    {odd.name}
                                    <span
                                      className={
                                        odd.amount > 0
                                          ? "text-green"
                                          : "text-red"
                                      }
                                    >
                                      {odd.amount.toLocaleString()}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    {!match?.fancy &&
                      match?.bookmaker &&
                      match.bookmaker.length > 0 && (
                        <table className="table-one table">
                          <thead>
                            <tr>
                              <th>
                                <strong>Matchodds</strong>
                              </th>

                              {match.bookmaker[0] &&
                                match.bookmaker[0].map((odd, index) => (
                                  <td key={`match-odd-header-${index}`}>
                                    {odd.name}
                                  </td>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {match.bookmaker.map((marketArray, marketIndex) => (
                              <tr key={`${match._id}-matchods-${marketIndex}`}>
                                <th>
                                  <strong>
                                    {marketArray[0]?.marketName ||
                                      `Market ${marketIndex + 1}`}
                                  </strong>
                                </th>
                                {marketArray.map((odd, index) => (
                                  <td
                                    key={`${
                                      odd.marketId
                                    }-matchods-${index}-${new Date().getTime()}`}
                                  >
                                    {odd.name}
                                    <span
                                      className={
                                        odd.amount > 0
                                          ? "text-green"
                                          : "text-red"
                                      }
                                    >
                                      {odd.amount.toLocaleString()}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                    {!match?.matchODs &&
                      match.fancy &&
                      match.fancy.length > 0 && (
                        <table className="table-one table mt-3">
                          <tbody>
                            {match.fancy.map((marketArray, marketIndex) => (
                              <tr key={`${match._id}-fancy-${marketIndex}`}>
                                <th>
                                  <strong>
                                    {marketArray[0]?.name ||
                                      `Market ${marketIndex + 1}`}
                                  </strong>
                                </th>
                                {marketArray.map((odd) => (
                                  <td
                                    key={`${
                                      odd.marketId
                                    }-fancy-${marketIndex}-${new Date().getTime()}`}
                                  >
                                    {/* {odd.name}  */}
                                    <span
                                      className={
                                        odd.amount > 0
                                          ? "text-green"
                                          : "text-red"
                                      }
                                    >
                                      {odd.amount.toLocaleString()}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="market-not-found">Market not found!</div>
            )}
          </div>
        </div>

        <div
          className={`tab-pane fade ${
            activeTab === "casino" ? "show active" : ""
          }`}
          id="pills-CASINO"
          role="tabpanel"
          aria-labelledby="pills-CASINO-tab"
          tabIndex={0}
        >
          <p className="market-not-found"> Market not found! </p>
        </div>
      </div>
    </>
  );
};

export default CricketMatchOdds;
