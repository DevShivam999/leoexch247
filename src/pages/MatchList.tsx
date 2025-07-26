import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getGameTypeName } from "./GameReport";
import { useEffect, useState } from "react";
import CricketMatchList from "../components/MatchListComp";
import type { MatchList } from "../types/vite-env";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import Loading from "../components/Loading";
import instance from "../services/AxiosInstance";

const MatchList = () => {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchList[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const Api = async () => {
    try {
        const data=await instance.get(`betting/all_matches?eventId=${id}&search=`)
        setMatches(data.data.results);
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    Api()
  }, [id]);
  return (
    <div>
      <h1 className="text-center mt-3">
        {getGameTypeName(id || "")} MATCH LIST
      </h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <CricketMatchList matches={matches} />
      )}
    </div>
  );
};

export default MatchList;
