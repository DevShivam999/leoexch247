import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import { useNavigate } from "react-router-dom";
import useAppDispatch from "../hook/hook";
import Loading from "../components/Loading";
import ErrorHandler from "../utils/ErrorHandle";
import { success, Tp } from "../utils/Tp";

const DepositMethod = () => {
  const [paymentType, setPaymentType] = useState("");
  const [formData, setFormData] = useState<{
    HolderName: string;
    AccountNumber: string;
    IFSC: string;
    BankName: string;
    BenificiaryName: string;
    UPIType: string;
    mobile: string;
    UPID: string;
    image: File | null;
  }>({
    HolderName: "",
    AccountNumber: "",
    IFSC: "",
    BankName: "",
    BenificiaryName: "",
    UPIType: "Select",
    mobile: "",
    UPID: "",
    image: null,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pre, setPre] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any[]>([]);
  const [currentType, setCurrentType] = useState<string>("");

  // Validation rules
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!paymentType) {
      errors.paymentType = "Payment type is required";
    }

    if (paymentType === "Bank") {
      if (!formData.HolderName.trim()) errors.HolderName = "Name is required";
      if (!formData.AccountNumber.trim())
        errors.AccountNumber = "Account number is required";
      else if (!/^\d{9,18}$/.test(formData.AccountNumber))
        errors.AccountNumber = "Account number must be 9-18 digits";
      if (!formData.BankName.trim()) errors.BankName = "Bank name is required";
      if (!formData.IFSC.trim()) errors.IFSC = "IFSC code is required";
      // else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.IFSC)) errors.IFSC = "Invalid IFSC format";
      if (!formData.BenificiaryName.trim())
        errors.BenificiaryName = "Account type is required";
      if (!formData.image) errors.image = "Image is required";
    }

    if (paymentType === "UPI") {
      if (!formData.HolderName.trim()) errors.HolderName = "Name is required";
      if (formData.UPIType === "Select")
        errors.UPIType = "UPI type is required";
      if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
      else if (formData.mobile.trim().length < 10)
        errors.mobile = "Invalid mobile number";
      if (!formData.UPID.trim()) errors.UPID = "UPI ID is required";
      // else if (!/^[\w.-]+@[\w]+$/.test(formData.UPID)) errors.UPID = "Invalid UPI ID format";
    }

    if (paymentType === "Barcode") {
      if (!formData.HolderName.trim()) errors.HolderName = "Name is required";
      if (!formData.image) errors.image = "Barcode image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const Api = async () => {
    try {
      const { data } = await instance.get(
        `/admin/getbankAcc?type=${currentType.toLocaleLowerCase()}`
      );
      if (data?.data) {
        setBankData(
          data.data.Payment.sort((a: any, b: any) => b.primary - a.primary)
        );
        setPre(
          data.data.Payment.filter((item: any) => {
            if (item.primary) {
              return {
                method: item.type,
                paymentId: item.paymentId,
                primary: item.primary,
              };
            }
          })
        );
      }
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Api();
  }, [currentType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    // Apply input limits
    let processedValue = value;
    if (name === "AccountNumber" && value.length > 18) return;
    if (name === "mobile" && value.length > 10) return;
    if (name === "IFSC" && value.length > 11) return;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : processedValue,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const [showModel, setshowmodel] = useState(false);
  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(e.target.value);
    setFormData({
      HolderName: "",
      AccountNumber: "",
      IFSC: "",
      BankName: "",
      BenificiaryName: "",
      UPIType: "Select",
      mobile: "",
      UPID: "",
      image: null,
    });
    setFormErrors({});
  };

  const handleApiCall = async () => {
    if (!validateForm()) {
      Tp("Please fix the form errors");
      return;
    }

    setError(null);
    setLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("type", paymentType.toLocaleLowerCase());

    if (paymentType === "Bank") {
      dataToSend.append("HolderName", formData.HolderName);
      dataToSend.append("AccountNumber", formData.AccountNumber);
      dataToSend.append("IFSC", formData.IFSC);
      dataToSend.append("BankName", formData.BankName);
      dataToSend.append("BenificiaryName", formData.BenificiaryName);
      if (formData.image) dataToSend.append("imageUrl", formData.image);
    } else if (paymentType === "UPI") {
      dataToSend.append("HolderName", formData.HolderName);
      dataToSend.append("UPID", formData.UPID);
      dataToSend.append("mobile", formData.mobile);
      dataToSend.append("UPIType", formData.UPIType);
    } else if (paymentType === "Barcode") {
      dataToSend.append("HolderName", formData.HolderName);
      if (formData.image) dataToSend.append("imageUrl", formData.image);
    }

    try {
      await instance.post(`admin/addbank`, dataToSend);
      success("Payment method added successfully!");
      Api();

      setPaymentType("");
      setFormData({
        HolderName: "",
        AccountNumber: "",
        IFSC: "",
        BankName: "",
        BenificiaryName: "",
        UPIType: "Select",
        mobile: "",
        UPID: "",
        image: null,
      });

      // Close modal and refresh data
      document.getElementById("closeModal")?.click();
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };

  const DELETE_PAYMENT = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        await instance.post(`/user/deletebankAcc`, { paymentId: id });
        Api();
        success("Payment method deleted successfully!");
      } catch (error) {
        ErrorHandler({
          err: error,
          dispatch,
          navigation,
          pathname: location.pathname,
          setError,
        });
      }
    }
  };

  const Primary_PAYMENT = async (
    id: string,
    method: string,
    option = false
  ) => {
    // option === true → un-primary
    const message = option
      ? "Are you sure you want to remove this payment method from being primary?"
      : "Are you sure you want to make this payment method primary?";

    if (window.confirm(message)) {
      try {
        const existingPrimary = pre.find((item) => item.type === method);

        if (option) {
          // Remove primary flag
          await instance.post(`/user/editbankAcc`, {
            paymentId: existingPrimary?.paymentId ?? id,
            fields: { primary: false },
          });
        } else if (!existingPrimary) {
          // No primary yet → set current as primary
          await instance.post(`/user/editbankAcc`, {
            paymentId: id,
            fields: { primary: true },
          });
        } else {
          // Switch primary
          await Promise.all([
            instance.post(`/user/editbankAcc`, {
              paymentId: id,
              fields: { primary: true },
            }),
            instance.post(`/user/editbankAcc`, {
              paymentId: existingPrimary.paymentId,
              fields: { primary: false },
            }),
          ]);
        }

        Api();
        success(
          option
            ? "Payment method un-set as primary successfully!"
            : "Primary payment method updated successfully!"
        );
      } catch (error) {
        ErrorHandler({
          err: error,
          dispatch,
          navigation,
          pathname: location.pathname,
          setError,
        });
      }
    }
  };

  return (
    <section className="mian-content">
      <div className="deposit-payment-method-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Deposit Payment Method</h1>
            </div>
          </div>
          <div className="row align-items-end justify-content-between">
            <div className="col-md-2 mb-3">
              <label htmlFor="paymentType" className="lable-two">
                Payment Type <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${formErrors.paymentType ? "is-invalid" : ""}`}
                aria-label="Payment type select"
                id="paymentType"
                onChange={(e) => setCurrentType(e.target.value)}
                value={currentType}
              >
                <option value="">Payment Type</option>
                <option value="UPI">UPI</option>
                <option value="Barcode">Barcode</option>
                <option value="Bank">Bank</option>
              </select>
              {formErrors.paymentType && (
                <div className="invalid-feedback">{formErrors.paymentType}</div>
              )}
            </div>
            <div className="col-md-2 mb-3 text-end">
              <button
                type="button"
                className="dark-button-2"
                data-bs-toggle="modal"
                data-bs-target="#add-payment-method"
                onClick={() => {
                  setPaymentType("");
                  setshowmodel((p) => !p);
                  setFormErrors({});
                }}
              >
                <i className="fas fa-plus"></i> Add Payment Method
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-two">
              <thead>
                <tr className="text-center">
                  <th>Date</th>
                  <th>Name</th>
                  <th>IFSC Code</th>
                  <th>A/C Type</th>
                  <th>Preference</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bankData.length > 0 ? (
                  bankData.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.HolderName}</td>
                      <td>{item.IFSC ?? "-"}</td>
                      <td>{item.BenificiaryName ?? "-"}</td>
                      <td>{item.type}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => DELETE_PAYMENT(item.paymentId)}
                          >
                            Delete
                          </button>
                          <button
                            className={`btn btn-sm ms-2 ${item.primary ? "btn-success" : "btn-warning"}`}
                            onClick={() =>
                              !item.primary
                                ? Primary_PAYMENT(item.paymentId, item.type)
                                : Primary_PAYMENT(
                                    item.paymentId,
                                    item.type,
                                    true
                                  )
                            }
                          >
                            {item.primary ? "Primary ✔" : "Make Primary"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : loading ? (
                  <tr>
                    <td colSpan={6} className="text-center no-data">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center no-data">
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModel && (
        <div
          className="modal fade modal-one add-payment-method"
          id="add-payment-method"
          tabIndex={-1}
          aria-labelledby="add-payment-methodLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header dark-modal-header">
                <h1 className="modal-title" id="add-payment-methodLabel">
                  Add Payment Method
                </h1>
                <button
                  type="button"
                  className="modal-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="closeModal"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="modalPaymentType" className="lable-two">
                      Payment Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.paymentType ? "is-invalid" : ""}`}
                      onChange={handlePaymentTypeChange}
                      aria-label="Modal payment type select"
                      id="modalPaymentType"
                      value={paymentType}
                    >
                      <option value="">Select</option>
                      <option value="Bank">Bank</option>
                      <option value="UPI">UPI</option>
                      <option value="Barcode">Barcode</option>
                    </select>
                    {formErrors.paymentType && (
                      <div className="invalid-feedback">
                        {formErrors.paymentType}
                      </div>
                    )}
                  </div>

                  {paymentType === "Bank" && (
                    <>
                      <div className="col-6 mb-3">
                        <label htmlFor="holderName" className="lable-two">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.HolderName ? "is-invalid" : ""}`}
                          placeholder="Name"
                          type="text"
                          required
                          name="HolderName"
                          id="holderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                          maxLength={50}
                        />
                        {formErrors.HolderName && (
                          <div className="invalid-feedback">
                            {formErrors.HolderName}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="accountNumber" className="lable-two">
                          Account No <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.AccountNumber ? "is-invalid" : ""}`}
                          placeholder="Account No"
                          type="number"
                          required
                          name="AccountNumber"
                          id="accountNumber"
                          value={formData.AccountNumber}
                          onChange={handleInputChange}
                          maxLength={18}
                        />
                        {formErrors.AccountNumber && (
                          <div className="invalid-feedback">
                            {formErrors.AccountNumber}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="bankName" className="lable-two">
                          Bank Name <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.BankName ? "is-invalid" : ""}`}
                          placeholder="Bank Name"
                          type="text"
                          name="BankName"
                          required
                          id="bankName"
                          value={formData.BankName}
                          onChange={handleInputChange}
                          maxLength={50}
                        />
                        {formErrors.BankName && (
                          <div className="invalid-feedback">
                            {formErrors.BankName}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="ifsc" className="lable-two">
                          IFSC Code <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.IFSC ? "is-invalid" : ""}`}
                          placeholder="IFSC"
                          type="text"
                          name="IFSC"
                          required
                          id="ifsc"
                          value={formData.IFSC}
                          onChange={handleInputChange}
                          maxLength={11}
                          style={{ textTransform: "uppercase" }}
                        />
                        {formErrors.IFSC && (
                          <div className="invalid-feedback">
                            {formErrors.IFSC}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="beneficiaryName" className="lable-two">
                          Account Type <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.BenificiaryName ? "is-invalid" : ""}`}
                          placeholder="Account Type"
                          type="text"
                          required
                          name="BenificiaryName"
                          id="beneficiaryName"
                          value={formData.BenificiaryName}
                          onChange={handleInputChange}
                          maxLength={30}
                        />
                        {formErrors.BenificiaryName && (
                          <div className="invalid-feedback">
                            {formErrors.BenificiaryName}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="imageUploadBank" className="lable-two">
                          Bank Image <span className="text-danger">*</span>
                        </label>
                        <div className="text-center">
                          <img
                            src={
                              formData.image
                                ? URL.createObjectURL(formData.image)
                                : "/userImages.jpg"
                            }
                            alt="preview"
                            width={150}
                            height={150}
                            className="img-thumbnail"
                          />
                        </div>
                        {formErrors.image && (
                          <div className="text-danger small">
                            {formErrors.image}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mb-3">
                        <input
                          className={`form-control view-input ${formErrors.image ? "is-invalid" : ""}`}
                          type="file"
                          name="image"
                          required
                          id="imageUploadBank"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            if (file && file.size > 2 * 1024 * 1024) {
                              setFormErrors((prev) => ({
                                ...prev,
                                image: "Image size should be less than 2MB",
                              }));
                              return;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              image: file,
                            }));
                            if (formErrors.image) {
                              setFormErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.image;
                                return newErrors;
                              });
                            }
                          }}
                        />
                        <small className="text-muted">
                          Max size: 2MB (JPEG, PNG)
                        </small>
                      </div>
                    </>
                  )}

                  {paymentType === "UPI" && (
                    <>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiHolderName" className="lable-two">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.HolderName ? "is-invalid" : ""}`}
                          placeholder="Name"
                          type="text"
                          required
                          name="HolderName"
                          id="upiHolderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                          maxLength={50}
                        />
                        {formErrors.HolderName && (
                          <div className="invalid-feedback">
                            {formErrors.HolderName}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiType" className="lable-two">
                          UPI Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${formErrors.UPIType ? "is-invalid" : ""}`}
                          aria-label="UPI type select"
                          name="UPIType"
                          id="upiType"
                          value={formData.UPIType}
                          onChange={handleInputChange}
                        >
                          <option value="Select">Select</option>
                          <option value="Google Pay">Google Pay</option>
                          <option value="Phone Pay">Phone Pay</option>
                          <option value="Paytm">Paytm</option>
                        </select>
                        {formErrors.UPIType && (
                          <div className="invalid-feedback">
                            {formErrors.UPIType}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="mobileNo" className="lable-two">
                          Mobile No <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control view-input ${formErrors.mobile ? "is-invalid" : ""}`}
                          placeholder="Mobile No"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required
                          name="mobile"
                          id="mobileNo"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                        {formErrors.mobile && (
                          <div className="invalid-feedback">
                            {formErrors.mobile}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiId" className="lable-two">
                          UPI ID <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.UPID ? "is-invalid" : ""}`}
                          placeholder="UPI ID (e.g., name@upi)"
                          type="text"
                          name="UPID"
                          required
                          id="upiId"
                          value={formData.UPID}
                          onChange={handleInputChange}
                          maxLength={50}
                        />
                        {formErrors.UPID && (
                          <div className="invalid-feedback">
                            {formErrors.UPID}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {paymentType === "Barcode" && (
                    <>
                      <div className="col-6 mb-3">
                        <label
                          htmlFor="barcodeHolderName"
                          className="lable-two"
                        >
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control view-input ${formErrors.HolderName ? "is-invalid" : ""}`}
                          placeholder="Name"
                          type="text"
                          name="HolderName"
                          required
                          id="barcodeHolderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                          maxLength={50}
                        />
                        {formErrors.HolderName && (
                          <div className="invalid-feedback">
                            {formErrors.HolderName}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mb-3">
                        <label
                          htmlFor="imageUploadBarcode"
                          className="lable-two"
                        >
                          Barcode Image <span className="text-danger">*</span>
                        </label>
                        <div className="text-center p-1">
                          <img
                            src={
                              formData.image
                                ? URL.createObjectURL(formData.image)
                                : "/qr_code.png"
                            }
                            alt="preview"
                            width={170}
                            height={170}
                            className="img-thumbnail"
                          />
                        </div>
                        {formErrors.image && (
                          <div className="text-danger small">
                            {formErrors.image}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mb-3">
                        <input
                          className={`form-control view-input ${formErrors.image ? "is-invalid" : ""}`}
                          type="file"
                          name="image"
                          required
                          id="imageUploadBarcode"
                          onChange={(e) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            if (file && file.size > 2 * 1024 * 1024) {
                              setFormErrors((prev) => ({
                                ...prev,
                                image: "Image size should be less than 2MB",
                              }));
                              return;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              image: file,
                            }));
                            if (formErrors.image) {
                              setFormErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.image;
                                return newErrors;
                              });
                            }
                          }}
                          accept="image/*"
                        />
                        <small className="text-muted">
                          Max size: 2MB (JPEG, PNG)
                        </small>
                      </div>
                    </>
                  )}

                  {paymentType && (
                    <div className="col-7 mb-3 mx-auto">
                      <button
                        type="button"
                        className="btn modal-back-btn w-100"
                        onClick={handleApiCall}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          "Save Payment Method"
                        )}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="col-12 text-center text-danger">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DepositMethod;
