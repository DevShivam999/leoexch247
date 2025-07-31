import ColorTd from "./ColorTd";
import Loading from "./Loading";
import TableHead from "./TableHead";

const CommanTable = ({
  loading,
  error,
  filteredData,
  username,
  handleAccept,
}: {
  loading: boolean;
  error: string;
  filteredData: any[];
  username: string;
  handleAccept: (id: string, type: string, ok: string) => void;
}) => {
  return (
    <table className="table table-two">
      <thead>
        <tr>
          {[
            "Date",
            "Name",
            "Ref.No",
            "Type",
            "From/To",
            "Amount",
            "Status",
            "Action",
          ].map((p) => (
            <TableHead type={p} key={p}/>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td>
              <Loading />
            </td>
          </tr>
        ) : error ? (
          <tr className="error-message">{error}</tr>
        ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <tr key={index}>
              {[
                new Date(item.createdAt).toLocaleDateString(),
                item.user.username,
                item.IFSC ?? "-",
                item.type ?? "-",
                `${item.user.username}/${username}`,
                item.amount,
                item.status,
              ].map((p) => (
                <ColorTd amount={p} key={p} />
              ))}

              <td className="d-flex gap-2">
               {item.status=="Approved"&& <button
                  className="btn btn-primary"
                  disabled={item.status !== "Pending"}
                  onClick={() => handleAccept(item._id, "Approved", item.type)}
                >
                 {item.status !== "Pending"?" Approved":"Approve"}
                </button>}
               {item.status=="Rejected"&& <button
                  className="btn btn-danger"
                  disabled={item.status !== "Pending"}
                  onClick={() => handleAccept(item._id, "Rejected", item.type)}
                >
                  
                 {item.status !== "Pending"?" Rejected":"Reject"}
                </button>
                  }
               {item.status=="Pending"&& 
              <>
               <button
                  className="btn btn-primary"
                  disabled={item.status !== "Pending"}
                  onClick={() => handleAccept(item._id, "Approved", item.type)}
                >
                 {item.status !== "Pending"?" Approved":"Approve"}
                </button>
                 <button
                  className="btn btn-danger"
                  disabled={item.status !== "Pending"}
                  onClick={() => handleAccept(item._id, "Rejected", item.type)}
                >
                  
                 {item.status !== "Pending"?" Rejected":"Reject"}
                </button>
              </>
                }
              
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9}>
              <p className="no-data">No Data Found!</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CommanTable;
