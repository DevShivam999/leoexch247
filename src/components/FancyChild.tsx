import type { FancyMarketData } from "../types/vite-env";

const FancyChild = ({ p, type }: { p: FancyMarketData; type: string }) => {
  // exposer / userbet formatting
  const exposer =
    p?.userbet === undefined || p?.userbet === null || p?.userbet === 0
      ? null
      : Number(p.userbet).toFixed(2);

  return (
    <div
      key={p.RunnerName}
      className="row border-top-gray market-odds-row fancy-row m-0 "
    >
      <div className="col-6 team-name-detalis">
        <a className="team-name-fancy">{p.RunnerName}</a>
        <div
          style={{
            fontWeight: "bold",
            color:
              exposer != null
                ? Number(p.userbet) > 0
                  ? "green"
                  : "red"
                : "black",
          }}
        >
          {exposer !== null ? exposer : "-"}
        </div>
      </div>

      <div className="col-6 row p-0 m-0">
        <div className="row ">
          <div className="col-6 d-flex" style={{ position: "relative" }}>
            {type != "khado" && (
              <div
                className={`${type == "oddeven" ? "back" : "lay"} odds-box-1`}
                style={{ width: "100%" }}
              >
                <span className="odds-value">{p.LayPrice1}</span>
                <span className="truncate-valus">
                  {p.BackSize1 == 0 ? "-" : p.BackSize1}
                </span>
              </div>
            )}

            <div className="back odds-box-1" style={{ width: "100%" }}>
              <span className="odds-value">{p.BackPrice1}</span>
              <span className="truncate-valus">
                {p.LaySize1 == 0 ? "-" : p.LaySize1}
              </span>
            </div>

            {p.g_status === "Ball Running" || p.g_status === "SUSPENDED" ? (
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
                {p.g_status}
              </div>
            ) : null}
          </div>

          <div className="col-5 fancy-minmax">
            {p?.maxb && p.maxb != 0 ? (
              <div>Max:{p.maxb}</div>
            ) : (
              <>
                <div>Min:{p.min}</div>
                <div>Max:{p.max}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyChild;
