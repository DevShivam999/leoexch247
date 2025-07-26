import type { RootState } from "../helper/store";
import { useAppSelector } from "../hook/hook";
import formatNumberShort from "../utils/NumberFormate";
import type { FancyMarketData } from "../types/vite-env";

const FancyChild = ({ p ,type}: { p: FancyMarketData,type:string }) => {
 
  

  const ok=useAppSelector((op: RootState) => op.FancyBetData.Fancy.find((f) => f.sessionRunner === p.RunnerName));

  return (
    <div
      key={p.RunnerName}
      className="row border-top-gray ps-3 market-odds-row fancy-row m-0 "
    >
      <div className="col-6 team-name-detalis">
        <a className="team-name-fancy">{p.RunnerName}</a>
        <div
          style={{
            color: `${ok? (ok.betAmount > 0 ? "green" : "red") : "black"}`,
          }}
        >
          {ok?ok.betAmount: "-"}
        </div>
      </div>
      <div className="col-6 row p-0 m-0">
        <div className="row ">
          <div className="col-6  d-flex" style={{ position: "relative" }}>
          {type!="khado"&&  <div className={`${type=="oddeven"?"back":"lay"}   odds-box-1`} style={{ width: "100%" }}>
              <span className="odds-value">{p.LayPrice1}</span>
              <span className="truncate-valus">{p.BackSize1}</span>
            </div>}
            <div className=" back odds-box-1" style={{ width: "100%" }}>
              <span className="odds-value">{p.BackPrice1}</span>
              <span className="truncate-valus">{p.LaySize1}</span>
            </div>
            {p.g_status === "Ball Running" ||
              (p.g_status === "SUSPENDED" && (
                <div
                  className="col-3 "
                  style={{
                    textAlign: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "90%",
                    marginLeft: "10px",
                    height: "100%",
                    backgroundColor: "rgb(0 0 0 / 65%)",
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {p.g_status}
                </div>
              ))}
          </div>

          <div className="col-5 fancy-minmax">
        {p?.maxb&&p.maxb!=0? <div>Max:{formatNumberShort(Number(p.maxb))}</div>:   <>
            <div>Min:{p.min}</div>
            <div>Max:{formatNumberShort(Number(p.max))}</div>
           </>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyChild;
