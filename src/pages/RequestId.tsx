const RequestId = () => {
  return (
    <section className="mian-content">
      <div className="id-request-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">ID Request</h1>
            </div>
          </div>

          <div className="row align-items-end justify-content-between">
            <div className="col-md-2 mb-3">
              <label htmlFor="requestStatus" className="lable-two">
                ID Request
              </label>
              <select
                className="form-select"
                aria-label="ID request status filter"
                id="requestStatus"
              >
                <option value="pending">Pending</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-two">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Site</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Screenshot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <p className="no-data">No Data Found!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestId;
