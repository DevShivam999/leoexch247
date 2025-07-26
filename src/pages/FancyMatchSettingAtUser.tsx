import React, { useState } from "react";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { useParams } from "react-router-dom";
import axios from "axios";
import { success, Tp } from "../utils/Tp";

const FancyCricketSettings = () => {
  const [settings, setSettings] = useState({
   
    commissionIn: "2",
    bet_delay:3,
    commissionOut: "0",
  });
  const {id}=useParams()
  const user=useAppSelector((state:RootState) => state.changeStore.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  const Api = async (ok:boolean) => {
   try {
     await instance.post("/minmaxbet/update-commission", {
      min: 100,
      max:  9999,
      max_profit: 10000000,
      max_market_profit: 10000000,
      max_liability: 1000,
      max_market_liability: 10000000,
      bet_delay: settings.bet_delay,
      comm_in: settings.commissionIn,
      comm_out: settings.commissionOut,
      eventid: "4",
      marketType: "fancy",
      parentId:user._id,
      sportsType: "cricket",
      updateOnlyMy: ok,
      userId: id,
    });
    success()
   } catch (err) {
     if (axios.isAxiosError(err) && err.response) {
      Tp(
        err.response.data.message ||
          "An error occurred while updating the settings."
      );
  }
   }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-white text-center fw-bold text-uppercase py-2" style={{ backgroundColor: "#2196f3" }}>
          FANCY (CRICKET)
        </div>

        <div className="card-body">
        

          <div className="row mb-3 align-items-center border-bottom pb-3">
            <div className="col-md-6">
              <div className="fw-bold">COMMISSION IN</div>
              <div className="text-muted">COMMISSION OUT</div>
              <div className="text-muted">BET DELAY</div>
            </div>
            <div className="col-md-6 text-end">
              <input
                type="text"
                name="commissionIn"
                value={settings.commissionIn}
                onChange={handleChange}
                className="form-control d-inline-block text-end mb-1"
                style={{ width: "120px" }}
              />
              <br />
              <input
                type="text"
                name="commissionOut"
                value={settings.commissionOut}
                onChange={handleChange}
                className="form-control d-inline-block text-end"
                style={{ width: "120px" }}
              />
              <br />
              <input
                type="text"
                name="bet_delay"
                value={settings.bet_delay}
                onChange={handleChange}
                className="form-control d-inline-block text-end"
                style={{ width: "120px" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="row mt-4">
            <div className="col-12 mb-2">
              <button
                className="btn btn-dark w-100 fw-bold py-2"
                onClick={() => Api(false)}
              >
                UPDATE MY AND DOWN-LINE
              </button>
            </div>
            <div className="col-12">
              <button className="btn btn-dark w-100 fw-bold py-2" onClick={() => Api(true)}>
                UPDATE ONLY MY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyCricketSettings;
