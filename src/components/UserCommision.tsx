import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import useAppDispatch, { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import {
  AllClear,
  BookmakerCommission,
  BookmakerTypeCommission,
  FancyCommission,
  FancyTypeCommission,
  MatchOddsCommission,
  MatchOddsTypeCommission,
} from "../helper/UserCommissionStore";
import { useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../utils/ErrorHandle";

const UserCommission = () => {
  const {id}=useParams()
  
  const user = useAppSelector((p: RootState) => p.changeStore.user.numeric_id);

  const [matchOddsCommission, setMatchOddsCommission] = useState<string>("0");
  
  const [bookmakerCommission, setBookmakerCommission] = useState<string>("0");
  const [fancyCommission, setFancyCommission] = useState<string>("0");
  const [matchOddsTypeCommission, setMatchOddsTypeCommission] =
  useState<string>("EntryWise");
  const [bookmakerTypeCommission, setBookmakerTypeCommission] =
  useState<string>("EntryWise");
  const [fancyTypeCommission, setFancyTypeCommission] =
  useState<string>("EntryWise");
  const initialData = useAppSelector((p: RootState) => p.userCommission);

const navigation=useNavigate()
  const dispatch = useAppDispatch();
  const fetchCommission = async () => {

    try {
      const res = await instance.get(`/user/minmax-bet-new?numeric_id=${user}`);

      const data = res.data?.result?.user;

      if (Array.isArray(data)) {
        data.forEach((item) => {
          switch (item.marketType?.toLowerCase()) {
            case "match odds":
              setMatchOddsCommission(item.comm_in?.toString() || "0");

              setMatchOddsTypeCommission(item?.type?.toString() || "EntryWise");
              break;
            case "bookmaker":
              setBookmakerCommission(item.comm_in?.toString() || "0");
              setBookmakerTypeCommission(item?.type?.toString() || "EntryWise");
              break;
            case "fancy":
              setFancyCommission(item.comm_out?.toString() || "0");
              setFancyTypeCommission(item?.type?.toString() || "EntryWise");
              break;
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch commission:", err);
    }
  };

  useEffect(() => {
    fetchCommission();
  }, [user]);
  const Api=async()=>{
   try {
     await instance.post("/user/minmax-bet-new", {
        data:initialData,userId:id
      });
       dispatch(AllClear())
       navigation("/list-of-clients")
   } catch (error) {
    ErrorHandler({err:error,dispatch,navigation,pathname:location.pathname})
   }
  }

  return (
    <div className="col-12 mb-5">
      <h3 className="box-title">User Loss Commission %</h3>
      <div className="table-responsive">
        <table className="table table-four">
          <thead>
            <tr>
              <th></th>
              <th>Match Odds</th>
              <th>Bookmaker</th>
              <th>Fancy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Commission</td>
              <td>
                <input
                  type="text"
                  className="table-input-one"
                  value={initialData.matchOddsCommission}
                  onChange={(e) =>
                   Number(e.target.value)>=0&&Number(e.target.value)<=10&& dispatch(MatchOddsCommission(e.target.value))
                  }
                  readOnly={initialData.matchOddsTypeCommission?.trim().toLowerCase() === "no"}
                />
              </td>
              
              <td>
                <input
                  type="text"
                  className="table-input-one"
                  value={initialData.bookmakerCommission}
                  onChange={(e) =>
                   Number(e.target.value)>=0&&Number(e.target.value)<=10&&   dispatch(BookmakerCommission(e.target.value))
                  }
                  readOnly={initialData.bookmakerTypeCommission?.trim().toLowerCase() === "no"}
                />
              </td>
              
              <td>
                <input
                  type="text"
                  className="table-input-one"
                  value={initialData.fancyCommission}
                  onChange={(e) => Number(e.target.value)>=0&&Number(e.target.value)<=10&&  dispatch(FancyCommission(e.target.value))}
                  readOnly={initialData.fancyTypeCommission?.trim().toLowerCase() === "no"}
                />
              </td>
              
            </tr>

            <tr>
              <td>Commission Type</td>
              <td>
                <select
                  className="form-select"
                  value={initialData.matchOddsTypeCommission}
                  onChange={(e) =>
                    dispatch(MatchOddsTypeCommission(e.target.value))
                  }
                >

                  <option value="All">Select Commission</option>
                  <option value="No">No</option>
                  <option value="Entry">Entry</option>
                  <option value="Net">Net</option>
                </select>
              </td>
              <td>
                <select
                  className="form-select"
                  value={initialData.bookmakerTypeCommission}
                  onChange={(e) =>
                    dispatch(BookmakerTypeCommission(e.target.value))
                  }
                >
                  <option value="All">Select Commission</option>
                       <option value="No">No</option>
                  <option value="Entry">Entry</option>
                  <option value="Net">Net</option>
                </select>
              </td>
              <td>
                <select
                  className="form-select"
                  value={initialData.fancyTypeCommission}
                  onChange={(e) =>
                    dispatch(FancyTypeCommission(e.target.value))
                  }
                >
                  <option value="All">Select Commission</option>
                       <option value="No">No</option>
                  <option value="Entry">Entry</option>
                  <option value="Net">Net</option>
                </select>
              </td>
            </tr>

            <tr>
              <td>My Commission</td>
              <td>
                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={matchOddsCommission}
                  readOnly
                />
                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={matchOddsTypeCommission}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={bookmakerCommission}
                  readOnly
                />
                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={bookmakerTypeCommission}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={fancyCommission}
                  readOnly
                />

                <input
                  type="text"
                  className="table-input-one mt-3"
                  value={fancyTypeCommission}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={()=>Api()}  className="btn btn-primary ml-auto d-block">Set Commission </button>
    </div>
  );
};

export default UserCommission;
