import React, { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import FancyChild from "./FancyChild";
import type { FancyMarketData } from "../types/vite-env";

const groupByGtype = (data: FancyMarketData[]) => {
  return data.reduce((acc: Record<string, FancyMarketData[]>, item) => {
    if (!acc[item.gtype]) acc[item.gtype] = [];
    acc[item.gtype].push(item);
    return acc;
  }, {});
};

const CricketMatchDetails = React.memo(
  ({ data, id }: { data: FancyMarketData[]; id: string }) => {
    const [fancyData, setFancyData] = useState<FancyMarketData[]>(data);

    const Api = async () => {
      try {
        const { data } = await instance(
          `/betting/session-summary?matchId=${id}`
        );

        if (fancyData != null) {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            setFancyData((prevData: any) =>
              prevData.map((prevBookMakerData: any) => {
                const updatedMarketData =
                  element.marketId === prevBookMakerData.marketId;

                if (updatedMarketData) {
                  const newRunnerData =
                    element.selectionId == prevBookMakerData.SelectionId;

                  if (newRunnerData) {
                    return {
                      ...prevBookMakerData,
                      userbet: element.exposer,
                    };
                  }
                  return prevBookMakerData;
                }

                return prevBookMakerData;
              })
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      Api(); // ✅ first call immediately when match page open

      const interval = setInterval(() => {
        Api(); // ✅ call again every 5 seconds
      }, 10000);

      return () => clearInterval(interval); // ✅ cleanup on unmount or id change
    }, [id]);

    const groupedData = groupByGtype(fancyData);

    return (
      <div className="row">
        {Object.entries(groupedData).map(([gtype, items]) => (
          <div className="col-12" key={gtype}>
            <div className="match-markte-fancy">
              <div className="market-name">{gtype} Market</div>
              <div className="row align-items-center m-0 mb-2">
                <div className="col-6 team-name-detalis">
                  <h3 className="runners-name"></h3>
                </div>
                {gtype != "oddeven" && (
                  <div className="col-6 row m-0 p-0">
                    {gtype != "khado" && (
                      <div className="col-3 lay lay-back-box">
                        <span className="odds-black-lay">
                          {gtype == "fancy1" ? "Lay" : "No"}
                        </span>
                      </div>
                    )}
                    <div
                      className={`${
                        gtype == "khado" ? "col-6" : "col-3"
                      } lay-back-box back`}
                    >
                      <span className="odds-black-lay">
                        {gtype == "fancy1" || gtype == "khado" ? "Back" : "Yes"}
                      </span>
                    </div>
                    <div className="col-6"></div>
                  </div>
                )}
              </div>

              <div className="row">
                {items.map((p) => (
                  <div className=" mb-2" key={p.RunnerName}>
                    <FancyChild type={gtype} p={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default CricketMatchDetails;
