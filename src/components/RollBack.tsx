
import { useParams } from "react-router-dom";
import instance from "../services/AxiosInstance";
import { success } from "../utils/Tp";
import { fetchBetsResult } from "../api/fetchUserPermissions";
import useAppDispatch from "../hook/hook";

const RollBack = ({ button, setloading,loading, market, match,url="betting/rollback-odds-result" }:{button?:any,market:string,match:string,url?:string,setloading: React.Dispatch<React.SetStateAction<boolean>>,loading:boolean}) => {
  const {id}=useParams()
  const dispatch=useAppDispatch()
  const RollBackApi = async (marketId: string, matchId: string) => {
    if(loading) return
    try {
      await instance.post(url, {
        matchId: matchId,
        marketId: marketId,
        selectionId:marketId
      });
      success();
      
            dispatch(fetchBetsResult(id||""))
    } catch (error) {
      console.log(error);
    }finally{
      setloading(false)
    }
  };
  return (
    <button style={button} onClick={() => RollBackApi(market, match)}>
      Roll Back
    </button>
  );
};

export default RollBack;
