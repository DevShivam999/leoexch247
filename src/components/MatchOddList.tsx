import  { useState } from "react";
import type { Sessions } from "../types/vite-env";
import SessionMatchList from "./SessionMatchList";



const MatchOddList = ({sessions}:{sessions:Sessions[]}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = sessions.filter((s) =>
    s.RunnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

   

  return (
    <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
      <div style={{ background: "#000", color: "#fff", padding: "0.75rem 1rem", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
        <h3>Sessions</h3>
      </div>

      <div style={{ background: "#333", padding: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px",
            fontSize: "14px",
          }}
        />
        <button style={{ marginLeft: "10px", background: "transparent", color: "white", border: "none" }}>
          <i className="fa fa-search" />
        </button>
      </div>

      <table style={{ width: "100%", backgroundColor: "#fff", borderCollapse: "collapse" }}>
        <thead style={{ background: "#000", color: "#fff" }}>
          <tr>
            <th style={styles.th}>Session RunnerName</th>
            <th style={styles.th}>Create Date</th>
            <th style={styles.th}>Session Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((session) => (
            <SessionMatchList key={session._id} session={session} />
          ))}
        </tbody>
      </table>

      <div style={{ padding: "1rem", fontSize: "14px" }}>
        Showing {filteredSessions.length} session{filteredSessions.length !== 1 && "s"}
      </div>
    </div>
  );
};



export default MatchOddList;


export const styles = {
  th: {
    padding: "12px 16px",
    textAlign: "left" as const,
  },
  td: {
    padding: "12px 16px",
  },
  input: {
    padding: "6px",
    marginRight: "8px",
    width: "60px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  resultBtn: {
    backgroundColor: "#009688",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    marginRight: "8px",
    cursor: "pointer",
  },
  iconBtn: {
    backgroundColor: "#009688",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    marginRight: "6px",
    cursor: "pointer",
  },
};