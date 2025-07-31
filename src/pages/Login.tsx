import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import logo from "/logo.png";
import { Login_Api } from "../api/Login_Api";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../helper/Changes";
import { useNavigate } from "react-router-dom";

export interface ILoginFormInputs {
  username: string;
  password: string;
}

const AdminLoginPage: React.FC = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);
  const [loading,setLoading]=useState(false)
  const navigation=useNavigate()
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>();
  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    if(loading) return
    setLoading(true)
    const login = await Login_Api(data);
    if(!login) return
   
    if (login.result) {
      
        dispatch(setUser({user:JSON.parse(localStorage.getItem("user") || "")}));
        dispatch(setToken({token:JSON.parse(localStorage.getItem("token") || "")}));
        setLoading(false)
      if (login.data) {
        let location = localStorage.getItem("Location");
        localStorage.removeItem("Location");
        location = location != "/login" ? (location ?? "/") : "/";

        window.location.pathname = location;
      } else {
        navigation("/firstLogin")
      }
    }
  };

  return (
    <section className="admin-login-page">
      <div className="login-box">
        <div className="logo">
          <img alt="logo" src={logo} className="login-logo-img" />
        </div>
        <div className="login-form mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 mb-3">
                <h4 className="login-title">
                  Admin LOGIN <i className="fas fa-hand-point-down"></i>
                </h4>
              </div>
              <div className="col-12 mb-3">
                <div className="admin-logon-in-box">
                  <input
                    type="text"
                    id="username"
                    placeholder="username"
                    className="form-control adlogin-input"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {/* Display validation error if it exists */}
                  {errors.username && (
                    <p className="text-danger">{errors.username.message}</p>
                  )}
                </div>
              </div>
              <div className="col-12 mb-3">
                <div className="admin-logon-in-box">
                  <input
                    type="password"
                    id="password"
                    placeholder="password"
                    className="form-control adlogin-input"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {/* Display validation error if it exists */}
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="btn-list">
              <button type="submit" className="btn button-one">
                Login <i className="fas fa-sign-in-alt float-end mt-1"></i>
              </button>
            </div>
          </form>
        </div>
        <div className="log-copys">
          <p className="login-text">
            © <span>Leoexch247</span>
            <a href="mailto:info@starexch.com" className="mail-link">
              info@Leoexch247.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
