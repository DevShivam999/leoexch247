import { useEffect, useState } from "react";
import type { MatchSession } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import { success, Tp } from "../utils/Tp";
import axios from "axios";

const MatchOddsAction = ({
  MatchSession,
}: {
  MatchSession: MatchSession[];
}) => {
  const [selectedWinners, setSelectedWinners] = useState<{
    [marketId: string]: string;
  }>({});
  useEffect(() => {
    for (let i = 0; i < MatchSession.length; i++) {
      if (MatchSession[i].isResult) {
        setSelectedWinners((prev) => ({
          ...prev,
          [MatchSession[i].marketId]: MatchSession[i].matchResultStatus,
        }));
      }
    }
  }, []);

  const handleSelection = (marketId: string, value: string) => {
    setSelectedWinners((prev) => ({ ...prev, [marketId]: value }));
  };
  const DeclearResult = async (
    marketId: string,
    matchId: string,
    id: number
  ) => {
    try {
      await instance.post("/betting/declare-odds-result", {
        marketId: marketId,
        matchId: matchId,
        selectionId: id,
        status: selectedWinners[marketId] || "",
      });
      success();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        Tp(
          err.response.data.message ||
            "An error occurred while declaring the result."
        );
      } else {
        Tp("An unknown error occurred while declaring the result.");
        console.error("Error declaring result:", err);
      }
    }
  };
  return (
    <div style={styles.wrapper}>
      {MatchSession.map((session, sessionIndex) =>
        session.marketData.map((market, marketIndex) => {
          const runners = market.runners;
          const selected = selectedWinners[session.marketId] || "";

          return (
            <div
              key={`${sessionIndex}-${marketIndex}`}
              style={{ marginBottom: "2rem" }}
            >
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.headerCell} colSpan={runners.length + 1}>
                      {session.name}
                    </th>
                    <th style={styles.headerCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[
                      ...runners,
                      { name: "Cancelled", runner: "Cancelled" },
                    ].map((runner, i) => (
                      <td style={styles.cell} key={i}>
                        <div style={{ textAlign: "center" }}>
                          <div>{runner.name || runner.runner}</div>
                          <input
                            type="radio"
                            name={`winner-${session.marketId}`}
                            checked={
                              selected === runner.runner ||
                              selected === runner.name
                            }
                            onChange={() =>
                              handleSelection(
                                session.marketId,
                                runner.runner || runner.name
                              )
                            }
                          />
                        </div>
                      </td>
                    ))}
                    <td style={styles.cell}>
                      {session.isResult ? (
                        <div style={styles.buttonGroup}>
                          <button style={styles.button}>DECLARED</button>
                          <button style={styles.button}>Roll Back</button>
                        </div>
                      ) : (
                        <div style={styles.buttonGroup}>
                          <button style={styles.button}>DELETE BETS</button>
                          <button style={styles.button}>
                            VOID BETS {session.isResult}{" "}
                          </button>
                          <button
                            style={styles.button}
                            onClick={() =>
                              !session.isResult &&
                              DeclearResult(
                                session.marketId,
                                session.matchId,
                                runners.find(
                                  (p) =>
                                    p.runner ==
                                    selectedWinners[session.marketId]
                                )?.selectionId || 0
                              )
                            }
                          >
                            {session.isResult ? "DECLARED" : "DECLARE"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "1rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#fff",
  },
  headerCell: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "12px",
    textAlign: "left" as const,
  },
  cell: {
    padding: "16px",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  button: {
    backgroundColor: "#009688",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default MatchOddsAction;
