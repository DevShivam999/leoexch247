import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import type { Transaction } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import { useDispatch } from "react-redux";
import ErrorHandler from "../utils/ErrorHandle";

const LedgeAccountStatement = () => {
  const location=useLocation()
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchAccountStatement = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await instance.get(
        `user/account-statements?page=1&limit=20&numeric_id=${id}&txType=3&from=&to=`,
      );

      setTransactions(response.data.results);
      setLoading(false);
    } catch (err) {
      // if (axios.isAxiosError(err)) {
      //   console.error("Axios Error detected:", err);
      //   if (err.response) {
      //     if (err.response.status === 401) {
      //       navigate("/login");
      //       dispatch(removeUser());
      //       setLocation(location.pathname)
      //     }
      //     setError(
      //       `Error: ${err.response.status} - ${
      //         err.response.data.message || "Something went wrong."
      //       }`,
      //     );
      //   } else if (err.request) {
      //     setError("Network Error: No response received from server.");
      //   } else {
      //     setError(`Request Setup Error: ${err.message}`);
      //   }
      // } else if (err instanceof Error) {
      //   setError(`General Error: ${err.message}`);
      // } else {
      //   setError("An unknown error occurred.");
      // }

                  ErrorHandler({err,dispatch,navigation:navigate,pathname:location.pathname,setError})
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "LedgeAccountStatement";
    fetchAccountStatement();
  }, []);

  return (
    <section className="mian-content">
      <div className="chip-summary-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Account Statement</h1>
              <button
                type="button"
                className="modal-submit-btn"
                onClick={() => navigate(-1)}
              >
                <i className="fa fa-arrow-left"></i> Back
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="ledger-table table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Action By</th>
                  <th>MyP/L</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Final P&L</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <Loading />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center text-danger">
                      {error}
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction._id}>
                      <td>{index + 1}</td>
                      <td>{new Date(transaction.created).toLocaleString()}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.refUser}</td>
                      <td>0</td>
                      <td
                        className={
                          transaction.txType === "CR" ? "text-green" : ""
                        }
                      >
                        {transaction.txType === "CR"
                          ? transaction.amount.toLocaleString()
                          : "0"}
                      </td>
                      <td
                        className={
                          transaction.txType === "DR" ? "text-red" : ""
                        }
                      >
                        {transaction.txType === "DR"
                          ? Math.abs(transaction.amount).toLocaleString()
                          : "0"}
                      </td>
                      <td>{transaction.balance.toLocaleString()}</td>
                      <td>{transaction.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <p className="market-not-found">
                        No Settlement Data Found!
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LedgeAccountStatement;
