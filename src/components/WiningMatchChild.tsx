import formatNumberShort from "../utils/NumberFormate"

const WiningMatchChild = ({WiningMatch}:{WiningMatch:any}) => {
    

  
  return (
   <div className="match-market-2 " key={WiningMatch?.market}>
            <div className="market-name">{WiningMatch?.market}</div>
            <div className="row align-items-center m-0">
              <div className="col-7 team-name-detalis">
               {WiningMatch?.maxb&&WiningMatch.maxb!=0?<h3 className="match-minmax">Max:{formatNumberShort(WiningMatch.maxb)}</h3>: <h3 className="match-minmax">Min:{WiningMatch.min},Max:{formatNumberShort(WiningMatch.max)}</h3>}
              </div>
              <div className="col-5 row justify-content-center m-0 p-0">
                <div className="col-2 back lay-back-box">
                  <span className="odds-black-lay">Back</span>
                </div>
                <div className="col-2 lay lay-back-box">
                  <span className="odds-black-lay">Lay</span>
                </div>
              </div>
            </div>
            {WiningMatch?.runners &&
              WiningMatch.runners.map((p: any) => (
                <div
                  className="row border-top-gray market-odds-row ps-3 m-0"
                  key={p.selectionId}
                >
                  <div className="col-7 team-name-detalis">
                    <a className="team-name">{p.name}</a>
                    <div
                      style={{
                        color: p?.userbet
                          ? p?.userbet > 0
                            ? "green"
                            : "red"
                          : "black",
                      }}
                    >
                      {p?.userbet ? (p.userbet == 0 ? "-" : p.userbet) : "-"}
                    </div>
                  </div>

                  <div
                    className="col-5 row p-0 m-0"
                    style={{ position: "relative" }}
                  >
                    {p.ex?.availableToBack.length > 0 ||
                    p.ex.availableToLay.length > 0 ? (
                      <>
                        <div className="col-2 back2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToBack[2]?.price == 0
                              ? "-"
                              : (p.ex.availableToBack[2]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToBack[2]?.size == 0
                              ? "-"
                              : (p.ex.availableToBack[2]?.size ?? "-")}
                          </span>
                        </div>
                        <div className="col-2 back2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToBack[1]?.price == 0
                              ? "-"
                              : (p.ex.availableToBack[1]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToBack[1]?.size == 0
                              ? "-"
                              : (p.ex.availableToBack[1]?.size ?? "-")}
                          </span>
                        </div>
                        <div className="col-2 back2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToBack[0]?.price == 0
                              ? "-"
                              : (p.ex.availableToBack[0]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToBack[0]?.size == 0
                              ? "-"
                              : (p.ex.availableToBack[0]?.size ?? "-")}
                          </span>
                        </div>

                        <div className="col-2 lay2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToLay[0]?.price == 0
                              ? "-"
                              : (p.ex.availableToLay[0]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToLay[0]?.size == 0
                              ? "-"
                              : (p.ex.availableToLay[0]?.size ?? "-")}
                          </span>
                        </div>
                        <div className="col-2 lay2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToLay[1]?.price == 0
                              ? "-"
                              : (p.ex.availableToLay[1]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToLay[1]?.size == 0
                              ? "-"
                              : (p.ex.availableToLay[1]?.size ?? "-")}
                          </span>
                        </div>
                        <div className="col-2 lay2 odds-box-1">
                          <span className="odds-value">
                            {p.ex.availableToLay[2]?.price == 0
                              ? "-"
                              : (p.ex.availableToLay[2]?.price ?? "-")}
                          </span>
                          <span className="truncate-valus">
                            {p.ex.availableToLay[2]?.size == 0
                              ? "-"
                              : (p.ex.availableToLay[2]?.size ?? "-")}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-2 back2 odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                        <div className="col-2 back1 odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                        <div className="col-2 back odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                        <div className="col-2 lay odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                        <div className="col-2 lay1 odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                        <div className="col-2 lay2 odds-box-1">
                          <span className="odds-value">-</span>
                          <span className="truncate-valus">-</span>
                        </div>
                      </>
                    )}

                    {p.status?.length > 0 && p.status != "ACTIVE" && (
                      <div
                        className="col-12 suspended "
                        style={{
                          position: "absolute",
                          backgroundColor: "rgb(0 0 0 / 65%)",
                          height: "100%",
                          justifyContent: "center",

                          color: "red",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {p.status}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
  )
}

export default WiningMatchChild
