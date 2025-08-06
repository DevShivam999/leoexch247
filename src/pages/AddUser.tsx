
import React, {  useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import instance from "../services/AxiosInstance";
import type { RootState } from "../helper/store";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import { Tp } from "../utils/Tp";

const AddUser = () => {
  const [clientName, setClientName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const dispatch = useDispatch();
  const Permissions=useAppSelector((p:RootState)=>p.Permissions)

  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({
    userDeposit: false,
    userWithdraw: false,
    addUser: false,
    userStatus: false,
    betStatus: false,
    userPasswordUpdate: false,
    eventEnableDisable: false,
    reportHideShow: false,
    acceptWalletDepositRequest: false,
    acceptWalletWithdrawRequest: false,
  });
    useMemo(() => {
      if (Permissions.permissions) {
        const obj: Record<string, any> = {};
        Object.entries(Permissions.permissions).forEach(([key, value]) => {
          if (value) {
            obj[key] = false;
          }
        });
        //@ts-ignore
        setPermissions(obj);
      }
    }, [Permissions.permissions]);
  const { user } = useAppSelector((p: RootState) => p.changeStore);
  const tPassword=useAppSelector((p:RootState)=>p.Permissions.transactionPassword)
  const [transactionPassword, setTransactionPassword] = useState("");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "clientName") {
      setClientName(value);
    } else if (name === "userPassword") {
      setUserPassword(value);
    } else if (name === "retypePassword") {
      setRetypePassword(value);
    } else if (name === "transactionPassword") {
      setTransactionPassword(value);
    }
  };
 

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [id]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Tp("User not found, please login again.");
      return;
    }
    if (userPassword.length < 6) return Tp("password must be 6");
    if (userPassword !== retypePassword) {
      Tp("Passwords do not match!");
      return;
    }
    if(transactionPassword!=String(tPassword)){
      return Tp()
    }

    console.log(permissions);
    
    try {
      await instance.post(`/user/add-account`, {
        username: clientName,
        firstName: clientName,
        type: "partner",
        role: user.roles[0],
        credit: 0,
        parentId: user._id,
        password: userPassword,
        permissions: {
          userDeposit: permissions.userDeposit,
          userWithdraw: permissions.userWithdraw,
          addUser: permissions.addUser,
          userStatusActiveInactive: permissions.userStatus,
          betStatusEnableDisable: permissions.betStatus,
          userPasswordUpdate: permissions.userPasswordUpdate,
          eventEnableDisable: permissions.eventEnableDisable,
          reportHideShow: permissions.reportHideShow,
          acceptWalletDeposit: permissions.acceptWalletDepositRequest,
          acceptWalletWithdraw: permissions.acceptWalletWithdrawRequest,
        },
      });
      navigate("/list-of-clients");
    } catch (err) {
     
      ErrorHandler({err,dispatch,navigation:navigate,pathname:location.pathname})
    }
  };

  return (
    <section className="mian-content">
      <div className="create-partner-page">
        <div className="container-fluid">
          <div className="page-card-box">
            <h1 className="heading-one">Account Statement</h1>
            <form onSubmit={handleSubmit}>
              <div className="row mt-3">
                <div className="col-6">
                  <h4 className="page-card-title">Personal Details</h4>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label htmlFor="clientName" className="lable-two">
                        Client Name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Agent1234"
                       
                        name="clientName"
                        value={clientName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label htmlFor="userPassword" className="lable-two">
                        User Password:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="User Password"
                        id="userPassword"
                        name="userPassword"
                        value={userPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label htmlFor="retypePassword" className="lable-two">
                        Retype Password:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Retype Password"
                        id="retypePassword"
                        name="retypePassword"
                        value={retypePassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <h4 className="page-card-title">Permissions</h4>
                  <div className="row">
                    <div className="col-12 mb-5">
                      <ul className="add-partner-ul">
                        {Object.entries(permissions).map(([key, value]) => (
                          <li className="form-check" key={key}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={key}
                              name={key}
                              checked={value}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={key}>
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-7 mb-3 ms-auto">
                      <label
                        htmlFor="transactionPassword"
                        className="lable-two"
                      >
                        Transaction Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Transaction Password"
                        id="transactionPassword"
                        name="transactionPassword"
                        value={transactionPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-7 mb-3 ms-auto">
                      <button type="submit" className="dark-button">
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddUser;
