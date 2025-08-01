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

  
    </section>
  );
};

export default Bonus;
