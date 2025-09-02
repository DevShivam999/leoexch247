import React, { useState, useEffect, useMemo } from "react";
import type { EventPLApiResponse } from "../types/vite-env";
import Loading from "../components/Loading";
import instance from "../services/AxiosInstance";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";

const EventPL: React.FC = () => {
  const [eventData, setEventData] = useState<EventPLApiResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigate();

  const [fromDate, setFromDate] = useState<Date | string>("");
  const [toDate, setToDate] = useState<Date | string>("");
  const dispatch = useDispatch();
  const fetchEventPLData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await instance.get(
        `/user/eventPl?to=${toDate}&from=${fromDate}`
      );

      setEventData(data.data);
    } catch (err: any) {
      ErrorHandler({
        err,
        dispatch,
        navigation,
        pathname: location.pathname,
        setError,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventPLData();
  }, []);

  const handleLoadData = () => {
    fetchEventPLData();
  };
  const totals = useMemo(() => {
    const overallProfitLoss = eventData?.data.reduce(
      (acc, cal) => acc + cal.profitLoss,
      0
    )||0;
    const overallCommission = eventData?.data.reduce(
      (acc, cal) => acc + cal.commission,
      0
    )||0;
    const overallTotalPL = eventData?.data.reduce(
      (acc, cal) => acc + cal.totalPL,
      0
    )||0;
    return {
      overallProfitLoss,
      overallCommission,
      overallTotalPL,
    };
  }, [eventData]);

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

  const { data = [] } = eventData || {};

  return (
    <section className="mian-content">
      <div className="event-pl-page">
        <div className="container-fluid">
          <div className="dark-page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one-inner">EVENT PROFIT LOSS</h1>
            </div>
          </div>
          <div className="row align-items-end mt-3">
            <div className="col-md-2 mb-3">
              <label htmlFor="fromDate" className="lable-two">
                From Date:
              </label>
              <input
                id="fromDate"
                type="date"
                value={
                  typeof fromDate === "string"
                    ? fromDate
                    : fromDate
                      ? fromDate.toISOString().slice(0, 10)
                      : ""
                }
                className="form-control"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFromDate(e.target.value)
                }
              />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="toDate" className="lable-two">
                To Date:
              </label>
              <input
                id="toDate"
                type="date"
                value={
                  typeof toDate === "string"
                    ? toDate
                    : toDate
                      ? toDate.toISOString().slice(0, 10)
                      : ""
                }
                className="form-control"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setToDate(e.target.value)
                }
              />
            </div>
            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={handleLoadData}
              >
                Load
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-two">
              <thead>
                <tr>
                  <th>Sport Name</th>
                  <th>Profit/Loss</th>
                  <th>Commission</th>
                  <th>Total P L</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.sportname}</td>
                      <td
                        className={
                          row.profitLoss < 0 ? "text-danger" : "text-success"
                        }
                      >
                        {formatCurrency(row.profitLoss)}
                      </td>
                      <td>{formatCurrency(row.commission)}</td>
                      <td
                        className={
                          row.totalPL < 0 ? "text-danger" : "text-success"
                        }
                      >
                        {formatCurrency(row.totalPL)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>

              {data.length > 0 && (
                <tfoot>
                  <tr>
                    <td>
                      <strong>Total:</strong>
                    </td>
                    <td
                      className={
                        totals.overallProfitLoss < 0
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      <strong>
                        {formatCurrency(totals.overallProfitLoss)}
                      </strong>
                    </td>
                    <td>
                      <strong>
                        {formatCurrency(totals.overallCommission)}
                      </strong>
                    </td>
                    <td
                      className={
                        totals.overallTotalPL < 0
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      <strong>{formatCurrency(totals.overallTotalPL)}</strong>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventPL;
