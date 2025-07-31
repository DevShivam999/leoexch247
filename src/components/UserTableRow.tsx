import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import { RoleSwitch } from "../utils/RoleSwitch";
import ErrorHandler from "../utils/ErrorHandle";
import UserStatus from "./UserStatus";
import { success, Tp } from "../utils/Tp";
import ColorTd from "./ColorTd";

const UserTableRow = ({
  user,
  fetchUsers,
  parent_name,
}: {
  user: any;
  fetchUsers: (numeric_id: number) => Promise<void>;
  parent_name: {
    parent_balance: number;
    parent_credit: number;
    parent_name: string;
    transaction_password: number;
  };
}) => {
  const location = useLocation();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showExposureLimitModal, setShowExposureLimitModal] = useState(false);
  const [showCreditLimitModal, setShowCreditLimitModal] = useState(false);
  const [showPasswordLimitModal, setShowPasswordLimitModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [showSportsSettingsModal, setShowSportsSettingsModal] = useState(false);
  const [sportcheck, setsupportCheck] = useState([]);
  const [submitusermatch, setsubmitusermatch] = useState(true);
  const [modelError, SetmodelError] = useState<string | null>(null);
  const [userDetails, setDetails] = useState({
    id: "",
    pid: "",
    amount: 0,
    newAmount: 0,
    remark: "",
    ts_password: "",
  });
  const [modelLoading, setmodelLoading] = useState(false);
  const dispatch = useDispatch();
  const [userPassword, setUserPassword] = useState({
    numeric_id: 0,
    password: "",
    rePassword: "",
    reset: true,
    ts_password: "",
  });

  const depositModalRef = useRef<HTMLDivElement>(null);
  const withdrawModalRef = useRef<HTMLDivElement>(null);
  const exposureModalRef = useRef<HTMLDivElement>(null);
  const creditModalRef = useRef<HTMLDivElement>(null);
  const passwordModalRef = useRef<HTMLDivElement>(null);
  const statusModalRef = useRef<HTMLDivElement>(null);
  const sportsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        depositModalRef.current &&
        !depositModalRef.current.contains(event.target as Node) &&
        showDepositModal
      ) {
        setShowDepositModal(false);
      }
      if (
        withdrawModalRef.current &&
        !withdrawModalRef.current.contains(event.target as Node) &&
        showWithdrawModal
      ) {
        setShowWithdrawModal(false);
      }
      if (
        exposureModalRef.current &&
        !exposureModalRef.current.contains(event.target as Node) &&
        showExposureLimitModal
      ) {
        setShowExposureLimitModal(false);
      }
      if (
        creditModalRef.current &&
        !creditModalRef.current.contains(event.target as Node) &&
        showCreditLimitModal
      ) {
        setShowCreditLimitModal(false);
      }
      if (
        passwordModalRef.current &&
        !passwordModalRef.current.contains(event.target as Node) &&
        showPasswordLimitModal
      ) {
        setShowPasswordLimitModal(false);
      }
      if (
        statusModalRef.current &&
        !statusModalRef.current.contains(event.target as Node) &&
        showChangeStatusModal
      ) {
        setShowChangeStatusModal(false);
      }
      if (
        sportsModalRef.current &&
        !sportsModalRef.current.contains(event.target as Node) &&
        showSportsSettingsModal
      ) {
        setShowSportsSettingsModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showDepositModal,
    showWithdrawModal,
    showExposureLimitModal,
    showCreditLimitModal,
    showPasswordLimitModal,
    showChangeStatusModal,
    showSportsSettingsModal,
  ]);

  //@ts-ignore
  const offuserSupport = (p) => {
    //@ts-ignore
    setsupportCheck((prevSportsSettings) =>
      prevSportsSettings.map((sportSetting) =>
        //@ts-ignore
        sportSetting.sportType === p
          ? //@ts-ignore
            { ...sportSetting, isEnable: !sportSetting.isEnable }
          : sportSetting
      )
    );
  };

  const navi = useNavigate();
  const userwith = useAppSelector((p: RootState) => p.changeStore.user);
  const Permissions = useAppSelector((p: RootState) => p.Permissions);
  const permissions = Permissions.permissions;

  async function fetchData() {
    try {
      success();
      const data = await instance.post(
        `user/sports-setting?numeric_id=${user.numeric_id}`,
        {
          sportSettings: sportcheck,
        }
      );
      setsupportCheck(data.data.sportSetting);
      SetmodelError(null);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
      Tp(modelError || "");
    }
  }

  useEffect(() => {
    if (userwith == null) {
      navi("/login");
    }

    if (showSportsSettingsModal) {
      fetchData();
    }
  }, [showSportsSettingsModal]);

  useEffect(() => {
    if (showSportsSettingsModal) {
      fetchData().then(() => {
        success();
        setShowSportsSettingsModal((p) => !p);
      });
    }
  }, [submitusermatch]);

  const fnShowModel = (
    pid: string,
    id: string,
    amount: number,
    type: string
  ) => {
    setDetails((p) => ({ ...p, id, pid, amount }));
    if (type == "D")
      permissions?.userDeposit
        ? setShowDepositModal(true)
        : Tp("you don't have permission to deposit");
    else if (type == "E") setShowExposureLimitModal(true);
    else if (type == "W")
      permissions?.userWithdraw
        ? setShowWithdrawModal(true)
        : Tp("you don't have permission to Withdraw");
    else setShowCreditLimitModal(true);
  };

  const DepositApiCall = async () => {
    if (modelLoading) return;
    setmodelLoading(true);

    if (String(parent_name.transaction_password) != userDetails.ts_password) {
      return Tp();
    }
    try {
      await instance.post(`user/deposit-credit`, {
        amount: userDetails.newAmount,
        parentId: userDetails.pid,
        userId: userDetails.id,
        remark: userDetails.remark,
        transitionPassword: parent_name.transaction_password,
      });
      success();
      fetchUsers(userwith.numeric_id);
      setShowDepositModal(false);
      setDetails({
        id: "",
        pid: "",
        amount: 0,
        newAmount: 0,
        remark: "",
        ts_password: "",
      });
      SetmodelError(null);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
    } finally {
      setmodelLoading(false);
    }
  };

  const withdrawApiCall = async () => {
    if (modelLoading) return;
    setmodelLoading(true);
    if (String(parent_name.transaction_password) != userDetails.ts_password) {
      return Tp();
    }
    try {
      await instance.post(`user/withdraw-balance`, {
        amount: userDetails.newAmount,
        parentId: userDetails.pid,
        userId: userDetails.id,
        remark: userDetails.remark,
        transitionPassword: parent_name.transaction_password,
      });

      success();

      fetchUsers(userwith.numeric_id);
      setShowWithdrawModal(false);
      setDetails({
        id: "",
        pid: "",
        amount: 0,
        newAmount: 0,
        remark: "",
        ts_password: "",
      });

      SetmodelError(null);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
    } finally {
      setmodelLoading(false);
    }
  };

  const newPassword = async () => {
    if(modelLoading) return
setmodelLoading(true)
    if (
      parent_name.transaction_password.toString() != userPassword.ts_password
    ) {
      return Tp();
    }
    try {
      if (userPassword.password != userPassword.rePassword)
        return Tp("password mismatch");
      await instance.post(`user/change-account-password`, {
        numeric_id: userPassword.numeric_id,
        password: userPassword.password,
        rePassword: userPassword.rePassword,
        reset: true,
        transitionPassword: userPassword.ts_password,
      });
      success();
      setShowPasswordLimitModal(false);
      setUserPassword({
        numeric_id: 0,
        password: "",
        rePassword: "",
        reset: true,
        ts_password: "",
      });
      SetmodelError(null);
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
    }finally{
      setmodelLoading(false)
    }
  };

  const [userInfo, setUserInfo] = useState<any>(user);
  useEffect(() => {
    setUserInfo(user);
  }, [user]);
  const navigate = useNavigate();

  const addIdToQuery = (id: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("id", id);

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  const [creditLimit, setCreditLimit] = useState(0);
  const CreditLimit = async () => {
    if(modelLoading) return
setmodelLoading(true)
    if (userDetails.ts_password != String(parent_name.transaction_password)) {
      return Tp();
    }
    try {
      await instance.post("/admin/credit-reference", {
        amount: creditLimit,
        userid: userDetails.id,
      });

      fetchUsers(userwith.numeric_id);
      setShowCreditLimitModal(false);
      setCreditLimit(0);
      SetmodelError(null);
      setDetails({
        id: "",
        pid: "",
        amount: 0,
        newAmount: 0,
        remark: "",
        ts_password: "",
      });
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
    }finally{
      setmodelLoading(false)
    }
  };

  const ExposerLimitApi = async () => {
    if(modelLoading) return
setmodelLoading(true)
    if (userDetails.ts_password != String(parent_name.transaction_password)) {
      return Tp();
    }
    try {
      await instance.post("/admin/exposureref-reference", {
        amount: userDetails.newAmount,
        userid: userDetails.id,
      });

      fetchUsers(userwith.numeric_id);
      setShowExposureLimitModal(false);
      setCreditLimit(0);
      SetmodelError(null);
      setDetails({
        id: "",
        pid: "",
        amount: 0,
        newAmount: 0,
        remark: "",
        ts_password: "",
      });
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation: navi,
        pathname: location.pathname,
        setError: SetmodelError,
      });
    }finally{
      setmodelLoading(false)
    }
  };

  return (
    <>
      {/* Deposit Modal */}
      {showDepositModal && (
        <>
          {" "}
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one DepositModal ${
              showDepositModal ? "show" : ""
            }`}
            style={{ display: showDepositModal ? "block" : "none" }}
            id="DepositModal"
            tabIndex={-1}
            aria-labelledby="DepositModalLabel"
            aria-hidden={!showDepositModal}
          >
            <div className="modal-dialog" ref={depositModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="DepositModalLabel"
                  >
                    {modelError ? modelError : "Deposit"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowDepositModal(false);
                      SetmodelError(null);
                      setDetails({
                        id: "",
                        pid: "",
                        amount: 0,
                        newAmount: 0,
                        remark: "",
                        ts_password: "",
                      });
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">
                        {parent_name.parent_name} [CR]
                      </label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_credit}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">
                        {parent_name.parent_name}
                      </label>
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_balance}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_balance}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">SUPSC</label>
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Amount</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        className="mgray-input-box form-control text-end"
                        placeholder=""
                        value={userDetails.newAmount}
                        onChange={(e) =>
                          !isNaN(Number(e.target.value)) &&
                          setDetails((p) => ({
                            ...p,
                            newAmount: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Remark</label>
                    </div>
                    <div className="col-8 mb-3">
                      <textarea
                        name=""
                        id=""
                        className="mgray-input-box form-control text-end"
                        value={userDetails.remark}
                        placeholder=""
                        onChange={(e) =>
                          setDetails((p) => ({ ...p, remark: e.target.value }))
                        }
                        rows={5}
                      ></textarea>
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        className="mgray-input-box form-control text-end"
                        value={userDetails.ts_password}
                        placeholder=""
                        onChange={(e) =>
                          setDetails((p) => ({
                            ...p,
                            ts_password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      setShowDepositModal(false);
                      SetmodelError(null);
                      setDetails({
                        id: "",
                        pid: "",
                        amount: 0,
                        newAmount: 0,
                        remark: "",
                        ts_password: "",
                      });
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    type="button"
                    onClick={DepositApiCall}
                    className="btn modal-green-btn"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <>
          {" "}
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one WithdrawModal ${
              showWithdrawModal ? "show" : ""
            }`}
            style={{ display: showWithdrawModal ? "block" : "none" }}
            id="WithdrawModal"
            tabIndex={-1}
            aria-labelledby="WithdrawModalLabel"
            aria-hidden={!showWithdrawModal}
          >
            <div className="modal-dialog" ref={withdrawModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="WithdrawModalLabel"
                  >
                    {modelError ? modelError : "Withdraw"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      SetmodelError(null);
                      setDetails({
                        id: "",
                        pid: "",
                        amount: 0,
                        newAmount: 0,
                        remark: "",
                        ts_password: "",
                      });
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">
                        {parent_name.parent_name} [CR]
                      </label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_credit}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">
                        {parent_name.parent_name}
                      </label>
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_balance}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={parent_name.parent_balance}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">SUPSC</label>
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Amount</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        className="mgray-input-box form-control text-end"
                        value={userDetails.newAmount}
                        onChange={(e) =>
                          !isNaN(Number(e.target.value)) &&
                          setDetails((p) => ({
                            ...p,
                            newAmount: Number(e.target.value),
                          }))
                        }
                        placeholder=""
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Remark</label>
                    </div>
                    <div className="col-8 mb-3">
                      <textarea
                        name=""
                        id=""
                        value={userDetails.remark}
                        onChange={(e) =>
                          setDetails((p) => ({
                            ...p,
                            remark: e.target.value,
                          }))
                        }
                        className="mgray-input-box form-control text-end"
                        rows={5}
                      ></textarea>
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        value={userDetails.ts_password}
                        onChange={(e) =>
                          setDetails((p) => ({
                            ...p,
                            ts_password: e.target.value,
                          }))
                        }
                        className="mgray-input-box form-control text-end"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      SetmodelError(null);
                      setDetails({
                        id: "",
                        pid: "",
                        amount: 0,
                        newAmount: 0,
                        remark: "",
                        ts_password: "",
                      });
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    type="button"
                    onClick={withdrawApiCall}
                    className="btn modal-red-btn"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Exposure Limit Modal */}
      {showExposureLimitModal && (
        <>
          {" "}
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one ExposureLimitModal ${
              showExposureLimitModal ? "show" : ""
            }`}
            style={{ display: showExposureLimitModal ? "block" : "none" }}
            id="ExposureLimitModal"
            tabIndex={-1}
            aria-labelledby="ExposureLimitModalLabel"
            aria-hidden={!showExposureLimitModal}
          >
            <div className="modal-dialog modal-lg" ref={exposureModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="ExposureLimitModalLabel"
                  >
                    {modelError ? modelError : "Exposure Limit"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      (setShowExposureLimitModal(false), SetmodelError(null));
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">Old Limit</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">New Limit</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        className="mgray-input-box form-control text-end"
                        value={userDetails.newAmount}
                        onChange={(e) =>
                          !isNaN(Number(e.target.value)) &&
                          setDetails((p) => ({
                            ...p,
                            newAmount: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        className="mgray-input-box form-control text-end"
                        value={userDetails.ts_password}
                        onChange={(e) =>
                          setDetails((p) => ({
                            ...p,
                            ts_password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      (setShowExposureLimitModal(false), SetmodelError(null));
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => ExposerLimitApi()}
                    className="btn modal-submit-btn"
                  >
                    Submit <i className="fas fa-sign-in-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Credit Limit Modal */}
      {showCreditLimitModal && (
        <>
          {" "}
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one CreditLimitModal ${
              showCreditLimitModal ? "show" : ""
            }`}
            style={{ display: showCreditLimitModal ? "block" : "none" }}
            id="CreditLimitModal"
            tabIndex={-1}
            aria-labelledby="CreditLimitModalLabel"
            aria-hidden={!showCreditLimitModal}
          >
            <div className="modal-dialog" ref={creditModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="CreditLimitModalLabel"
                  >
                    {modelError ? modelError : "Credit Limit"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      (setShowCreditLimitModal(false), SetmodelError(null));
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">Old Limit</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        disabled
                        className="mgray-input-box form-control text-end"
                        value={userDetails.amount}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">New Limit</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="text"
                        value={creditLimit}
                        onChange={(e) =>
                          !isNaN(Number(e.target.value)) &&
                          setCreditLimit(Number(e.target.value))
                        }
                        className="mgray-input-box form-control text-end"
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        className="mgray-input-box form-control text-end"
                        value={userDetails.ts_password}
                        onChange={(e) =>
                          setDetails((p) => ({
                            ...p,
                            ts_password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      (setShowCreditLimitModal(false), SetmodelError(null));
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => CreditLimit()}
                    className="btn modal-submit-btn"
                  >
                    Submit <i className="fas fa-sign-in-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Password Limit Modal */}
      {showPasswordLimitModal && (
        <>
          {" "}
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one PasswordLimitModal ${
              showPasswordLimitModal ? "show" : ""
            }`}
            style={{ display: showPasswordLimitModal ? "block" : "none" }}
            id="PasswordLimitModal"
            tabIndex={-1}
            aria-labelledby="PasswordLimitModalLabel"
            aria-hidden={!showPasswordLimitModal}
          >
            <div className="modal-dialog" ref={passwordModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="PasswordLimitModalLabel"
                  >
                    {modelError ? modelError : "Password"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowPasswordLimitModal(false);
                      SetmodelError(null);
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">New Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        onChange={(e) =>
                          setUserPassword((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        value={userPassword.password}
                        className="mgray-input-box form-control text-end"
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Confirm Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        className="mgray-input-box form-control text-end"
                        onChange={(e) =>
                          setUserPassword((p) => ({
                            ...p,
                            rePassword: e.target.value,
                          }))
                        }
                        value={userPassword.rePassword}
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        onChange={(e) =>
                          setUserPassword((p) => ({
                            ...p,
                            ts_password: e.target.value,
                          }))
                        }
                        value={userPassword.ts_password}
                        className="mgray-input-box form-control text-end"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      setShowPasswordLimitModal(false);
                      SetmodelError(null);
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    type="button"
                    onClick={newPassword}
                    className="btn modal-submit-btn"
                  >
                    Submit <i className="fas fa-sign-in-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Change Status Modal */}
      {showChangeStatusModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one ChangeStatusModal ${
              showChangeStatusModal ? "show" : ""
            }`}
            style={{ display: showChangeStatusModal ? "block" : "none" }}
            id="ChangeStatusModal"
            tabIndex={-1}
            aria-labelledby="ChangeStatusModalLabel"
            aria-hidden={!showChangeStatusModal}
          >
            <div className="modal-dialog" ref={statusModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="ChangeStatusModalLabel"
                  >
                    {modelError ? modelError : "Change Status"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowChangeStatusModal(false);
                      SetmodelError(null);
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <span className="text-yellow fs-5">SUPSC</span>
                    </div>
                    <div className="col-6 mb-3 text-end">
                      <span className="text-green">SUPSC</span>
                    </div>
                    <div className="col-4 mb-3 text-center">
                      <h5 className="switch-heading">User Active</h5>
                      <label className="switch switch-onoff">
                        <input type="checkbox" id="togBtn" />
                        <div className="slider round"></div>
                      </label>
                    </div>
                    <div className="col-8 mb-3">
                      <h5 className="switch-heading">Bet Active</h5>
                      <label className="switch switch-onoff">
                        <input type="checkbox" id="togBtn" />
                        <div className="slider round"></div>
                      </label>
                    </div>

                    <div className="col-4 mb-3">
                      <label className="form-label">Transaction Password</label>
                    </div>
                    <div className="col-8 mb-3">
                      <input
                        type="password"
                        className="mgray-input-box form-control text-end"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      setShowChangeStatusModal(false);
                      SetmodelError(null);
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button type="button" className="btn modal-submit-btn">
                    Submit <i className="fas fa-sign-in-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sports Settings Modal */}
      {showSportsSettingsModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div
            className={`modal fade modal-one SportsSettingsModal ${
              showSportsSettingsModal ? "show" : ""
            }`}
            style={{ display: showSportsSettingsModal ? "block" : "none" }}
            id="SportsSettingsModal"
            tabIndex={-1}
            aria-labelledby="SportsSettingsModalLabel"
            aria-hidden={showSportsSettingsModal}
            role="dialog"
          >
            <div className="modal-dialog modal-lg" ref={sportsModalRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title"
                    style={{ color: `${modelError ? "red" : "black"}` }}
                    id="SportsSettingsModalLabel"
                  >
                    {modelError ? modelError : "Sports Settings"}
                  </h1>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {
                      setShowSportsSettingsModal(false);
                      SetmodelError(null);
                    }}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                {sportcheck.length > 0 ? (
                  <div className="modal-body">
                    <div className="row">
                      {sportcheck.map(
                        (p: { sportType: string; isEnable: boolean }) => (
                          <>
                            <div className="col-6 mb-3 text-center">
                              <h5 className="ssmodal-heading">{p.sportType}</h5>
                            </div>
                            <div className="col-6 mb-3 text-center">
                              <label className="switch switch-onoff">
                                <input
                                  type="checkbox"
                                  onClick={() => offuserSupport(p?.sportType)}
                                  checked={p.isEnable}
                                  id="togBtn"
                                />
                                <div className="slider round"></div>
                              </label>
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Loading />
                  </div>
                )}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn modal-back-btn"
                    onClick={() => {
                      setShowSportsSettingsModal(false);
                      SetmodelError(null);
                    }}
                  >
                    <i className="fas fa-undo"></i> Back
                  </button>
                  <button
                    onClick={() => setsubmitusermatch((p) => !p)}
                    type="button"
                    className="btn modal-submit-btn"
                  >
                    Submit <i className="fas fa-sign-in-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* User Table Row */}
      <tr>
        {userInfo.accountType.toString().toLowerCase() == "user" ? (
          <td>{userInfo.username}</td>
        ) : (
          <td>
            <button
              onClick={() => {
                addIdToQuery(userInfo.numeric_id);
              }}
              className="user-name-box"
            >
              {userInfo.username}
              <br />
              <span className="user-name-postion">
                [{RoleSwitch(userInfo.accountType)} ]
              </span>
            </button>
          </td>
        )}
        <td>
          <Link to={`/User/${userInfo.numeric_id}`}>
            <img src="/user.svg" alt="User icon" />
          </Link>
        </td>
        <td>{userInfo.creditReference}</td>
        <td>{userInfo.balance}</td>

        <ColorTd amount={parseFloat(userInfo.clientPL.replace(/,/g, ""))} />
        <ColorTd amount={parseFloat(userInfo.myPL.replace(/,/g, ""))} />
        <ColorTd amount={parseFloat(userInfo.exposure.replace(/,/g, ""))} />
        <ColorTd
          amount={parseInt(userInfo.exposerLimitRef.replace(/,/g, "")) || 0}
        />

        <td>{userInfo.availableBalance}</td>
        <td>
          <UserStatus
            numeric={userInfo.numeric_id}
            setUser={setUserInfo}
            st={userInfo.uSt}
            id={userInfo.id}
            type={true}
          />
        </td>
        <td>
          <UserStatus
            numeric={userInfo.numeric_id}
            setUser={setUserInfo}
            st={userInfo.bSt}
            id={userInfo.id}
            type={false}
          />
        </td>
        <td>{RoleSwitch(userInfo.accountType)}</td>
        <td>
          <div className="btn-list">
            <button
              className="btn-listin-button"
              onClick={() =>
                fnShowModel(userInfo.pid, userInfo.id, userInfo.balance, "D")
              }
            >
              D
            </button>
            <button
              className="btn-listin-button"
              onClick={() =>
                fnShowModel(userInfo.pid, userInfo.id, userInfo.balance, "W")
              }
            >
              W
            </button>
            <button
              className="btn-listin-button"
              onClick={() =>
                fnShowModel(
                  userInfo.pid,
                  userInfo.id,
                  userInfo.exposerLimitRef,
                  "E"
                )
              }
            >
              E
            </button>
            <button
              className="btn-listin-button"
              onClick={() =>
                fnShowModel(
                  userInfo.pid,
                  userInfo.id,
                  userInfo.creditReference,
                  "C"
                )
              }
            >
              C
            </button>
            <button
              className="btn-listin-button"
              onClick={() => {
                permissions?.userPasswordUpdate
                  ? (setShowPasswordLimitModal(true),
                    setUserPassword((p) => ({
                      ...p,
                      numeric_id: userInfo.numeric_id,
                    })))
                  : Tp("you don't have permission to update the user password");
              }}
            >
              P
            </button>

            <button
              className="btn-listin-button"
              onClick={() =>
                permissions?.eventEnableDisable
                  ? setShowSportsSettingsModal(true)
                  : Tp(
                      "you don't have permission to  change the sport settings"
                    )
              }
            >
              MORE
            </button>
            <span className="refer-btn">
              <i className="fas fa-sync"></i>
            </span>
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserTableRow;
