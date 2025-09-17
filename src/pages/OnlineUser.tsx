// import React from "react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

export default function OnlineUser() {
  const { socket } = useAppSelector((p: RootState) => p.socket);
  const [loading, setloading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    setloading(true);
    if (!socket) return;
    const handler = (data: any) => {
      // console.log("Raw socket data:", data);
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      setOnlineUsers(list);
      setloading(false);
    };
    socket.emit("getonline", {});
    socket.on("getonline", handler);
    return () => {
      socket.off("getonline", handler);
    };
  }, [socket]);

  // Log whenever state updates
  useEffect(() => {
    // console.log(onlineUsers[0]);
    console.log("Updated onlineUsers state:", onlineUsers);
  }, [onlineUsers]);

  return (
    <section className="main-content ">
      <div className="card shadow">
        <div className="card-body">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Online Users</h1>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="table-responsive">
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
                    {/* <th>U St</th>
                    <th>B St</th> */}
                    <th>Account Type</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* user row */}
                  {onlineUsers.map((u: any, idx: number) => (
                    <tr key={u._id || idx}>
                      <td>
                        <span className="user-name-box">
                          {u.username || u.displayName || u.firstName}
                        </span>
                      </td>
                      <td>{u.numeric_id}</td>
                      <td>{u.credit}</td>
                      <td>{u.credit}</td>
                      <td
                        className={
                          u.profitLossBalance > 0 ? "text-green" : "text-red"
                        }
                      >
                        {Math.round(u.profitLossBalance * 100) / 100}
                      </td>
                      <td
                        className={
                          u.profitLossBalance > 0 ? "text-green" : "text-red"
                        }
                      >
                        {u.exposerLimit?.toFixed(2)}
                      </td>
                      <td
                        className={
                          u.profitLossBalance > 0 ? "text-green" : "text-red"
                        }
                      >
                        {(u?.exposerLimitRef || 0).toFixed(2)}
                      </td>
                      <td>{u.totalBalance}</td>
                      {/* <td>{u.upline}</td>
                      <td>{u.betStatus ? "Active" : "Inactive"}</td> */}
                      <td>{u.roles?.[0]}</td>
                      {/* <td>
                         <button className="btn btn-sm btn-primary">View</button>
                        <button className="btn btn-sm btn-warning">Edit</button>
                        <button className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* <BottomNav
                current={betHistoryPage}
                total={betHistoryTotal}
                LEDGER={users}
                Device={Limit}
                setPage={setEntriesToShow}
              /> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
