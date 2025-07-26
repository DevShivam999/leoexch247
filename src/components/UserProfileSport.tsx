import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ColorTd from "./ColorTd";
import type { ReportItem } from "../types/vite-env";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";

const UserProfileSport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sportData, setSportData] = useState<ReportItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [sportIndex, setSportIndex] = useState<number | null>(null);
  const [matchIndex, setMatchIndex] = useState<number | null>(null);
  const [marketIndex, setMarketIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const dispatch=useDispatch()
  const navigation=useNavigate()

  const apiCall = async () => {
    try {
      setError(null);
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_Api_Url
        }/betting/sports-report?numeric_id=${id}&from=${fromDate}&to=${toDate}`,
      );
      setSportData(data.fullReport || []);
    } catch (err) {
   
         ErrorHandler({err,dispatch,navigation,pathname:location.pathname,setError})
      setSportData([]);
    }
  };

  const handleBack = () => {
    if (currentLevel === 3) {
      setCurrentLevel(2);
      setMarketIndex(null);
    } else if (currentLevel === 2) {
      setCurrentLevel(1);
      setMatchIndex(null);
    } else if (currentLevel === 1) {
      setCurrentLevel(0);
      setSportIndex(null);
    }
  };

  const renderTableHeaders = () => {
    if (currentLevel === 3) {
      return (
        <tr>
          <td>Username</td>
          <td>Team</td>
          <td>Amount</td>
          <td>Upline Total</td>
          <td>Placed At</td>
        </tr>
      );
    } else if (currentLevel === 2) {
      return (
        <tr>
          <td>Market Type</td>
          <td>Profit/Loss</td>
          <td>Commission</td>
          <td>Total P&L</td>
        </tr>
      );
    }
    return (
      <tr>
        <td>{currentLevel === 0 ? "Sport Name" : "Match Name"}</td>
        <td>Profit/Loss</td>
        <td>Commission</td>
        <td>Total P&L</td>
      </tr>
    );
  };

  const renderTableContent = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={currentLevel === 3 ? 5 : 4}>{error}</td>
        </tr>
      );
    }

    if (sportData.length === 0 && currentLevel === 0) {
      return (
        <tr>
          <td colSpan={4}>No Record Found</td>
        </tr>
      );
    }

    if (currentLevel === 0) {
      return sportData.map((sport, index) => (
        <tr key={sport.gameId}>
          <td>
            <div
              className="okPluse"
              onClick={() => {
                setCurrentLevel(1);
                setSportIndex(index);
              }}
            >
              {sport.sportName}
            </div>
          </td>
          <ColorTd amount={sport.profitLoss} />
          <ColorTd amount={sport.commission} />
          <ColorTd amount={sport.totalPL} />
        </tr>
      ));
    }

    if (currentLevel === 1 && sportIndex !== null) {
      const matches = sportData[sportIndex]?.matches || [];
      if (matches.length === 0) {
        return (
          <tr>
            <td colSpan={4}>No Matches Found</td>
          </tr>
        );
      }
      return matches.map((match, index) => (
        <tr key={match.matchId}>
          <td>
            <div
              className="okPluse"
              onClick={() => {
                setCurrentLevel(2);
                setMatchIndex(index);
              }}
            >
              {match.matchName}
            </div>
          </td>
          <ColorTd amount={match.profitLoss} />
          <ColorTd amount={match.commission} />
          <ColorTd amount={match.totalPL} />
        </tr>
      ));
    }

    if (currentLevel === 2 && sportIndex !== null && matchIndex !== null) {
      const markets = sportData[sportIndex]?.matches[matchIndex]?.markets || [];
      if (markets.length === 0) {
        return (
          <tr>
            <td colSpan={4}>No Markets Found</td>
          </tr>
        );
      }
      return markets.map((market, index) => (
        <tr key={market.marketId}>
          <td>
            <div
              className="okPluse"
              onClick={() => {
                setCurrentLevel(3);
                setMarketIndex(index);
              }}
            >
              {market.marketType}
            </div>
          </td>
          <ColorTd amount={market.profitLoss} />
          <ColorTd amount={market.commission} />
          <ColorTd amount={market.totalPL} />
        </tr>
      ));
    }

    if (
      currentLevel === 3 &&
      sportIndex !== null &&
      matchIndex !== null &&
      marketIndex !== null
    ) {
      const bets =
        sportData[sportIndex]?.matches[matchIndex]?.markets[marketIndex]
          ?.bets || [];
      if (bets.length === 0) {
        return (
          <tr>
            <td colSpan={5}>No Bets Found</td>
          </tr>
        );
      }
      return bets.map((bet, index) => (
        <tr key={`${bet.placedAt}-${index}`}>
          <td>{bet.username}</td>
          <td>{bet.team}</td>
          <ColorTd amount={bet.amount} />
          <ColorTd amount={bet.uplinetotal} />
          <td>{new Date(bet.placedAt).toLocaleString()}</td>
        </tr>
      ));
    }

    return null;
  };

  return (
    <div className="profile-card-one">
      <div className="profile-card-body">
        <div className="row align-items-end">
          <div className="col-md-2 mb-3">
            <label htmlFor="sportFrom" className="lable-two">
              From
            </label>
            <input
              type="date"
              id="sportFrom"
              className="form-control"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label htmlFor="sportTo" className="lable-two">
              To
            </label>
            <input
              type="date"
              id="sportTo"
              className="form-control"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-3">
            <button type="button" className="dark-button" onClick={apiCall}>
              Load
            </button>
          </div>
        </div>
        <div className="table-responsive">
          {currentLevel > 0 && (
            <button
              type="button"
              className="dark-button mb-3"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <table className="table table-four">
            <tbody>
              {renderTableHeaders()}
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSport;
