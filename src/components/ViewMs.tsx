import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { Tp } from "../utils/Tp";

const MarketSettingsModal = ({ setshowModal }: { setshowModal: Function }) => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [Password,settransitionPassword]=useState(0)
  const [formData, setFormData] = useState({
    minBet: {
      matchOdds: 100,
      bookmaker: 0,
      fancy: 100,
    },
    maxBet: {
      matchOdds: 100000,
      bookmaker: 0,
      fancy: 100000,
    },
    transactionPassword: "",
  });
  const [formData2, setFormData2] = useState({
    minBet: {
      matchOdds: 100,
      bookmaker: 0,
      fancy: 100,
    },
    maxBet: {
      matchOdds: 100000,
      bookmaker: 0,
      fancy: 100000,
    },
    transactionPassword: "",
  });
  const [bookmakerId, setBookmakerId] = useState<string[]>([]);
  const [FancyId, setFancyId] = useState<string[]>([]);
  const [isActive,setIsActive]=useState(false)
  const [isActive2,setIsActive2]=useState(false)
  const [MatchOddsId, setMatchOddsId] = useState<string[]>([]);
  const transitionPassword=useAppSelector((p:RootState)=>p.Permissions.transactionPassword)

  const Api = async () => {
    
    const { data } = await instance.get(
      `/user/getMatchRelatedMarket?matchId=${id}`
    );
   const result= await instance.get(`/admin/blockbet?matchId=${id}`)
   setIsActive(result.data.data)
   setIsActive2(result.data.data)
    if (data.data.bookmaker.length > 0) {
      setFormData((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          bookmaker: data.data.bookmaker[0].setting
            ? data.data.bookmaker[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          bookmaker: data.data.bookmaker[0].setting
            ? data.data.bookmaker[0].setting.maxBet
            : 100,
        },
      }));
      setFormData2((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          bookmaker: data.data.bookmaker[0].setting
            ? data.data.bookmaker[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          bookmaker: data.data.bookmaker[0].setting
            ? data.data.bookmaker[0].setting.maxBet
            : 100,
        },
      }));

      data.data.bookmaker.map((o: any) =>
        setBookmakerId((p) => [...p, o.marketId])
      );
    }
    if (data.data.session.length > 0) {
      setFormData((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          fancy: data.data.session[0].setting
            ? data.data.session[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          fancy: data.data.session[0].setting
            ? data.data.session[0].setting.maxBet
            : 100,
        },
      }));
      setFormData2((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          fancy: data.data.session[0].setting
            ? data.data.session[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          fancy: data.data.session[0].setting
            ? data.data.session[0].setting.maxBet
            : 100,
        },
      }));
      data.data.session.map((o: any) => setFancyId((p) => [...p, o.marketId]));
    }
    if (data.data.matchOdds.length > 0) {
      setFormData((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          matchOdds: data.data.matchOdds[0].setting
            ? data.data.matchOdds[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          matchOdds: data.data.matchOdds[0].setting
            ? data.data.matchOdds[0].setting.maxBet
            : 100,
        },
      }));
      setFormData2((p) => ({
        ...p,
        minBet: {
          ...p.minBet,
          matchOdds: data.data.matchOdds[0].setting
            ? data.data.matchOdds[0].setting.minBet
            : 100,
        },
        maxBet: {
          ...p.maxBet,
          matchOdds: data.data.matchOdds[0].setting
            ? data.data.matchOdds[0].setting.maxBet
            : 100,
        },
      }));
      data.data.matchOdds.map((o: any) =>
        setMatchOddsId((p) => [...p, o.marketId])
      );
    }
  };
  useEffect(() => {
    Api();
  }, []);

  const handleInputChange = (
    type: "minBet" | "maxBet",
    key: "matchOdds" | "bookmaker" | "fancy",
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settransitionPassword( Number(e.target.value));
  };

  const handleSubmit = async () => {
    try {
      if(transitionPassword!=Password){

        return Tp()
      }
      if(isActive2!=isActive){
        
  await instance.post(`/admin/blockbet`,{
    matchId:id,
    status:isActive
  })
      }
      if (
        formData2.maxBet.bookmaker != formData.maxBet.bookmaker ||
        formData2.minBet.bookmaker != formData.minBet.bookmaker
      ) {
        bookmakerId.map(async (p) => {
          await instance.post(`betting/blockMatch`, {
            betLock:isActive,
            inplay: true,
            marketId: p,
            matchId: id,
            maxBet: formData.maxBet.bookmaker,
            minBet: formData.minBet.bookmaker,
          });
        });
      }
     if(formData2.maxBet.fancy != formData.maxBet.fancy ||
        formData2.minBet.fancy != formData.minBet.fancy) {FancyId.map(async (p) => {
        await instance.post(`betting/blockMatch`, {
          betLock: isActive,
          inplay: true,
          marketId: p,
          matchId: id,
          maxBet: formData.maxBet.fancy,
          minBet: formData.minBet.fancy,
        });
      });}
     if(formData2.maxBet.matchOdds != formData.maxBet.matchOdds ||
        formData2.minBet.matchOdds != formData.minBet.matchOdds){ MatchOddsId.map(async (p) => {
        await instance.post(`betting/blockMatch`, {
          betLock: isActive,
          inplay: true,
          marketId: p,
          matchId: id,
          maxBet: formData.maxBet.matchOdds,
          minBet: formData.minBet.matchOdds,
        });
      });}

      setshowModal(false);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
      });
    }
  };

  return (
    <div
      className="modal fade show d-block modal-one"
      tabIndex={-1}
      aria-labelledby="ms-modalLabel"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={() => setshowModal(false)}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title me-5" id="ms-modalLabel">
              Market Settings
            </h1>
            <label className="switch-teen">
              <input type="checkbox" checked={isActive}  onChange={()=>setIsActive(p=>!p)} />
              <span className="slider"></span>
            </label>
            <button
              type="button"
              className="modal-close btn"
              onClick={() => setshowModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="table-responsive">
              <table className="table table-mat">
                <thead>
                  <tr>
                    <th></th>
                    <th>Matchodds</th>
                    <th>Bookmaker</th>
                    <th>Fancy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Min Bet</td>
                    <td>
                      <input
                        type="number"
                        value={formData.minBet.matchOdds}
                        onChange={(e) =>
                          handleInputChange(
                            "minBet",
                            "matchOdds",
                            +e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={formData.minBet.bookmaker}
                        onChange={(e) =>
                          handleInputChange(
                            "minBet",
                            "bookmaker",
                            +e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={formData.minBet.fancy}
                        onChange={(e) =>
                          handleInputChange("minBet", "fancy", +e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Max Bet</td>
                    <td>
                      <input
                        type="number"
                        value={formData.maxBet.matchOdds}
                        onChange={(e) =>
                          handleInputChange(
                            "maxBet",
                            "matchOdds",
                            +e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={formData.maxBet.bookmaker}
                        onChange={(e) =>
                          handleInputChange(
                            "maxBet",
                            "bookmaker",
                            +e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={formData.maxBet.fancy}
                        onChange={(e) =>
                          handleInputChange("maxBet", "fancy", +e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="container-fluid">
              <div className="row justify-content-end">
                <div className="col-3 mb-3">Transaction Password</div>
                <div className="col-3 mb-3">
                  <input
                    type="password"
                    className="mgray-input-box form-control text-end"
                    value={Password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn modal-back-btn"
              onClick={() => setshowModal(false)}
            >
              <i className="fas fa-undo"></i> Back
            </button>
            <button
              type="button"
              className="btn modal-submit-btn"
              onClick={handleSubmit}
            >
              Submit <i className="fas fa-sign-in-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSettingsModal;
