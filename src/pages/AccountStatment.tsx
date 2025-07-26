import { useEffect, useRef, useState } from "react";
import type {
  AccountStatementData,
  AccountStatementsApiResponse,
} from "../types/vite-env";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";


import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";

import SearchCom from "../components/SearchCom";
import DateInput from "../components/DateInput";

const AccountStatement = () => {
  const location = useLocation();
  const [accountType, setAccountType] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const { id } = useParams();
  const dataFormate = (ok: boolean) => {
    let today = new Date();
    if (ok) {
      today.setDate(today.getDate() - 30);
    }
    today = new Date(today);

    return today.toISOString().split("T")[0];
  };

  const FromDate = useRef<HTMLInputElement | null>(null);
  const toDate = useRef<HTMLInputElement | null>(null);
  const [accountStatements, setAccountStatements] = useState<
    AccountStatementData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(25);
const exportPDF = async (data:any) => {
  const { PdfFile } = await import("../utils/PdfFile");
  await PdfFile(data, "AccountStatement");
};
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const user = useAppSelector((p: RootState) => p.changeStore.user);
  const numeric_id = id != user?.numeric_id ? id : user.numeric_id;
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const fetchAccountStatements = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get<AccountStatementsApiResponse>(
        `${
          id != user?.numeric_id
            ? "user/account-statements?page=1&offset=0&limit=" +
              limit +
              "&numeric_id=" +
              id +
              "&from=" +
              FromDate.current?.value +
              "&to=" +
              toDate.current?.value +
              "&sports="
            : "user/account-statements?page=1&offset=0&limit=" +
              limit +
              "&numeric_id=" +
              numeric_id +
              "&from=" +
              FromDate.current?.value +
              "&to=" +
              toDate.current?.value +
              "&type=" +
              accountType +
              "&sports=" +
              gameName
        }`
      );

      setAccountStatements(response.data.results || []);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
      setAccountStatements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBetDetails = async (
    Category: string,
    id: string
  ): Promise<void> => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (Category == "QT") {
        const response = await instance.get(
          `getbets?numeric_id=${numeric_id}&marketId=${id}`
        );

        setModalContent(response.data.Tables.orders);
      } else if (Category == "WCO") {
        const response = await instance.get(
          `betting/casino_history?numeric_id=${numeric_id}&marketId=${id}`
        );
        setModalContent(response.data);
      } else {
        const data = await instance.get(
          `betting/current-bets?page=1&offset=0&limit=10&marketId=${id}&matchId=&status=Success&numeric_id=${numeric_id}`
        );
        const result=data.data.results.map((p:any)=>{return{...p,username:p.user.displayName,status:p.status=="Loser"?"Loss":"Win",amount:p.betAmount,dateTime:p.created,ip:p.user_ip}})
        setModalContent(result);
      }
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError: setModalError,
      });
      setModalContent(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDescriptionClick = (statement: AccountStatementData) => {
    const param = statement.remarks.split(" ")[0];
    fetchBetDetails(param, statement.marketId);
    setIsModalOpen(true);
  };
const HandleExcel=async(data:any,st?:string)=>{
  const ExcelFile = (await import("../utils/ExcelFile")).default;
  ExcelFile(data, st)
    
    }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalError(null);
  };

  useEffect(() => {
    document.title = "AccountStatement";
    if (FromDate.current) {
      FromDate.current.value = dataFormate(true);
    }
    if (toDate.current) {
      toDate.current.value = dataFormate(false);
    }
    fetchAccountStatements();
  }, []);

  const handleLoadClick = (): void => {
    fetchAccountStatements();
  };
  const [search, setsearh] = useState("");
  useEffect(() => {
    if (search.trim() != "") {
      setAccountStatements((p) =>
        p.filter((o) => o.remarks.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search]);
  const getFile = async (type = false) => {
    try {
      const response = await instance.get(
        `user/exports-data?type=Account-Statement&sports=&from=&to=`
      );
      if (type) {
        HandleExcel(response.data);
      } else {
        exportPDF(response.data);
      }
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    }
  };
  return (
    <section className="mian-content">
      {isModalOpen && (
        <div
          className="modal fade show exposure-modal modal-one"
          style={{ display: "block" }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="ExposureModalLabel"
          aria-modal="true"
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="ExposureModalLabel">
                  Client Ledger (Total Win Loss:
                  {(modalContent &&
                    modalContent.length > 0 &&
                    modalContent[0].amount) ||
                    (modalContent &&
                      modalContent.length > 0 &&
                      modalContent[0].amount) ||
                    0}
                  ) (Total Count: {modalContent?.length || 0}) (Total Soda:
                  {modalContent?.totalSoda || 0})
                </h1>
                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                {modalLoading && (
                  <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        <Loading />
                      </span>
                    </div>
                    <p>Loading bet details...</p>
                  </div>
                )}
                {modalError && (
                  <div className="alert alert-danger my-3">{modalError}</div>
                )}

                {!modalLoading && !modalError && modalContent && (
                  <>
                    <div className="d-flex gap-2 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radioDefault"
                          id="All"
                          defaultChecked
                        />
                        <label className="form-check-label">All</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radioDefault"
                          id="Matched"
                        />
                        <label className="form-check-label">Matched</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radioDefault"
                          id="Deleted"
                        />
                        <label className="form-check-label">Deleted</label>
                      </div>
                    </div>

                    <div className="">
                      <table className="table table-lay-black-one">
                        <thead>
                          <tr>
                            <th>Uplevel</th>
                            <th>UserName</th>
                            <th>Nation</th>
                            <th>Userrate</th>
                            <th>Amount</th>
                            <th>Win/Loss</th>
                            <th>Place Date</th>
                            <th>Match Date</th>
                            <th>IP</th>
                            <th>Browser Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalContent.length > 0 ? (
                            modalContent.map((bet: any, betIndex: number) => (
                              <tr key={betIndex} className="lay-bg">
                                <td>{user.displayName}</td>
                                <td>{bet?.user?.username??bet.username??""}</td>
                                <td>{bet?.marketName??bet?.matchName??""}</td>
                                <td>{bet?.rate??bet.roundId}</td>
                                <td>{bet.amount}</td>
                                <td
                                  className={
                                   bet?.status?bet.status!="Loss"?"text-success":"text-danger":bet.amount < 0 ?"text-danger" : "text-success"
                                    
                                  }
                                >
                                  {bet?.status?bet.status:bet.amount < 0 ? "Loss" : "Win"}
                                </td>
                                <td>{new Date(bet.dateTime).toDateString()}</td>
                                <td>{new Date(bet.dateTime).toDateString()}</td>
                               
                                <td>{bet.ip?.replace("::ffff:","")}</td>
                                <td>{bet?.remarks??""}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={10} className="text-center">
                                No bet details found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="account-statement-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Account Statement</h1>
            </div>
          </div>
          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label className="lable-two">Account Type</label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={accountType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAccountType(e.target.value)
                }
              >
                <option  value="" >Select Report Type</option>
                <option  value="WithdrawDeposit">Deposite/Withdraw Reports</option>
                <option  value="sport">Sport Reports</option>
                <option  value="casino">Casino Reports</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <label className="lable-two">Game Name</label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={gameName}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setGameName(e.target.value)
                }
              >
                <option value="">All</option>
                <option value="4">Cricket</option>
                <option value="1">Football</option>
                <option value="99994">Kabaddi</option>
                <option value="2">Tennis</option>
                <option value="7">Horse Racing</option>
                <option value="11011">Casino</option>
                <option value="1102">Live Casino</option>
                <option value="2378961">Politics</option>
                <option value="89278">Rummy</option>
                <option value="4339">Greyhound Racing</option>
              </select>
            </div>
            <DateInput label="From" ref={FromDate} />
          
            <DateInput label="To" ref={toDate} />
            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={handleLoadClick}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load"}
              </button>
              <button
                type="button"
                onClick={() => getFile()}
                className="red-button"
              >
                <i className="far fa-file-pdf"></i> PDF
              </button>
              <button
                type="button"
                onClick={() => getFile(true)}
                className="green-button"
              >
                <i className="far fa-file-excel"></i> Excel
              </button>
            </div>
          </div>
          <div className="row ">
            <div className="col-6 mb-3">
              <div className="select-box">
                <label>Show</label>
                <select
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
                <label>entries</label>
              </div>
            </div>

            <SearchCom handleChange={setsearh} type="Search" />
          </div>

          {loading && <Loading />}
          {error && <div className="alert alert-danger my-3">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-two">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Credit</th>
                    <th>Debit</th>
                    <th>Closing</th>
                    <th>Description</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {accountStatements.length > 0 ? (
                    accountStatements.map((statement, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(statement.created).getDate()}-
                          {new Date(statement.created).getMonth() + 1}-
                          {new Date(statement.created).getFullYear()}
                        </td>
                        <td
                          style={{
                            color: statement.amount > 0 ? "green" : "red",
                          }}
                        >
                          {statement.txType === "CR"
                            ? statement.amount
                            : "0.00"}
                        </td>
                        <td
                          style={{
                            color: statement.amount > 0 ? "green" : "red",
                          }}
                        >
                          {statement.txType === "DR"
                            ? statement.amount
                            : "0.00"}
                        </td>
                        <td>{statement.balance.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="Description-btn"
                            onClick={() => handleDescriptionClick(statement)}
                          >
                            {statement.category}
                          </button>
                        </td>
                        <td>{statement.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No account statements found for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountStatement;
