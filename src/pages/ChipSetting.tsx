import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../helper/store";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";

interface AccountData {
  firstName: string;
  myPL: number;
  profitLossBalance: number;
  comm_in: number;
  comm_out: number;
  numeric_id: number;
  username?: string;
  roles: string[];
}

interface ParentAccountData extends AccountData {
  percentage: number;
}
const ChipSetting = () => {
  const navigate = useNavigate();

  const [plusAccountData, setPlusAccountData] = useState<AccountData[]>([]);
  const [minusAccountData, setMinusAccountData] = useState<AccountData[]>([]);
  const [zeroAccountData, setZeroAccountData] = useState<AccountData[]>([]);
  const [parentAccountData, setParentAccountData] = useState<
    ParentAccountData[]
  >([]);
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [modalData, setModalData] = useState({
    totalPL: "",
    userName: "",
    userPL: 0,
    chips: "",
    remark: "",
  });
  const location = useLocation();
  const fetchSettlementData = async () => {
    if (!user.numeric_id || !user._id || !token) {
      console.error("User or token data missing from localStorage.");
      navigate("/login");
      return;
    }

    try {
      const { data } = await instance.get(
        `user/me?numeric_id=${user.numeric_id}`
      );

      const response = await instance.get(
        `user/settlement_list?numeric_id=${data?.parent?.numeric_id || user.numeric_id}&username=`
      );
      const numeric_id = new URLSearchParams(location.search).get("p");

      !numeric_id && setZeroAccountData(response.data.zero);
      setPlusAccountData(
        response.data.plus.filter((p: AccountData) => p.profitLossBalance !== 0)
      );
      setMinusAccountData(response.data.minus);
      if (user.roles[0] != "owner_admin") {
        setParentAccountData(response.data.zero);
      }
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
      });
    }
  };

  useEffect(() => {
    document.title = "ChipSetting";
    fetchSettlementData();
  }, [location.search]);
  useEffect(() => {
    const numeric_id = new URLSearchParams(location.search).get("p");


    numeric_id && zeroApi();
  }, [location.search]);

  const calculateTotal = (data: AccountData[], key: keyof AccountData) => {
    //@ts-ignore
    return data.reduce((sum, item) => sum + item[key], 0);
  };
  const changeLocation = (numeric_id: number) => {
    navigation(`/chip-summary?p=${numeric_id}`);
  };

  const zeroApi = async () => {
    const numeric_id = new URLSearchParams(location.search).get("p");
    try {
      const { data } = await instance.get(
        `user/settlement_list?numeric_id=${numeric_id}&username=`
      );
      setZeroAccountData(data.zero);
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
      });
    }
  };

  const totalPlusPL = calculateTotal(plusAccountData, "myPL");
  const totalPlusChips = calculateTotal(plusAccountData, "profitLossBalance");
  const totalMinusPL = calculateTotal(minusAccountData, "myPL");
  const totalMinusChips = calculateTotal(minusAccountData, "profitLossBalance");
  const totalParentChips = calculateTotal(
    parentAccountData,
    "profitLossBalance"
  );

  const openSettlementModal = (
    totalPL: number,
    userName: string,
    userPL: number,
    type: string
  ) => {
    setModalData({
      totalPL: type,
      userName,
      userPL,
      chips: String(totalPL),
      remark: "",
    });
    setShowSettlementModal(true);
  };

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSave = async () => {
    try {
      if (modalData.totalPL == "pluse") {
        await instance.post(`user/settle_amount`, {
          comm_in: plusAccountData[modalData.userPL].comm_in,
          comm_out: plusAccountData[modalData.userPL].comm_out,
          newcredit: modalData.chips,
          note: modalData.remark,
          numeric_id: user.numeric_id,
          type: "plus",
          user_id: plusAccountData[modalData.userPL].numeric_id,
          wantDeposit: false,
        });
      } else {
        await instance.post(`user/settle_amount`, {
          comm_in: minusAccountData[modalData.userPL].comm_in,
          comm_out: minusAccountData[modalData.userPL].comm_out,
          newcredit: modalData.chips,
          note: modalData.remark,
          numeric_id: user.numeric_id,
          type: "minus",
          user_id: minusAccountData[modalData.userPL].numeric_id,
          wantDeposit: false,
        });
      }
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation: navigate,
        pathname: location.pathname,
      });
    } finally {
      setShowSettlementModal(false);
    }
  };

  return (
    <section className="mian-content">
      <div
        className={`modal fade modal-one settlementModal ${
          showSettlementModal ? "show d-block" : ""
        }`}
        id="settlementModal"
        tabIndex={-1}
        aria-labelledby="settlementModalLabel"
        aria-hidden={!showSettlementModal}
        style={{ display: showSettlementModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-head-right">
                <button
                  type="button"
                  className="stmodal-close"
                  onClick={() => setShowSettlementModal(false)}
                  aria-label="Close"
                >
                  <i className="fa fa-times-circle"></i>
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="chips">Chips :</label>
                  <input
                    type="number"
                    name="chips"
                    id="chips"
                    className="form-control"
                    value={modalData.chips}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="remark">Remark:</label>
                  <input
                    type="text"
                    name="remark"
                    id="remark"
                    className="form-control"
                    value={modalData.remark}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className="col-6 mb-3">
                  <button
                    type="button"
                    onClick={handleModalSave}
                    className="btn btn-success"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chip-summary-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Ledger</h1>
              <button className="modal-submit-btn" onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left"></i> Back
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="leader-table-header">
                <h3> PLUS ACCOUNT (Lena He) </h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <table className="ledger-table table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>My P/L </th>
                    <th>Chips</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {plusAccountData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.username}</td>
                      <td className={row?.myPL < 0 ? "text-green" : ""}>0</td>
                      <td
                        className={
                          row.profitLossBalance < 0 ? "text-green" : ""
                        }
                      >
                        {row.profitLossBalance.toLocaleString()}
                      </td>
                      <td>
                        <Link
                          to={`/ledger-account-statement/${row.numeric_id}`}
                          className="ledger-btn"
                        >
                          Ledger
                        </Link>
                        <button
                          type="button"
                          className="settlement-btn"
                          onClick={() =>
                            openSettlementModal(
                              row.profitLossBalance,
                              row.firstName,
                              index,
                              "pluse"
                            )
                          }
                        >
                          Settlement
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td className={totalPlusPL < 0 ? "text-green" : ""}>0</td>
                    <td className={totalPlusChips < 0 ? "text-green" : ""}>
                      {totalPlusChips.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="col-md-6 mb-3">
              <div className="leader-table-header">
                <h3> MINUS ACCOUNT (Dena He) </h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <table className="ledger-table table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>My P/L </th>
                    <th>Chips</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {minusAccountData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.firstName}</td>
                      <td className={row.myPL < 0 ? "text-red" : ""}>0</td>
                      <td
                        className={row.profitLossBalance < 0 ? "text-red" : ""}
                      >
                        {row.profitLossBalance.toLocaleString()}
                      </td>
                      <td>
                        <Link
                          to={`/ledger-account-statement/${row.numeric_id}`}
                          className="ledger-btn"
                        >
                          Ledger
                        </Link>
                        <button
                          type="button"
                          className="settlement-btn"
                          onClick={() =>
                            openSettlementModal(
                              row.profitLossBalance,
                              row.firstName,
                              index,
                              "mins"
                            )
                          }
                        >
                          Settlement
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td className={totalMinusPL < 0 ? "text-red" : ""}>0</td>
                    <td className={totalMinusChips < 0 ? "text-red" : ""}>
                      {totalMinusChips.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="col-md-6 mb-3">
              <div className="leader-table-header">
                <h3> Zero ACCOUNT (Clear He) </h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <table className="ledger-table table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>My P/L </th>
                    <th>Chips</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {zeroAccountData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.firstName || row.username}</td>
                      <td className={row.myPL < 0 ? "text-red" : ""}>0</td>
                      <td
                        className={row.profitLossBalance < 0 ? "text-red" : ""}
                      >
                        {row.profitLossBalance.toLocaleString()}
                      </td>
                      <td>
                        <Link
                          to={`/ledger-account-statement/${row.numeric_id}`}
                          className="ledger-btn"
                        >
                          Ledger
                        </Link>
                        <button
                          className="downline-btn"
                          onClick={() =>
                            row.roles[0] != "user" &&
                            changeLocation(row.numeric_id)
                          }
                        >
                          Downline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {user.roles[0] != "owner_admin" && (
              <div className="col-md-6 mb-3">
                <div className="leader-table-header">
                  <h3> PARENT ACCOUNT </h3>
                  <i className="fa fa-chevron-down"></i>
                </div>
                <table className="ledger-table table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Percentage</th>
                      <th>My P/L </th>
                      <th>Chips</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parentAccountData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.username}</td>
                        <td>{row.percentage}</td>
                        <td className={row.myPL < 0 ? "text-green" : ""}>0</td>
                        <td
                          className={
                            row.profitLossBalance < 0 ? "text-green" : ""
                          }
                        >
                          {row.profitLossBalance.toLocaleString()}
                        </td>
                        <td>
                          <Link
                            to={`/ledger-account-statement/${row.numeric_id}`}
                            className="ledger-btn"
                          >
                            Ledger
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td className={totalParentChips < 0 ? "text-green" : ""}>
                        {totalParentChips.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChipSetting;
