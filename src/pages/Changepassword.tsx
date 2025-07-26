import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorHandler from "../utils/ErrorHandle";
import type { RootState } from "../helper/store";
import axios from "axios";
import { useAppSelector } from "../hook/hook";
import { Tp } from "../utils/Tp";
interface ChangePasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
  transactionPassword: string;
  oldPassword?: string;
}

const Changepassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormInputs>();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const { user, token } = useSelector((p: RootState) => p.changeStore);
  const transactionPassword=useAppSelector((p:RootState)=>p.Permissions.transactionPassword)

  const newPassword = watch("newPassword", "");
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
    setApiError(null);
    setApiSuccess(null);

    if (data.newPassword !== data.confirmPassword) {
      setApiError("New password and confirm password do not match.");
      return;
    }

    try {
      console.log("Submitting data:", data);
      if(location.pathname != "/firstLogin"){

if(data.transactionPassword!=String(transactionPassword)){
  return Tp()
}
  
      }

      const response = await axios.post(
        `${import.meta.env.VITE_Api_Url}user/change-password`,
        {
          confirmPassword: data.confirmPassword,
          firstLogin: location.pathname == "/firstLogin",
          newPassword: data.newPassword,
          oldPassword: data.oldPassword,
          transaction: data.transactionPassword,
        },
        {
          headers: {
            ["Authorization"]: `Token ${token}`,
            ["_id"]: user._id,
          },
        }
      );

      reset();
      navigation(
        `/TransactionPasswordSuccess/${response.data.transactionPassword}`
      );
    } catch (err: any) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError: setApiError,
      });
    }
  };

  return (
    <section className="mian-content">
      <div className="change-password-page">
        <div className="container-fluid">
          <div className="customreport-page">
            <div className="page-heading">
              <div className="page-heading-box">
                <h1 className="heading-one">Change Password</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                {apiError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    <strong>Error!</strong> {apiError}
                  </div>
                )}

                {apiSuccess && (
                  <div className="alert alert-success mb-3" role="alert">
                    <strong>Success!</strong> {apiSuccess}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="newPassword" className="lable-two">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message:
                              "Password must be at least 6 characters long",
                          },
                        })}
                      />
                      {errors.newPassword && (
                        <p className="text-danger mt-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="confirmPassword" className="lable-two">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="text-danger mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {location.pathname != "/firstLogin" && (
                      <div className="col-12 mb-3">
                        <label
                          htmlFor="transactionPassword"
                          className="lable-two"
                        >
                          Transaction Password
                        </label>
                        <input
                          type="password"
                          id="transactionPassword"
                          className="form-control"
                          {...register("transactionPassword", {
                            required: "Transaction password is required",
                            minLength: {
                              value: 4,
                              message:
                                "Transaction password must be at least 4 characters long",
                            },
                          })}
                        />
                        {errors.transactionPassword && (
                          <p className="text-danger mt-1">
                            {errors.transactionPassword.message}
                          </p>
                        )}
                      </div>
                    )}
                    {location.pathname == "/firstLogin" && (
                      <div className="col-12 mb-3">
                        <label
                          htmlFor="transactionPassword"
                          className="lable-two"
                        >
                          old Password
                        </label>
                        <input
                          type="password"
                          id="oldPassword"
                          className="form-control"
                          {...register("oldPassword", {
                            required: "old password is required",
                            minLength: {
                              value: 4,
                              message:
                                "old password must be at least 4 characters long",
                            },
                          })}
                        />
                        {errors.oldPassword && (
                          <p className="text-danger mt-1">
                            {errors.oldPassword.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="col-12 mb-3">
                      <button
                        type="submit"
                        className="dark-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Loading..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Changepassword;
