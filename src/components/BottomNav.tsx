import React from "react";

const BottomNav = ({
  LEDGER,
  setPage,
  total,current
  ,Device=10
}: {
  LEDGER: any[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total:number,
  Device?:number,
  current:number
}) => {
  return (
    <div className="profile-card-footer">
      <div className="pagination-row">
        <p className="pagination-txet">
          Showing {current} to {LEDGER?.length || 0} of
          {LEDGER?.length || 0} entries
        </p>
        {total> 10 && (
          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item">
                <button
                disabled={current==1}
                  className="page-link"
                  onClick={() => {
                    setPage((p) => p - 1);
                  }}
                >
                  Previous
                </button>
              </li>
              {Array.from(
                { length: Math.ceil(total / Device) },
                (_, i) => i + 1
              ).map((p) => (
                <li key={p} className={`page-item ${p==current&&"active"}`}>
                  <button
                  
                  
                  className={`page-link px-2`} style={{fontSize: "14px"}}
                    onClick={() => {
                      setPage(p);
                    }}
                  >
                    {p}
                  </button>
                </li>
              ))}

              <li className="page-item">
                <button
                disabled={Math.ceil(total/10)==current}
                  className="page-link"
                  onClick={() => {
                    setPage((p) => p + 1);
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default BottomNav;
