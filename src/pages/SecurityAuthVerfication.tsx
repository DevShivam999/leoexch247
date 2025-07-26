const SecurityAuthVerification = () => {
  return (
    <section className="mian-content ">
      <div className="security-auth-verification-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one"> Security Auth Verification</h1>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-4">
              <div className="security-vf-contect">
                <div className="security-vf-contect-1">
                  <h4>Secure Auth Verification Status:</h4>
                  <button className="red-button" type="button">
                    Disabled
                  </button>
                </div>
                <div className="security-vf-contect-2 text-center">
                  <p>
                    Please select below option to enable secure auth
                    verification
                  </p>
                  <button className="green-button" type="button">
                    Enable Using Telegram
                  </button>
                </div>
                <div className="security-vf-contect-3 text-center">
                  <p>Please enter your login password to continue</p>
                  <div className="get-conne">
                    <input
                      type="text"
                      placeholder="Enter Your Login Password"
                      className="form-control"
                    />
                    <button type="button" className="dark-button">
                      Get Connection Id
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityAuthVerification;
