
import instance from "../services/AxiosInstance";
import { success } from "../utils/Tp";

const RollBack = ({ button, market, match }:{button:any,market:string,match:string}) => {
  const RollBackApi = async (marketId: string, matchId: string) => {
    try {
      await instance.post("betting/rollback-odds-result", {
        matchId: matchId,
        marketId: marketId,
      });
      success();
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
