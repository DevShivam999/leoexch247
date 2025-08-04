import { useEffect, useState } from "react";
import { styles } from "./MatchOddList";
import type { Sessions } from "../types/vite-env";
import { FaTrash } from "react-icons/fa";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { success, Tp } from "../utils/Tp";
import { fetchBetsResult } from "../api/fetchUserPermissions";
import { useParams } from "react-router-dom";
import useAppDispatch from "../hook/hook";
import RollBack from "./RollBack";
import useSocketVDelete from "./SocketBetDelete";

const SessionMatchList = ({ session }: { session: Sessions }) => {
  const { id } = useParams();

const SocketVDelete=  useSocketVDelete()
  const dispatch = useAppDispatch();
  const [resultValue, setResultValue] = useState("");
  const [loading,setLoading]=useState(false)

  const [error, setError] = useState<string | null>(null);
  const ResultDeclear = async (marketId: string, sessionId: string) => {
    try {
      if (!resultValue) {
        Tp("Result value cannot be empty");
        return;
      }
      if(loading) return
      setLoading(true)
      await instance.post(`betting/declare-session-result`, {
        matchId: marketId,
        run: resultValue,
        selectionId: sessionId,
      });
      success();

      dispatch(fetchBetsResult(id || ""));
    } catch (error) {
      ErrorHandler({
        err: error,
        setError: setError,
      });
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    error != null && Tp(error);
  }, [error]);
  return (
    <tr key={session._id} style={{ borderBottom: "1px solid #ccc" }}>
      <td style={styles.td}>{session.RunnerName}</td>
      <td style={styles.td}>{new Date(session.created).toDateString()} {new Date(session.created).toLocaleTimeString()}</td>
      <td style={styles.td}>{session.status}</td>
      <td style={styles.td}>
        <input
          type="text"
          placeholder=""
          value={session.status == "Result" ? session.winnerRun : resultValue}
          onChange={(e) =>Number(e.target.value)>=0&& setResultValue(e.target.value)}
          style={styles.input}
        />
         {session.status!="Result" ? <button
          style={styles.resultBtn}
          onClick={() => ResultDeclear(session.matchId, session.selectionId)}
        >
          RESULT
        </button>:<RollBack setloading={setLoading} loading={loading} market={session.selectionId} match={session.matchId} button={styles.resultBtn} url="betting/rollback-session-result"/>}
      
        <button style={styles.iconBtn}onClick={()=>SocketVDelete(id||"",'Session',"delete",session.selectionId)}>
          <FaTrash />
        </button>
        <button style={styles.iconBtn} onClick={()=>SocketVDelete(id||"",'Session',"void",session.selectionId)}>
          v<FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default SessionMatchList;
