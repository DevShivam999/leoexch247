const Bonus = () => {
  return (
    <section className="mian-content">
      <div className="bonus-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Bonus</h1>
              <button
                type="button"
                className="dark-button-2"
                data-bs-toggle="modal"
                data-bs-target="#add-bonus"
              >
                <i className="fas fa-plus"></i> Add Bonus
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-two">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Exp. Date</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Code</th>
                  <th>Bonus Amount</th>
                  <th>Min Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9}>
                    <p className="no-data">No Data Found!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Bonus Modal */}
      <div
        className="modal fade modal-one add-bonus"
        id="add-bonus"
        tabIndex={-1}
        aria-labelledby="add-bonusLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header dark-modal-header">
              <h1 className="modal-title" id="add-bonusLabel">
                Create Bonus
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
                  <label htmlFor="bonusName" className="lable-two">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bonusName"
                    required
                  />
                </div>

                <div className="col-6 mb-3">
                  <label htmlFor="bonusType" className="lable-two">
                    Type *
                  </label>
                  <select
                    className="form-select"
                    id="bonusType"
                    aria-label="Bonus type select"
                    required
                  >
                    <option value="">Select</option>
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="bonusDate" className="lable-two">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="bonusDate"
                    required
                  />
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="expDate" className="lable-two">
                    Exp. Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="expDate"
                    required
                  />
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="bonusCode" className="lable-two">
                    Code *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bonusCode"
                    required
                  />
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="bonusAmount" className="lable-two">
                    Bonus Amount *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="bonusAmount"
                    required
                  />
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="minAmount" className="lable-two">
                    Min amount *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="minAmount"
                    required
                  />
                </div>

                <div className="col-4 mb-3">
                  <label htmlFor="bonusStatus" className="lable-two">
                    Status *
                  </label>
                  <select
                    className="form-select"
                    id="bonusStatus"
                    aria-label="Bonus status select"
                    required
                  >
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-4 mb-3 mx-auto">
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

export default Bonus;
