import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import logo from "/logo-1.png";
import { Login_Api } from "../api/Login_Api";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../helper/Changes";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

export interface ILoginFormInputs {
  username: string;
  password: string;
}

const AdminLoginPage: React.FC = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get socket from Redux (unwrap correctly)
  const socket = useAppSelector((p: RootState) => p.socket.socket);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>();

  // 🔑 Handle form submit
  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const login = await Login_Api(data);
      if (!login) return;

      if (login.result) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // store in redux
        dispatch(setUser({ user }));
        dispatch(
          setToken({ token: JSON.parse(localStorage.getItem("token") || "") })
        );

        // ✅ Fire socket login
        if (socket && user?.numeric_id) {
          socket.emit("login", { userId: user.numeric_id });
          console.log("🔗 Socket login emitted:", user.numeric_id);
        }

        // ✅ Navigate depending on firstLogin
        if (login.data) {
          let location = localStorage.getItem("Location");
          localStorage.removeItem("Location");
          location = location !== "/login" ? location ?? "/" : "/";
          navigation(location); // SPA navigation
        } else {
          navigation("/firstLogin");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Global logout listener (runs once when socket available)
  useEffect(() => {
    if (!socket) return;

    const handleLogout = (reason: any) => {
      console.log("⚡ Received logout event:", reason);
      localStorage.clear();
      navigation("/login");
    };

    socket.off("logout", handleLogout); // prevent duplicates
    socket.on("logout", handleLogout);

    return () => {
      socket.off("logout", handleLogout); // cleanup on unmount
    };
  }, [socket, navigation]);

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

              {/* Username */}
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
                  {errors.username && (
                    <p className="text-danger">{errors.username.message}</p>
                  )}
                </div>
              </div>

              {/* Password */}
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
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="btn-list">
              <button
                type="submit"
                className="btn button-one"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}{" "}
                <i className="fas fa-sign-in-alt float-end mt-1"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
