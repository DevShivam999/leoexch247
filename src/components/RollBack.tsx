
import { useParams } from "react-router-dom";
import instance from "../services/AxiosInstance";
import { success } from "../utils/Tp";
import { fetchBetsResult } from "../api/fetchUserPermissions";
import useAppDispatch from "../hook/hook";

const RollBack = ({ button, market, match }:{button:any,market:string,match:string}) => {
  const {id}=useParams()
  const dispatch=useAppDispatch()
  const RollBackApi = async (marketId: string, matchId: string) => {
    try {
      await instance.post("betting/rollback-odds-result", {
        matchId: matchId,
        marketId: marketId,
      });
      success();
      
            dispatch(fetchBetsResult(id||""))
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button style={button} onClick={() => RollBackApi(market, match)}>
      Roll Back
    </button>
  );
};

export default RollBack;
