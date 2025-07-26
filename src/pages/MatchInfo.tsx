import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MatchSession, Sessions } from "../types/vite-env";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import Loading from "../components/Loading";
import instance from "../services/AxiosInstance";
import MatchOddList from "../components/MatchOddList";
import MatchOddsAction from "../components/MatchOddAction";

const MatchInfo = () => {
  const { id } = useParams();
  const location = useLocation();
  const [name, setname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Sessions[]>([]);
  const [MatchSession, setMatchSession] = useState<MatchSession[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const Api = async () => {
    try {
      const [result, match] = await Promise.all([
        instance.get(`betting/resultmarketmatch?matchId=${id}`),
        instance.get(`betting/match-session?matchId=${id}&search=`),
      ]);

      setname(result.data.name);
      setMatchSession([...result.data.marketTypes,...result.data.bookmarketTypes]);;
      setMatches(match.data.results);
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
          <MatchOddList sessions={matches} />
        </>
      )}
    </div>
  );
};

export default MatchInfo;
