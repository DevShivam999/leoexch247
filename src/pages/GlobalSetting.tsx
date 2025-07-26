import React, { useEffect, useState } from "react";

import {  useNavigate } from "react-router-dom";
import instance from "../services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../helper/store";
import ErrorHandler from "../utils/ErrorHandle";
import { useAppSelector } from "../hook/hook";
import { success, Tp } from "../utils/Tp";
import GlobalContactNav from "../components/GlobalContactNav";
import GlobalSettingsBanner from "../components/GlobalSettingsBanner";

function GlobalSettingsPage() {
  const [settings, setSettings] = useState({
    whatsappNo: "",
    message: "",
    minMaxBets: [
      {
        type: "Cricket",
        status: false,
        matchoddsMin: 100,
        matchoddsMax: 100000,
      },
      {
        type: "Soccer",
        status: false,
        matchoddsMin: 100,
        matchoddsMax: 100000,
      },
      {
        type: "Tennis",
        status: false,
        matchoddsMin: 100,
        matchoddsMax: 100000,
      },
      // {
      //   type: "Diamond Casino",
      //   status: false,
      //   matchoddsMin: 100,
      //   matchoddsMax: 100000,
      //   bookmakerMin: null,
      //   bookmakerMax: null,
      //   fancyMin: null,
      //   fancyMax: null,
      // },
      // {
      //   type: "Toss",
      //   status: false,
      //   matchoddsMin: 100,
      //   matchoddsMax: 100000,
      //   bookmakerMin: null,
      //   bookmakerMax: null,
      //   fancyMin: null,
      //   fancyMax: null,
      // },
    ],
    betDelays: [
      { type: "Cricket", matchoddsDelay: 5, bookmakerDelay: 2, fancyDelay: 3 },
      {
        type: "Soccer",
        matchoddsDelay: 5,
        bookmakerDelay: null,
        fancyDelay: null,
      },
      {
        type: "Tennis",
        matchoddsDelay: 5,
        bookmakerDelay: null,
        fancyDelay: null,
      },
      {
        type: "Virtual",
        matchoddsDelay: 2,
        bookmakerDelay: null,
        fancyDelay: null,
      },
      {
        type: "Ball By Ball",
        matchoddsDelay: 2,
        bookmakerDelay: null,
        fancyDelay: null,
      },
    ],
    transactionPassword: "",
  });
  // const marketTypeMap = ["Match Odds", "Bookmaker", "fancy"];
  const user = useSelector((p: RootState) => p.changeStore.user);
  const transactionPassword = useAppSelector(
    (p: RootState) => p.Permissions.transactionPassword
  );
  const navigation = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await instance.get(
          `user/minmax-bet?numeric_id=${user.numeric_id}&eventId=`
        );
        const api = response.data;

        setSettings((prev) => ({
          ...prev,
          whatsappNo: api.whatsappNo || "",
          message: api.message || "",
          minMaxBets: [
            {
              type: "Cricket",
              status: !!api.individualsports.find((x: any) =>
                x.sportsType === "cricket" &&
               
                x.status == "active"
                  ? true
                  : false
              ),
              matchoddsMin:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "cricket" && x.marketType === "Match Odds"
                )?.min ?? 100,
              matchoddsMax:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "cricket" && x.marketType === "Match Odds"
                )?.max ?? 100000,
            },
            {
              type: "Soccer",
              status: !!api.individualsports.find((x: any) =>
                x.sportsType === "football" &&
                x.status == "active"
                  ? true
                  : false
              ),
              matchoddsMin:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "football" && x.marketType === "Match Odds"
                )?.min ?? 100,
              matchoddsMax:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "football" && x.marketType === "Match Odds"
                )?.max ?? 100000,
             
            },
            {
              type: "Tennis",
              status: !!api.individualsports.find((x: any) =>
                x.sportsType === "tennis" &&
                x.status == "active"
                  ? true
                  : false
              ),
              matchoddsMin:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "tennis" && x.marketType === "Match Odds"
                )?.min ?? 100,
              matchoddsMax:
                api.individualsports.find(
                  (x: any) =>
                    x.sportsType === "tennis" && x.marketType === "Match Odds"
                )?.max ?? 100000,
             
            },
            // {
            //   type: "Diamond Casino",
            //   status: !!api.user.find((x: any) =>
            //     x.sportsType === "casino1" &&
            //     marketTypeMap.includes(x.marketType) &&
            //     x.status == "active"
            //       ? true
            //       : false,
            //   ),
            //   matchoddsMin:
            //     api.user.find(
            //       (x: any) =>
            //         x.sportsType === "casino1" && x.marketType === "Match Odds",
            //     )?.min ?? 100,
            //   matchoddsMax:
            //     api.user.find(
            //       (x: any) =>
            //         x.sportsType === "casino1" && x.marketType === "Match Odds",
            //     )?.max ?? 100000,
            //   bookmakerMin: null,
            //   bookmakerMax: null,
            //   fancyMin: null,
            //   fancyMax: null,
            // },
            // {
            //   type: "Toss",
            //   status: !!api.user.find((x: any) =>
            //     x.sportsType === "cricket" &&
            //     (x.marketType === "To Win the Toss Match Odds" ||
            //       x.marketType === "To Win The Toss Match Odds") &&
            //     x.status == "active"
            //       ? true
            //       : false,
            //   ),
            //   matchoddsMin:
            //     api.user.find(
            //       (x: any) =>
            //         x.sportsType === "cricket" &&
            //         (x.marketType === "To Win the Toss Match Odds" ||
            //           x.marketType === "To Win The Toss Match Odds"),
            //     )?.min ?? 100,
            //   matchoddsMax:
            //     api.user.find(
            //       (x: any) =>
            //         x.sportsType === "cricket" &&
            //         (x.marketType === "To Win the Toss Match Odds" ||
            //           x.marketType === "To Win The Toss Match Odds"),
            //     )?.max ?? 100000,
            //   bookmakerMin: null,
            //   bookmakerMax: null,
            //   fancyMin: null,
            //   fancyMax: null,
            // },
          ],
          betDelays: [
            {
              type: "Cricket",
              matchoddsDelay:
                api.result.user.find(
                  (x: any) =>
                    x.sportsType === "cricket" && x.marketType === "Match Odds"
                )?.bet_delay ?? 5,
              bookmakerDelay:
                api.result.user.find(
                  (x: any) =>
                    x.sportsType === "cricket" && x.marketType === "Bookmaker"
                )?.bet_delay ?? 2,
              fancyDelay:
                api.result.user.find(
                  (x: any) =>
                    x.sportsType === "cricket" && x.marketType === "fancy"
                )?.bet_delay ?? 3,
            },
            {
              type: "Soccer",
              matchoddsDelay:
                api.result.user.find(
                  (x: any) =>
                    x.sportsType === "football" && x.marketType === "Match Odds"
                )?.bet_delay ?? 5,
              bookmakerDelay: null,
              fancyDelay: null,
            },
            {
              type: "Tennis",
              matchoddsDelay:
                api.result.user.find(
                  (x: any) =>
                    x.sportsType === "tennis" && x.marketType === "Match Odds"
                )?.bet_delay ?? 5,
              bookmakerDelay: null,
              fancyDelay: null,
            },
            {
              type: "Virtual",
              matchoddsDelay: 2,
              bookmakerDelay: null,
              fancyDelay: null,
            },
            {
              type: "Ball By Ball",
              matchoddsDelay: 2,
              bookmakerDelay: null,
              fancyDelay: null,
            },
          ],
          transactionPassword: "",
        }));
      } catch (err) {
        ErrorHandler({
          err,
          dispatch,
          navigation,
          pathname: location.pathname,
        });
      }
    };

    fetchSettings();
  }, [user.numeric_id]);

  // const handleMinMaxBetChange = (
  //   index: number,
  //   field: string,
  //   value: number,
  // ) => {
  //   const newMinMaxBets = [...settings.minMaxBets];
  //   //@ts-ignore
  //   newMinMaxBets[index][field] = value;
  //   setSettings({ ...settings, minMaxBets: newMinMaxBets });
  // };

  const handleBetDelayChange = (
    index: number,
    field: string,
    value: number
  ) => {
    const newBetDelays = [...settings.betDelays];
    //@ts-ignore
    newBetDelays[index][field] = value;
    setSettings({ ...settings, betDelays: newBetDelays });
  };

  const handleToggleChange = (index: number, newstatusState: boolean) => {
    const newMinMaxBets = [...settings.minMaxBets];
    newMinMaxBets[index].status = newstatusState;
    setSettings({ ...settings, minMaxBets: newMinMaxBets });
  };

  //@ts-ignore
  const handleTransactionPasswordChange = (e) => {
    setSettings({ ...settings, transactionPassword: e.target.value });
  };

  const handleUpdateSettings = async () => {
    if (settings.transactionPassword != String(transactionPassword)) {
      return Tp();
    }
    // Map UI state to API format
    const sportsTypeMap: Record<string, string> = {
      Cricket: "cricket",
      Soccer: "football",
      Tennis: "tennis",
      // "Diamond Casino": "casino1",
      // Toss: "cricket",
    };

    // Helper to get delay for a market
    const getDelay = (type: string, market: string) => {
      const delayObj = settings.betDelays.find((d) => d.type === type);
      if (!delayObj) return 0;
      if (market === "matchodds") return delayObj.matchoddsDelay ?? 0;
      if (market === "bookmaker") return delayObj.bookmakerDelay ?? 0;
      if (market === "fancy") return delayObj.fancyDelay ?? 0;
      return 0;
    };

    // Build markets array
    const markets: any[] = [];
    settings.minMaxBets.forEach((bet) => {
      const sportsType = sportsTypeMap[bet.type];
      // Match Odds
        markets.push({
          sportsType,
         marketType:"Match Odds",
          status: bet.status ? "active" : "inactive",
          bet_delay: getDelay(bet.type, "matchodds"),
        });
      
        markets.push({
          sportsType,
          marketType: bet.type === "Diamond Casino" ? "casino1" : "Bookmaker",
          status: bet.status ? "active" : "inactive",
          bet_delay: getDelay(bet.type, "bookmaker"),
        });
     
        markets.push({
          sportsType,
          marketType: "fancy",
          status: bet.status ? "active" : "inactive",
          bet_delay: getDelay(bet.type, "fancy"),
        });
      
    });

    try {
      // Send updated settings to the server
      await instance.post("/user/bulkUpdateMarketsForAll", {
        userId: user._id,
        whatsappNo: settings.whatsappNo,
        message: settings.message,
        markets,
        transactionPassword: settings.transactionPassword,
      });
      success();
    } catch (err) {
      ErrorHandler({ err, dispatch, navigation, pathname: location.pathname });
    }
  };

 

 
  return (
    <section className="mian-content">
      <div className="gobal-settings-page">
        <div className="container-fluid">
          <div className="dark-page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one-inner">Global Settings</h1>
            
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8 my-2">
              {/* Contact Settings */}
             <GlobalContactNav/>

              <div className="table-responsive">
                <table className="table-teen table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.minMaxBets.map((betType, index) => (
                      <React.Fragment key={betType.type}>
                        <tr>
                          <th rowSpan={2}>
                            {betType.type} <br />{" "}
                            {betType.type !== "Diamond Casino" &&
                              betType.type !== "Toss" && (
                                <label className="switch-teen">
                                  <input
                                    type="checkbox"
                                    checked={betType.status}
                                    onChange={(e) =>
                                      handleToggleChange(
                                        index,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="slider"></span>
                                </label>
                              )}
                          </th>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-responsive mt-4">
                <table className="table-teen table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Bet Delay</th>
                      <th>Matchodds</th>
                      <th>Bookmaker</th>
                      <th>Fancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.betDelays.map((delayType, index) => (
                      <tr key={delayType.type}>
                        <th>{delayType.type}</th>
                        <td>Bet Delay</td>
                        <td>
                          <input
                            type="number"
                            value={delayType.matchoddsDelay}
                            onChange={(e) =>
                              handleBetDelayChange(
                                index,
                                "matchoddsDelay",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          {delayType.bookmakerDelay !== null && (
                            <input
                              type="number"
                              value={delayType.bookmakerDelay}
                              onChange={(e) =>
                                handleBetDelayChange(
                                  index,
                                  "bookmakerDelay",
                                  Number(e.target.value)
                                )
                              }
                            />
                          )}
                        </td>
                        <td>
                          {delayType.fancyDelay !== null && (
                            <input
                              type="number"
                              value={delayType.fancyDelay}
                              onChange={(e) =>
                                handleBetDelayChange(
                                  index,
                                  "fancyDelay",
                                  Number(e.target.value)
                                )
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

             
              <div className="glo-botamtra">
                <label className="form-label">Transaction Password</label>
                <input
                  type="password"
                  className="mgray-input-box form-control text-end"
                  value={settings.transactionPassword}
                  onChange={handleTransactionPasswordChange}
                />
              </div>
              <div className="text-end mt-3">
                <button
                  className="btn modal-submit-btn"
                  onClick={handleUpdateSettings}
                >
                  Update
                </button>
              </div>
              <GlobalSettingsBanner/>
            </div>
          </div>
        </div>
      </div>

      {/* Whatsapp No. Modal */}
     
    </section>
  );
}

export default GlobalSettingsPage;
