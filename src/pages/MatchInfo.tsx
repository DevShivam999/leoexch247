import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorHandler from "../utils/ErrorHandle";
import Loading from "../components/Loading";
import MatchOddList from "../components/MatchOddList";
import MatchOddsAction from "../components/MatchOddAction";
import { fetchBetsResult } from "../api/fetchUserPermissions";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

const MatchInfo = () => {
  const { id } = useParams();
  const location = useLocation();
  const [error,setError]=useState<string|null>(null)

  const {MatchSession,Session,name,loading}=useAppSelector((p:RootState)=>p.BetsResult)
 
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const Api = async () => {
    try {
      dispatch(fetchBetsResult(id||""))
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError
      });
    }
  };
  useEffect(() => {
    Api();
  }, [id]);

  return (
    <div>
      <h1 className="text-center mt-3">{name} MATCH LIST</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <MatchOddsAction MatchSession={MatchSession}/>
          <MatchOddList sessions={Session} />
        </>
      )}
    </div>
  );
};

export default MatchInfo;
