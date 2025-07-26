const ClientCommissionLedge = () => {
  return (
    <section className="mian-content">
      <div
        className="modal fade modal-one all-resetlogModal"
        id="all-resetlogModal"
        tabIndex={-1}
        aria-labelledby="all-resetlogModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header dark-modal-header">
              <h1 className="modal-title" id="all-resetlogModalLabel">
                All Reset Log
              </h1>
              <button
                type="button"
                className="modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className=" table-responsive">
                <table className="table table-commission-loss">
                  <thead>
                    <tr>
                      <th style={{ width: "250px" }} rowSpan={2}>
                        Name
                      </th>
                      <th colSpan={3} className="text-center">
                        MILA HAI
                      </th>
                      <th colSpan={3} className="text-center">
                        DENA HAI
                      </th>
                    </tr>

                    <tr>
                      <th>M.Comm</th>
                      <th>S.Comm</th>
                      <th>T.Comm</th>
                      <th>M.Comm</th>
                      <th>S.Comm</th>
                      <th>T.Comm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="container-div">
                          <span>BIGADMIN</span>
                          <span>
                            <a href="#" className="link-btn">
                              <i className="far fa-file-alt"></i>{" "}
                            </a>{" "}
                            <a href="#" className="reset-btn">
                              Reset
                            </a>
                          </span>
                        </div>
                      </td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="commission-loss-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Client Commission Lenden</h1>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-12 mb-3 text-end">
              <a
                href="#all-resetlogModal"
                className="button-teen"
                data-bs-toggle="modal"
                data-bs-target="#all-resetlogModal"
              >
                <i className="far fa-file-alt"></i> All Reset Log
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientCommissionLedge;
