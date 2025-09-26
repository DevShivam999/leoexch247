import { useEffect, useState } from "react";
import UserTableRow from "../components/UserTableRow";
import { useLocation, useNavigate } from "react-router-dom";
import FilteredList from "../components/FilterList";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import { Tp } from "../utils/Tp";
import BottomNav from "../components/BottomNav";
import {  toggleIsActive } from "../helper/IsActiveSlice"

const ClientList = () => {
  type UserType = {
    id: string;
    username: string;
    position: string;
    creditReference: string | number;
    exposerLimitRef: string | number;
    balance: string | number;
    clientPL: string | number;
    exposure: string | number;
    availableBalance: string | number;
    uSt: any;
    bSt: any;
    accountType: string;
    isActive: boolean;
    numeric_id: number;
    pid: string;
  };

  const [users, setUsers] = useState<UserType[]>([]);
  const [parent, setParent] = useState({
    parent_balance: 0,
    parent_credit: 0,
    parent_name: "",
    transaction_password: 0,
  });
  // const [showActiveUsers, setShowActiveUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exportdata, setexportdata] = useState([]);
  const [betHistoryPage, setBetHistoryPage] = useState(1);
  const [betHistoryTotal, setBetHistoryTotal] = useState(1);
  const [Limit, setLimit] = useState(10);
  // const [isActive, setIsActive] = useState(true);
  const isActive = useAppSelector(s => s.ui.isActive); // or selectIsActive(s)
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const Permissions = useAppSelector((p: RootState) => p.Permissions);
  const user = useAppSelector((p: RootState) => p.changeStore.user);
  const parseNumber = (val: any) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return Number(val.replace(/,/g, "")) || 0;
    return 0;
  };

  const totals = users.reduce(
    (acc, u) => {
      acc.creditReference += parseNumber(u.creditReference);
      acc.balance += parseNumber(u.balance);
      acc.clientPL += parseNumber(u.clientPL);
      acc.exposure += parseNumber(u.exposure);
      acc.exposerLimitRef += parseNumber(u.exposerLimitRef);
      acc.availableBalance += parseNumber(u.availableBalance);
      return acc;
    },
    {
      creditReference: 0,
      balance: 0,
      clientPL: 0,
      exposure: 0,
      exposerLimitRef: 0,
      availableBalance: 0,
    }
  );

  const permissions = Permissions?.permissions;
  const fetchUsers = async (numeric_id: number) => {
    try {
      // let status = "";
      // if (isActive == true) {
      //   status = "block";
      // } else {
      //   status = "unblock";
      // }
      const response = await instance.get(
        `users?page=${searchTerm.length > 0 ? 0 : entriesToShow}&sortBy=&search=${searchTerm}&numeric_id=${numeric_id}&role=&username=&status=${isActive}&limit=${searchTerm.length > 0 ? "" : Limit}`
      );
      const transformed = transformUserData(response.data.results);
      console.log("user fetched",response);
      setBetHistoryPage(response.data.page);
      setBetHistoryTotal(response.data.total);
      setUsers(transformed);
      setParent({
        parent_name: response.data.parent_name,
        parent_balance: response.data.parent_balance,
        parent_credit: response.data.parent_credit,
        // transaction_password: Permissions.transactionPassword,
        transaction_password: response.data.transaction_password,
      });
      setexportdata(response.data.export);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
      });
    }
  };
  const HandleExcel = async (data: any, st: string) => {
    const ExcelFile = (await import("../utils/ExcelFile")).default;
    ExcelFile(data, st);
  };
  const exportPDF = async (data: any) => {
    const { PdfFile } = await import("../utils/PdfFile");
    await PdfFile(data, "Client_list");
  };
  useEffect(() => {
    if (user == null) {
      navigation("/login");
    }

    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setEntriesToShow(1);
    }
    fetchUsers(Number(!id ? user.numeric_id : id));
  }, [entriesToShow, isActive, , Limit, location.search, searchTerm]);
  // }, [entriesToShow, showActiveUsers, , Limit, location.search, searchTerm]);

  const transformUserData = (users: any) => {
    return users.map((user: any) => {
      const formatNumber = (num: any) =>
        typeof num === "number" ? num.toLocaleString("en-IN") : num;

      return {
        id: user._id,
        username: user.username,
        position: user.commperrole || "User",
        creditReference: formatNumber(user?.credit || 0),
        exposerLimitRef: formatNumber(user?.exposerLimitRef || 0),
        balance: formatNumber(user.credit),
        clientPL: formatNumber(user.profitLossBalance),
        exposure: formatNumber(user.exposerLimit || 0),
        availableBalance: formatNumber(
          user.credit + user.profitLossBalance + user.exposerLimit || 0
        ),
        uSt: user.status,
        bSt: user.betStatus,
        accountType: user.roles[0],
        isActive: user.status,
        numeric_id: user.numeric_id,
        pid: user.parent._id,
      };
    });
  };

  useEffect(() => {
    document.title = "Client List";
  }, []);

  // const filterFunction = useCallback(
  //   (user: any) => {
  //     const matchesSearch = user.username;
  //     const matchesStatus = showActiveUsers ? user.isActive : !user.isActive;
  //     return matchesSearch && matchesStatus;
  //   },
  //   [showActiveUsers, location.search]
  // );

  return (
    <section className="main-content ">
      <div className="card shadow">
        <div className="card-body">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">User List</h1>
              <div
                onClick={() =>
                  permissions?.addUser
                    ? navigation("/add-Client")
                    : Tp("you do not have permission to create the user")
                }
                className="button-teen"
              >
                Add Account
              </div>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="table-responsive">
              <div className="row">
                <div className="col-6 mb-3">
                  <button
                    type="button"
                    onClick={() =>
                      exportdata.length > 0 && exportPDF(exportdata)
                    }
                    className="red-button"
                  >
                    <i className="far fa-file-pdf"></i> PDF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      exportdata.length > 0 &&
                      HandleExcel(exportdata, "Client_list")
                    }
                    className="green-button"
                  >
                    <i className="far fa-file-excel"></i> Excel
                  </button>

                  <div className="switch-button">
                    <span id="PointDetail" className="font-weight-bold Text-15">
                      {/* <label className="switch1 vertical-align-middle">
                        <input
                          type="checkbox"
                          id="chkisActiveUsers"
                          name="rbtn"
                          className="px"
                          checked={isActive}
                          onChange={() => setShowActiveUsers((prev) => !prev)}
                        />
                        <div className="slider1 round1">
                          <span
                            className="on"
                            onClick={() => {
                              setIsActive(false);
                            }}
                          >
                            Active
                          </span>
                          <span
                            className="off"
                            onClick={() => {
                              setIsActive(true);
                            }}
                          >
                            In-Active
                          </span>
                        </div>
                      </label> */}
                      <label className="switch1 vertical-align-middle">
                        <input
                          type="checkbox"
                          className="px"
                          checked={isActive}
                          // onChange={() => setIsActive((prev) => !prev)} // Toggle state correctly
                          onChange={() => dispatch(toggleIsActive())} // Toggle using redux correctly
                        />
                        <div className="slider1 round1">
                          <span className="on">{isActive ? "Active" : ""}</span>
                          <span className="off">
                            {!isActive ? "In-Active" : ""}
                          </span>
                        </div>
                      </label>
                    </span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="search-box">
                    <label>Search</label>
                    <input
                      type="text"
                      placeholder="Search UserName"
                      className="form-control"
                      autoComplete="off"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="select-box">
                    <label>Show</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setLimit(parseInt(e.target.value))}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                    <label>entries</label>
                  </div>
                </div>
              </div>

              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>UserName</th>
                    <th>Profile</th>
                    <th>Credit Reference</th>
                    <th>Balance</th>
                    <th>Client (P/L)</th>

                    <th>Exposure</th>
                    <th>Exposure Limit</th>
                    <th>Available Balance</th>
                    <th>U St</th>
                    <th>B St</th>
                    <th>Account Type</th>
                    <th>Action</th>
                  </tr>
                  {/* ---- Totals Row ---- */}
                  <tr className="table-secondary fw-bold">
                    <td colSpan={2} className="text-end">
                      Total
                    </td>
                    <td>
                      {totals.creditReference.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totals.balance.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td
                      className={
                        totals.clientPL < 0 ? "text-red" : "text-green"
                      }
                    >
                      {totals.clientPL.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totals.exposure.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totals.exposerLimitRef.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totals.availableBalance.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                  {/* ------------------- */}
                </thead>
                <tbody>
                  {/* <FilteredList
                    items={users}
                    filterFunction={filterFunction}
                    renderItem={(user) => (
                      <UserTableRow
                        parent_name={parent}
                        key={user?.id}
                        user={user}
                        fetchUsers={fetchUsers}
                      />
                    )}
                  /> */}
                  <FilteredList
                    items={users}
                    renderItem={(user) => (
                      <UserTableRow
                        parent_name={parent}
                        key={user?.id}
                        user={user}
                        fetchUsers={fetchUsers}
                      />
                    )}
                  />
                </tbody>
              </table>

              <BottomNav
                current={betHistoryPage}
                total={betHistoryTotal}
                LEDGER={users}
                Device={Limit}
                setPage={setEntriesToShow}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClientList;
