import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { useNavigate } from "react-router-dom";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";

interface Commsion {
  up: number;
  down: number;
  user: number;
}
const AddPartner = () => {
  const dispatch = useDispatch();

  const Permissions = useAppSelector((p: RootState) => p.Permissions);
  const { user, token } = useAppSelector((p: RootState) => p.changeStore);
  const [permissions, setPermissions] = useState({
    userDeposit: false,
    userWithdraw: false,
    addUser: false,
    userStatus: false,
    betStatus: false,
    userPasswordUpdate: false,
    eventEnableDisable: false,
    reportHideShow: false,
    acceptDeclineWalletDeposit: false,
    acceptDeclineWalletWithdraw: false,
  });
  const [clientName, setClientName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const Api = async () => {
    const data = await instance.get(
      `user/commission?numeric_id=${user.numeric_id}`
    );
  for (const key in data.data) {
      if (Object.prototype.hasOwnProperty.call(data.data, key)) {
        const element = data.data[key];
        if (element.sportsType == "cricket") {
          setCricketDownlineCommission({
            up: element.upline,
            down: element.downline,
            user: 0,
          });
        }
        if (element.sportsType == "football") {
          setFootballDownlineCommission({
            up: element.upline,
            down: element.downline,
            user: 0,
          });
        }
        if (element.sportsType == "tennis") {
          setTennisDownlineCommission({
            up: element.upline,
            down: element.downline,
            user: 0,
          });
        }
      }
    }
  };
  useEffect(() => {
    Api();
  }, []);
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

  const [fullName, setFullName] = useState<string>("");

  const [accountType, setAccountType] = useState<string>("");
  const [creditReference, setCreditReference] = useState<string>("");
  // const [ExposerReference, setExposerReference] = useState<string>("");

  const [cricketDownlineCommission, setCricketDownlineCommission] =
    useState<Commsion>({ up: 0, down: 0, user: 0 });
  const [footballDownlineCommission, setFootballDownlineCommission] =
    useState<Commsion>({ up: 0, down: 0, user: 0 });
  const [tennisDownlineCommission, setTennisDownlineCommission] =
    useState<Commsion>({ up: 0, down: 0, user: 0 });

  const [matchOddsCommission, setMatchOddsCommission] = useState<string>("0");
  const [fancyCommission, setFancyCommission] = useState<string>("0");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigation = useNavigate();

  const [TransactionPassword, setTransactionPassword] = useState("");
  const handleCreateAccount = async () => {
    setError(null);
    setSuccess(null);

    if (
      !clientName ||
      !userPassword ||
      !retypePassword ||
      !fullName ||
      !accountType
    ) {
      setError("Please fill in all required personal and account details.");
      return;
    }
    if (Number(TransactionPassword) != Permissions.transactionPassword) {
      setError("TransactionPassword do not match.");
      return;
    }
    if (userPassword !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token || !user) {
      setError(
        "Authentication token or user ID is missing. Please log in again."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await instance.post(
        `user/add-account?numeric_id=${user.numeric_id}`,
        {
          username: clientName,
          firstName: clientName,
          role: accountType,
          phone: "",
          permissions,
          masterPassword: retypePassword,
          lastName: "",
          password: userPassword,
          credit: creditReference.length>0?creditReference:0,
          city: "",
          parentId: user._id,
          // exposerLimit:ExposerReference,
          TransactionPassword,
        }
      );

      if (accountType != "user") {
        if (
          cricketDownlineCommission.user == 0 &&
          footballDownlineCommission.user == 0 &&
          tennisDownlineCommission.user == 0
        ) {
          setError("set the value  of DownLine");
          return;
        }
        if(
          cricketDownlineCommission.up <= cricketDownlineCommission.user ||
          footballDownlineCommission.up <= footballDownlineCommission.user ||
          tennisDownlineCommission.up <= tennisDownlineCommission.user
        ) {
          setError("Upline commission must be greater than Downline commission.");
          return;
        }
        const commissionPromises = [];
        const commissionEndpoint = `user/commission?numeric_id=${user.numeric_id}`;

        commissionPromises.push(
          instance.post(commissionEndpoint, {
            downline: cricketDownlineCommission.user,
            sportsType: "cricket",
            upline: cricketDownlineCommission.up,
            userId: response.data._id,
          })
        );
        commissionPromises.push(
          instance.post(commissionEndpoint, {
            downline: footballDownlineCommission.user,
            sportsType: "football",
            upline: footballDownlineCommission.up,
            userId: response.data._id,
          })
        );
        commissionPromises.push(
          instance.post(commissionEndpoint, {
            downline: tennisDownlineCommission.user,
            sportsType: "tennis",
            upline: tennisDownlineCommission.up,
            userId: response.data._id,
          })
        );

        // commissionPromises.push(
        //   instance.post(commissionEndpoint, {
        //     downline: matchOddsCommission,
        //     sportsType: "match_odds",
        //     upline: 0,
        //     userId: user._id,
        //   })
        // );
        // commissionPromises.push(
        //   instance.post(commissionEndpoint, {
        //     downline: fancyCommission,
        //     sportsType: "fancy",
        //     upline: 0,
        //     userId: user._id,
        //   })
        // );
        await Promise.all(commissionPromises);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully!");

        setClientName("");
        setUserPassword("");
        setRetypePassword("");
        setFullName("");
        setAccountType("");
        setCreditReference("");
        setCricketDownlineCommission(({ up: 0, down: 0, user: 0 }));
        setFootballDownlineCommission(({ up: 0, down: 0, user: 0 }));;
        setTennisDownlineCommission(({ up: 0, down: 0, user: 0 }));
        setMatchOddsCommission("0");
        setFancyCommission("0");
      } else {
        setError(
          response.data.message || "Failed to create account. Please try again."
        );
      }
    } catch (err) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setPermissions(
      (prevPermissions) =>
        prevPermissions && {
          ...prevPermissions,
          [id]: checked,
        }
    );
  };

  return (
    <section className="mian-content">
      <div className="add-account-page">
        <div className="container-fluid">
          <div className="inner-content-box">
            <h2 className="inner-content-box-title">Add Account</h2>
            {isLoading && (
              <div className="alert alert-info">Creating account...</div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="row">
              <div className="col-lg-6 mb-3">
                <div className="row">
                  <div className="col-12 mb-2">
                    <h3 className="box-title">Personal Details</h3>
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">Client Name:</label>
                    <input
                      type="text"
                      className="form-control form-control-two"
                      placeholder="Client Name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">User Password:</label>
                    <input
                      type="password"
                      className="form-control form-control-two"
                      id="UserPassword"
                      placeholder="User Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">Retype Password:</label>
                    <input
                      type="password"
                      className="form-control form-control-two"
                      id="RetypePassword"
                      placeholder="Retype Password"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">Full Name:</label>
                    <input
                      type="text" // Changed to 'text' as it's Full Name, not email
                      className="form-control form-control-two"
                      id="FullName"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-3">
                <div className="row">
                  <div className="col-12 mb-2">
                    <h3 className="box-title">Account Details</h3>
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">Account Type:</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                    >
                      <option value="">-Select Your A/c. Type-</option>
                      {user.roles[0] == "owner_admin" && (
                        <>
                          <option value="hyper-hyper">super admin </option>
                          <option value="hyper">admin </option>
                          <option value="super-super">super master </option>
                          <option value="super-master">master </option>
                          <option value="master">agent </option>
                          <option value="user">user </option>
                        </>
                      )}
                      {user.roles[0] == "hyper-hyper" && (
                        <>
                          <option value="hyper">admin </option>
                          <option value="super-super">super master </option>
                          <option value="super-master">master </option>
                          <option value="master">agent </option>
                          <option value="user">user </option>
                        </>
                      )}
                      {user.roles[0] == "hyper" && (
                        <>
                          <option value="super-super">super master </option>
                          <option value="super-master">master </option>
                          <option value="master">agent </option>
                          <option value="user">user </option>
                        </>
                      )}
                      {user.roles[0] == "super-super" && (
                        <>
                           <option value="super-master">master </option>
                          <option value="master">agent </option>
                          <option value="user">user </option>
                        </>
                      )}
                      {user.roles[0] == "super-master" && (
                        <>
                          <option value="master">agent </option>
                          <option value="user">user </option>
                        </>
                      )}
                      {user.roles[0] == "master" && (
                        <>
                          <option value="user">user </option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label-two">Credit Reference:</label>
                    <input
                      type="text"
                      className="form-control form-control-two"
                      id="CreditReference"
                      placeholder="Credit Reference"
                      value={creditReference}
                      onChange={(e) =>Number(e.target.value)>=0&& setCreditReference(e.target.value)}
                    />
                  </div>
                  {/* <div className="col mb-4">
                    <label className="form-label-two">Exposer Limit:</label>
                    <input
                      type="number"
                      className="form-control form-control-two"
                      id="ExposerLimit"
                      placeholder="Exposer Limit"
                      value={ExposerReference}
                      onChange={(e) => setExposerReference(e.target.value)}
                    />
                  </div> */}
                </div>
              </div>
              {accountType != "user" && (
                <>
                  <div className="col-12 mb-3">
                    <h3 className="box-title">Partnership Setting</h3>
                    <div className="table-responsive">
                      <table className="table table-four">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Cricket</th>
                            <th>Football</th>
                            <th>Tennis</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Upline</td>
                           <td>{cricketDownlineCommission.up}</td>
                            <td>{footballDownlineCommission.up}</td>
                            <td>{tennisDownlineCommission.up}</td>
                          </tr>
                          <tr>
                            <td>Downline</td>
                            <td>
                              <input
                                type="text"
                                className="table-input-one"
                                value={cricketDownlineCommission.user}
                                onChange={(e) =>!isNaN(Number(e.target.value))&&Number(e.target.value)>=0&&
                                  setCricketDownlineCommission(p=>({...p,user:Number(e.target.value)}))
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="table-input-one"
                                value={footballDownlineCommission.user}
                                onChange={(e) =>Number(e.target.value)>=0&&
                                  setFootballDownlineCommission(p=>({...p,user:Number(e.target.value)}))
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="table-input-one"
                                value={tennisDownlineCommission.user}
                                onChange={(e) =>Number(e.target.value)>=0&&
                                  setTennisDownlineCommission(p=>({...p,user:Number(e.target.value)}))
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Our</td>
                            <td>{cricketDownlineCommission.up-cricketDownlineCommission.user}</td>
                            <td>{footballDownlineCommission.up-footballDownlineCommission.user}</td>
                            <td>{tennisDownlineCommission.up-tennisDownlineCommission.user}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-12 mb-5">
                    <h3 className="box-title">User Loss Commission %</h3>
                    <div className="table-responsive">
                      <table className="table table-four">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Match Odds - 0%</th>
                            <th>Fancy - 0%</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Downline</td>
                            <td>
                              <input
                                type="text"
                                className="table-input-one"
                                value={matchOddsCommission}
                                onChange={(e) =>
                                  setMatchOddsCommission(e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="table-input-one"
                                value={fancyCommission}
                                onChange={(e) =>
                                  setFancyCommission(e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h4 className="page-card-title">Permissions</h4>
                  <div className="col-12 mb-5">
                    <ul className="add-partner-ul">
                      {permissions &&
                        permissions &&
                        Object.entries(permissions).map(([key, value]) => (
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
                </>
              )}
              <div className="col-12 mt-2">
                <div className="row justify-content-end">
                  <div className="col-lg-4 mb-4">
                    <label className="form-label-two">
                      Transaction Password
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-two"
                      required
                      onChange={(e) => setTransactionPassword(e.target.value)}
                      placeholder="Transaction Password"
                    />
                    <div className="mt-2 text-end">
                      <button
                        type="button"
                        className="create-account-button"
                        onClick={handleCreateAccount}
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Account"}
                      </button>
                    </div>
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

export default AddPartner;
