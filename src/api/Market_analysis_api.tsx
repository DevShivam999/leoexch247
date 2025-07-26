import { useState, useEffect } from "react";
import type { ApiResponse } from "../types/vite-env";
import CricketMatchOdds from "../pages/Market_analysis";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import { removeUser } from "../helper/Changes";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import { setLocation } from "../utils/setLocation";

function Market_analysis_api() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigate();
  const user = useAppSelector((p: RootState) => p.changeStore.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user == null) {
          navigation("/login");
        }
        const userwith = user;
        const numeric_id = userwith.numeric_id;
        const data = await instance.get(
          `betting/market-analysis?numeric_id=${numeric_id}`,
        );
        setApiData(data.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log(err.status);

          if (err.status == 401) {
            (navigation("/login"), dispatch(removeUser()))
            setLocation("/market-analysis")
          }
        }
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      } finally {
        setLoading(false);
      }
    };
    document.title = "MarketAnalysis";

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="App">
      <CricketMatchOdds apiResponse={apiData} />
    </div>
  );
}

export default Market_analysis_api;
