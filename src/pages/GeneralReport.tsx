import { useEffect, useState } from "react";
import instance from "../services/AxiosInstance";
import ErrorHandler from "../utils/ErrorHandle";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const GeneralReport = () => {
  const [selectedType, setSelectedType] = useState("General Report");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();

  const [tableRows, setTableRow] = useState<any | null>(null);
  const [SelecttableRows, setSelecttableRows] = useState<any | null>(null);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    
  }
 const laod = () => {
  if (selectedType.length > 0 && SelecttableRows) {
    let filteredRows = SelecttableRows;

    if (selectedType === "Credit Reference Report") {
      filteredRows = SelecttableRows.filter((row: any) => {
        const leftTx = row?.left?.txType;
        const rightTx = row?.right?.txType;
        return leftTx === "CR" || rightTx === "CR";
      });
    } else if (selectedType === "General Report") {
      filteredRows = SelecttableRows.filter((row: any) => {
        const leftTx = row?.left?.txType;
        const rightTx = row?.right?.txType;
        return leftTx === "DR" || rightTx === "DR";
      });
    }

    setTableRow(filteredRows);
  }
};

  const handleLoadData = async () => {
    setIsLoading(true);
    try {
      const data = await instance.get("/user/generalReport");
      splitDataIntoColumns(data.data.results);
    } catch (error) {
      ErrorHandler({
        err: error,
        dispatch,
        navigation,
        pathname: location.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    document.title = "General Report";
    handleLoadData();
  }, []);
 const splitDataIntoColumns = (data: any[]) => {
  // Separate CR and DR
  const leftColumn = data.filter(item => item.txType === "CR");
  const rightColumn = data.filter(item => item.txType === "DR");

  const rows = [];
  const maxRows = Math.max(leftColumn.length, rightColumn.length);

  for (let i = 0; i < maxRows; i++) {
    rows.push({
      left: leftColumn[i] || {},
      right: rightColumn[i] || {},
    });
  }

  setSelecttableRows(rows);
  setTableRow(rows);
};


  return (
    <section className="main-content">
      <div className="general-report-page">
        <div className="container-fluid">
          <div className="page-heading">
            <div className="page-heading-box">
              <h1 className="heading-one">General Report</h1>
            </div>
          </div>

          <div className="row align-items-end">
            <div className="col-md-2 mb-3">
              <label className="label-two">Select Type</label>
              <select
                className="form-select"
                aria-label="Report type selection"
                value={selectedType}
                onChange={(e) => handleTypeChange(e)}
              >
                <option value="General Report">General Report</option>
                <option value="Credit Reference Report">
                  Credit Reference Report
                </option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <button
                type="button"
                className="dark-button"
                onClick={laod}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load"}
              </button>
            </div>
          </div>

          <div className="">
            <table className="table table-two">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : (
                  tableRows &&
                  tableRows.length > 0 &&
                  tableRows.map((row: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1 || ""}</td>
                      <td>{row?.left?.username || ""}</td>
                      <td>{row?.left?.amount}</td>
                      <td>{index + 1 || ""}</td>
                      <td>{row?.right?.username || ""}</td>
                      <td>{row?.right?.amount }</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralReport;
