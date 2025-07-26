import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../helper/store";
import { useLocation, useNavigate } from "react-router-dom";
import useAppDispatch from "../hook/hook";
import instance from "../services/AxiosInstance";
import CommanTable from "./CommanTable";
import CommanOption from "./CommanOption";
import ErrorHandler from "../utils/ErrorHandle";
import DateInput from "./DateInput";
import SearchBtn from "./button/Serarch.btn";
import SearchCom from "./SearchCom";

const CommonDW = ({ type, show = false }: { type: string; show?: boolean }) => {
  const location = useLocation();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const user = useSelector((p: RootState) => p.changeStore.user);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const Api = async () => {
    console.log
    (fromRef.current?.value)
    try {
      const { data } = await instance.get(
        `${type == "Deposit" ? `/admin/getDepositReq?&to=${toRef.current?.value||""}&from=${fromRef.current?.value||""}` : type == "All" ? "/admin/getWalletReq" : `/admin/getwithdrawReq?to=${toRef.current?.value||""}&from=${fromRef.current?.value||""}`}`
      );
      setData(data.data || []);
    } catch (err) {
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
    if (!user) {
      navigation("/login");
    }
    document.title = `${type} Transaction`;
    Api();
  }, []);
  const handleAccept = async (id: string, method: string, ok: string) => {
    setLoading(true);
    try {
      await instance.post("/admin/changeStatusWDAll", {
        id: id,
        status: method,
        type: ok,
      });

      Api();
      setLoading(false);
    } catch (err) {
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
  const [filter, setFilter] = useState("1");
  const [filteredData, setfilteredData] = useState<any[]>([]);

  useEffect(() => {
    console.log(filter);

    const p = data.filter((item) => {
      if (filter == "1") return data;
      return item.status === filter;
    });
    setfilteredData(p);
  }, [data, filter]);

  const handleChange = (e: string) => {
    if (e.trim() === "") {
      setfilteredData(data);
      return;
    }
    const searchTerm = e.toLowerCase();
    const filtered = data.filter((item) =>
      item.user.username.toLowerCase().includes(searchTerm)
    );
    setfilteredData(filtered);
  };
  return (
    <section className="mian-content">
      <div className="withdrawal-transaction-page">
        <div className="container-fluid">
          {!show ? (
            <>
              <div className="page-heading">
                <div className="page-heading-box">
                  <h1 className="heading-one">{type} Transaction</h1>
                </div>
              </div>
              <div className="row align-items-end">
                <div className="col-md-2 mb-3">
                  <label className="lable-two">{type} transaction</label>
                  <select
                    className="form-select"
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Default select example"
                  >
                    <CommanOption />
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div className="page-heading-box">
                  <h1 className="heading-one">Total {type} </h1>
                </div>
              </div>
              <div className="row align-items-end">
               <SearchCom handleChange={handleChange} type="Search name/phone"/>
                <div className="col-md-2 mb-3">
                  <label className="lable-two">Status</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <CommanOption />
                  </select>
                </div>
                <DateInput label="From" ref={fromRef} />
                <DateInput label="To" ref={toRef} />
                <SearchBtn Api={Api} type="Search" />
                <div className="col-md-2 mb-3">
                  <h5 className="text-end">
                    {" "}
                    Total {type}:{" "}
                    <span className="text-green">
                      {filteredData.reduce((acc, item) => {
                        return acc + (item.amount || 0);
                      }, 0)}
                    </span>
                  </h5>
                </div>
              </div>
            </>
          )}
          <div className="table-responsive">
            <CommanTable
              error={error ?? ""}
              filteredData={filteredData}
              username={user.username}
              handleAccept={handleAccept}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonDW;
