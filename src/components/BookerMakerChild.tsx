import { memo } from "react"

const BookerMakerChild = memo(({p}:{p:any}) => {
  return (
    <div
              className="row border-top-gray ps-3 market-odds-row m-0"
              key={p.runner}
            >
              <div className="col-7 team-name-detalis">
                <a className="team-name">{p.runner}</a>
                <div
                  style={{
                    color: p?.userbet && p?.userbet > 0 ? "green" : "red",
                  }}
                >
                  {p?.userbet ? (p.userbet == 0 ? "-"+p.userbet : p.userbet) : "-"}
                </div>
              </div>
              <div
                className="col-5 row p-0 m-0"
                style={{ position: "relative" }}
              >
                 <div className="col-3 back odds-box-1">
                  <span className="odds-value">
                   -
                  </span>
                  <span className="truncate-valus">
                    -
                  </span>
                </div>
                 <div className="col-3 back odds-box-1">
                  <span className="odds-value">
                    {p.ex.availableToBack[0].price}
                  </span>
                  <span className="truncate-valus">
                    {p.ex.availableToBack[0].size == 0
                      ? "-"
                      : p.ex.availableToBack[0].size}
                  </span>
                </div>
               
                <div className="col-3 lay odds-box-1">
                  <span className="odds-value">
                    {p.ex.availableToLay[0].price}
                  </span>
                  <span className="truncate-valus">
                    {p.ex.availableToLay[0].size == 0
                      ? "-"
                      : p.ex.availableToLay[0].size}
                  </span>
                </div>
               
                <div className="col-3 lay odds-box-1">
                  <span className="odds-value">
                   -
                  </span>
                  <span className="truncate-valus">
                    -
                  </span>
                </div>
                {p.status != "ACTIVE" && (
                  <div
                    className="col-12 suspended"
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
  )
})

export default BookerMakerChild
