import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import { useNavigate } from "react-router-dom";
import useAppDispatch from "../hook/hook";
import Loading from "../components/Loading";
import ErrorHandler from "../utils/ErrorHandle";
import { Tp } from "../utils/Tp";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pre, setPre] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any[]>([]);
  const [currentType, setCurrentType] = useState<string>("");

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
      // console.error("Error fetching bank data:", error);
      // if (axios.isAxiosError(error) && error.response) {
      //   if (error.status == 401) {
      //     (navigation("/login"), dispatch(removeUser()),setLocation("/deposit-payment-method"));
      //   }
      // } else if (error instanceof Error) {
      //   setError(
      //     error.message ||
      //       "Failed to fetch bet details. An unknown error occurred."
      //   );
      // } else {
      //   setError("Failed to fetch bet details. An unknown error occurred.");
      // }

                  ErrorHandler({err:error,dispatch,navigation,pathname:location.pathname,setError})
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Api();
  }, [currentType]);

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
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
  };
  const handleApiCall = async () => {
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

      if (formData.image) {
        dataToSend.append("imageUrl", formData.image);
        console.log("Form Data for Bank:", formData.image);
      }
    } else if (paymentType === "UPI") {
      dataToSend.append("HolderName", formData.HolderName);
      dataToSend.append("UPID", formData.UPID);
      dataToSend.append("mobile", formData.mobile);
      dataToSend.append("UPIType", formData.UPIType);
    } else if (paymentType === "Barcode") {
      dataToSend.append("HolderName", formData.HolderName);
      if (formData.image) {
        dataToSend.append("imageUrl", formData.image);
      }
    } else {
      Tp("Please select a payment type.");
      setLoading(false);
      return;
    }

    try {
      await instance.post(`admin/addbank`, dataToSend);

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
    } catch (err) {
      // console.error("Error fetching account statements:", err);
      // if (axios.isAxiosError(err) && err.response) {
      //   if (err.status == 401) {
      //     (navigation("/login"), dispatch(removeUser()),setLocation("/deposit-payment-method"));
      //   }
      //   setError(
      //     err.response.data.message ||
      //       "Failed to fetch account statement. Please try again."
      //   );
      // } else if (err instanceof Error) {
      //   setError(
      //     err.message ||
      //       "Failed to fetch account statement. An unknown error occurred."
      //   );
      // } else {
      //   setError(
      //     "Failed to fetch account statement. An unknown error occurred."
      //   );
      // }


                  ErrorHandler({err,dispatch,navigation,pathname:location.pathname,setError})
    } finally {
      setLoading(false);
    }
  };
  const DELETE_PAYMENT = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        await instance.post(`/user/deletebankAcc`, {
          paymentId: id,
        });
        Api();
      } catch (error) {
        // console.error("Error deleting payment method:", error);
        // if (axios.isAxiosError(error) && error.response) {
        //   if (error.status == 401) {
        //     (navigation("/login"), dispatch(removeUser()),setLocation("/deposit-payment-method"));
        //   }
        // } else if (error instanceof Error) {
        //   setError(
        //     error.message ||
        //       "Failed to fetch bet details. An unknown error occurred."
        //   );
        // } else {
        //   setError("Failed to fetch bet details. An unknown error occurred.");
        // }

                    ErrorHandler({err:error,dispatch,navigation,pathname:location.pathname,setError})
      }
    }
  };
  const Primary_PAYMENT = async (
    id: string,
    method: string,
    option = false
  ) => {
    if (
      window.confirm(
        "Are you sure you want to  make  Primary this payment method?"
      )
    ) {
      try {
        const existingPrimary = pre.find((item) => item.type == method);
        if (option) {
          await instance.post(`/user/editbankAcc`, {
            paymentId: existingPrimary.paymentId,
            fields: {
              primary: false,
            },
          });
        } else if (!existingPrimary) {
          await instance.post(`/user/editbankAcc`, {
            paymentId: id,
            fields: {
              primary: true,
            },
          });
        } else {
          (await Promise.all([
            instance.post(`/user/editbankAcc`, {
              paymentId: id,
              fields: {
                primary: true,
              },
            }),
          ]),
            instance.post(`/user/editbankAcc`, {
              paymentId: existingPrimary.paymentId,
              fields: {
                primary: false,
              },
            }));
        }
        Api();
      } catch (error) {
        // console.error("Error deleting payment method:", error);
        // if (axios.isAxiosError(error) && error.response) {
        //   if (error.status == 401) {
        //     (navigation("/login"), dispatch(removeUser()),setLocation("/deposit-payment-method"));
        //   }
        // } else if (error instanceof Error) {
        //   setError(
        //     error.message ||
        //       "Failed to fetch bet details. An unknown error occurred."
        //   );
        // } else {
        //   setError("Failed to fetch bet details. An unknown error occurred.");
        // }

                    ErrorHandler({err:error,dispatch,navigation,pathname:location.pathname,setError})
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
                Payment Type
              </label>

              <select
                className="form-select"
                aria-label="Payment type select"
                id="paymentType"
                onChange={(e) => setCurrentType(e.target.value)}
              >
                <option value="">Payment Type</option>
                <option value="UPI">UPI</option>
                <option value="Barcode">Barcode</option>
                <option value="Bank">Bank</option>
              </select>
            </div>
            <div className="col-md-2 mb-3 text-end">
              <button
                type="button"
                className="dark-button-2"
                data-bs-toggle="modal"
                data-bs-target="#add-payment-method"
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
                        <button
                          className="btn btn-danger"
                          onClick={() => DELETE_PAYMENT(item.paymentId)}
                        >
                          Delete
                        </button>
                      
                          <button
                            className="btn btn-warning ms-2"
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
                           {!item.primary?" Make ":"✔"} Primary
                          </button>
                      
                      
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
                Payment
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
                  <label htmlFor="modalPaymentType" className="lable-two">
                    Payment Type
                  </label>
                  <select
                    className="form-select"
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
                </div>

                <>
                  {paymentType === "Bank" && (
                    <>
                      <div className="col-6 mb-3">
                        <label htmlFor="holderName" className="lable-two">
                          Name
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Name"
                          type="text"
                          name="HolderName"
                          id="holderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="accountNumber" className="lable-two">
                          Account No
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Account No"
                          type="text"
                          name="AccountNumber"
                          id="accountNumber"
                          value={formData.AccountNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="bankName" className="lable-two">
                          Bank Name
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Bank Name"
                          type="text"
                          name="BankName"
                          id="bankName"
                          value={formData.BankName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="ifsc" className="lable-two">
                          IFSC
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="IFSC"
                          type="text"
                          name="IFSC"
                          id="ifsc"
                          value={formData.IFSC}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="beneficiaryName" className="lable-two">
                          Account Type
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Account Type"
                          type="text"
                          name="BenificiaryName"
                          id="beneficiaryName"
                          value={formData.BenificiaryName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="imageUploadBank" className="lable-two">
                          Image
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
                          />
                        </div>
                      </div>
                      <div className="col-12 mb-3">
                        <input
                          className="form-control view-input"
                          type="file"
                          name="image"
                          id="imageUploadBank"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              image: e.target.files ? e.target.files[0] : null,
                            }))
                          }
                        />
                      </div>
                    </>
                  )}

                  {paymentType === "UPI" && (
                    <>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiHolderName" className="lable-two">
                          Name
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Name"
                          type="text"
                          name="HolderName"
                          id="upiHolderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiType" className="lable-two">
                          Type
                        </label>
                        <select
                          className="form-select"
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
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="mobileNo" className="lable-two">
                          Mobile No
                        </label>
                        <input
                          type="tel"
                          className="form-control view-input"
                          placeholder="Mobile No"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          name="mobile"
                          id="mobileNo"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="upiId" className="lable-two">
                          UPI ID
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="UPI ID"
                          type="text"
                          name="UPID"
                          id="upiId"
                          value={formData.UPID}
                          onChange={handleInputChange}
                        />
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
                          Name
                        </label>
                        <input
                          className="form-control view-input"
                          placeholder="Name"
                          type="text"
                          name="HolderName"
                          id="barcodeHolderName"
                          value={formData.HolderName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label
                          htmlFor="imageUploadBarcode"
                          className="lable-two"
                        >
                          Barcode
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
                          />
                        </div>
                      </div>
                      <div className="col-12 mb-3">
                        <input
                          className="form-control view-input"
                          type="file"
                          name="image"
                          id="imageUploadBarcode"
                          onChange={handleInputChange}
                          accept="image/*"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-7 mb-3 mx-auto">
                    <button
                      type="submit"
                      className="btn modal-back-btn w-100"
                      onClick={() => handleApiCall()}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
                {error && (
                  <div className="col-12 text-center text-danger">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositMethod;
