import { useEffect, useState } from "react";
import { styles } from "./MatchOddList";
import type { Sessions } from "../types/vite-env";
import { FaTrash } from "react-icons/fa";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { Tp } from "../utils/Tp";

const SessionMatchList = ({ session }: { session: Sessions }) => {
  const [resultValue, setResultValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ResultDeclear = async (marketId: number, sessionId: string) => {
    try {
        if (!resultValue) {
            Tp("Result value cannot be empty");
            return;
        }
      await instance.post(
        `betting/declare-session-result`,
        {
          matchId: marketId,
          run: resultValue,
          selectionId: sessionId,
        }
      );
    } catch (error) {
      ErrorHandler({
        err: error,
        setError: setError,
      });
    }
  };
  useEffect(() => {
    error != null && Tp(error);
  }, [error]);
  return (
    <tr key={session._id} style={{ borderBottom: "1px solid #ccc" }}>
      <td style={styles.td}>{session.RunnerName}</td>
      <td style={styles.td}>{session.created}</td>
      <td style={styles.td}>{session.status}</td>
      <td style={styles.td}>
        <input
          type="number"
          placeholder=""
          value={resultValue}
          onChange={(e) => setResultValue(e.target.value)}
          style={styles.input}
        />
        <button
          style={styles.resultBtn}
          onClick={() => ResultDeclear(session.matchId, session.selectionId)}
        >
          RESULT
        </button>
        <button style={styles.iconBtn}>
          <FaTrash />
        </button>
        <button style={styles.iconBtn}>
          v<FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default SessionMatchList;
