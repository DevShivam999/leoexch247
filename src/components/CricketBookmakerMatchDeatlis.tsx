
import { memo } from "react";
import BookerMakerChild from "./BookerMakerChild";
import formatNumberShort from "../utils/NumberFormate";

const CricketBookmakerMatchDetails = memo(({
  BookMakerData,
}: {
  BookMakerData: any;
}) => {
  
  return (
    <>
    {
      BookMakerData.map((BookMakerData:any)=>  <div className="match-market-2 ">
        <div className="market-name">
          {BookMakerData.marketName||BookMakerData.market} Market
        </div>
        <div className="row align-items-center m-0">
          <div className="col-7 team-name-detalis">
           {BookMakerData?.maxb&&BookMakerData.maxb!=0?  <h3 className="match-minmax">Max:{formatNumberShort(BookMakerData.maxb)}</h3>:<h3 className="match-minmax">Min:{BookMakerData.min},Max:{formatNumberShort(BookMakerData.max)}</h3>}
          </div>
          <div className="col-5 row justify-content-center ml p-0 m-0">
            <div className="col-2 back lay-back-box">
              <span className="odds-black-lay">Back</span>
            </div>
            <div className="col-2 lay lay-back-box">
              <span className="odds-black-lay">Lay</span>
            </div>
          </div>
        </div>

        {BookMakerData &&
          BookMakerData?.runners &&
          BookMakerData.runners.map((p: any) => {
            return (<BookerMakerChild p={p} key={p.runner}/>)}
          )}
      </div>)
    }
    </>
  );
});

export default CricketBookmakerMatchDetails;
