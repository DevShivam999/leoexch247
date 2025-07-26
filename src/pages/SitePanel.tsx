const SitePanel = () => {
  return (
    <section className="mian-content">
      <div className="site-panel-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Site Panel</h1>
              <button
                type="button"
                className="dark-button-2"
                data-bs-toggle="modal"
                data-bs-target="#add-site"
              >
                <i className="fas fa-plus"></i> Add Site
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-two">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <p className="no-data">No Data Found!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Site Modal */}
      <div
        className="modal fade modal-one add-site"
        id="add-site"
        tabIndex={-1}
        aria-labelledby="add-siteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header dark-modal-header">
              <h1 className="modal-title" id="add-siteLabel">
                Add New Site
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
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="sitePaymentType" className="lable-two">
                    Payment Type
                  </label>
                  <select
                    className="form-select"
                    aria-label="Payment type select"
                    id="sitePaymentType"
                  >
                    <option value="">Payment Type</option>
                    <option value="UPI">UPI</option>
                    <option value="Barcode">Barcode</option>
                  </select>
                </div>
                <div className="col-7 mb-3 mx-auto">
                  <button
                    type="button"
                    className="btn modal-back-btn w-100"
                    data-bs-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitePanel;
