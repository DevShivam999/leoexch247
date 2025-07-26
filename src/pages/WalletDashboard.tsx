
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import type { WalletDashboardData } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";

const WalletDashboard: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletDashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation()
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const {data}=await instance("/user/walletdashboard")
        const mockDashboardData: WalletDashboardData = {
          totalUsers: data.data.users.total,
          activeUsers:  data.data.users.active,
          weeklyUsers:  data.data.users.weekly,
          monthlyUsers:  data.data.users.monthly,
          overallDeposits: data.data.stats.total.deposit,
          overallWithdraws: data.data.stats.total.withdraw,
          todayDeposits: data.data.stats.today.deposit,
          todayWithdraws: data.data.stats.today.withdraw,
          weeklyDeposits: data.data.stats.weekly.deposit,
          weeklyWithdraws: data.data.stats.weekly.withdraw,
          monthlyDeposits: data.data.stats.monthly.deposit,
          monthlyWithdraws: data.data.stats.weekly.withdraw,
        };
        setWalletData(mockDashboardData);
      } catch (err: any) {
        
         ErrorHandler({err,dispatch,navigation,pathname:location.pathname,setError})
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <section className="mian-content">
        <div className="container-fluid text-center mt-5">
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mian-content">
        <div className="container-fluid text-center mt-5">
          <p className="text-danger">Error: {error}</p>
        </div>
      </section>
    );
  }

  const {
    totalUsers = 0,
    activeUsers = 0,
    weeklyUsers = 0,
    monthlyUsers = 0,
    overallDeposits = 0,
    overallWithdraws = 0,
    todayDeposits = 0,
    todayWithdraws = 0,
    weeklyDeposits = 0,
    weeklyWithdraws = 0,
    monthlyDeposits = 0,
    monthlyWithdraws = 0,
  } = walletData || {};

  return (
    <section className="mian-content">
      <div className="wallet-dashboard-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">Dashboard</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-1">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h4>Total User</h4>
                    <span>
                      {totalUsers} <i className="fas fa-sync"></i>
                    </span>
                  </li>
                  <li>
                    <span>Click here</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-2">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h4>Active User</h4>
                    <span>
                      {activeUsers} <i className="fas fa-sync"></i>
                    </span>
                  </li>
                  <li>
                    <span>Click here</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-3">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h4>Weekly User</h4>
                    <span>
                      {weeklyUsers} <i className="fas fa-sync"></i>
                    </span>
                  </li>
                  <li>
                    <span>Click here</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-4">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h4>Monthly User</h4>
                    <span>
                      {monthlyUsers} <i className="fas fa-sync"></i>
                    </span>
                  </li>
                  <li>
                    <span>Click here</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-5">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h3>Total</h3>
                  </li>
                  <li>
                    <span>Deposit:</span>
                    <span>{formatCurrency(overallDeposits)}</span>
                  </li>
                  <li>
                    <span>Withdraw:</span>
                    <span>{formatCurrency(overallWithdraws)}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-5">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h3>Today</h3>
                  </li>
                  <li>
                    <span>Deposit:</span>
                    <span>{formatCurrency(todayDeposits)}</span>
                  </li>
                  <li>
                    <span>Withdraw:</span>
                    <span>{formatCurrency(todayWithdraws)}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-5">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h3>Weekly</h3>
                  </li>
                  <li>
                    <span>Deposit:</span>
                    <span>{formatCurrency(weeklyDeposits)}</span>
                  </li>
                  <li>
                    <span>Withdraw:</span>
                    <span>{formatCurrency(weeklyWithdraws)}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 mb-3">
              <div className="w-dashboard-card bg-5">
                <ul className="w-dashboard-card-ul">
                  <li>
                    <h3>Monthly</h3>
                  </li>
                  <li>
                    <span>Deposit:</span>
                    <span>{formatCurrency(monthlyDeposits)}</span>
                  </li>
                  <li>
                    <span>Withdraw:</span>
                    <span>{formatCurrency(monthlyWithdraws)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletDashboard;
