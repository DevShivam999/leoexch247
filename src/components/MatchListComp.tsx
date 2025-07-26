import React, {  useState } from "react";
import { Link } from "react-router-dom";
import type { MatchList } from "../types/vite-env";
import MatchListSocket from "./MatchListSocket";

const CricketMatchList: React.FC<{ matches: MatchList[] }> = ({ matches }) => {
  const [searchTerm, setSearchTerm] = useState("");

 

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  return (
    <section className="right-section">
      <div className="container-fluid p-0">
        <form
          className="search-form"
          style={{
            paddingRight: "1rem",
            textAlign: "right",
            marginTop: "1rem",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search_sec">
            <input
              type="text"
              name="search-box"
              placeholder="Search..."
              style={{
                border: "1px solid #f0f0f0",
                height: "32px",
                fontSize: "12px",
                color: "#8c9399",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <a href="javascript:void(0)" style={{ color: "darkgray" }}>
              <i className="fa fa-search" />
            </a>
          </div>
        </form>

        <div
          className="table-wrapper"
          style={{
            overflowX: "auto",
            width: "100%",
            backgroundColor: "#e2e8ed",
          }}
        >
          <table
            className="ac_statement_table"
            style={{ lineHeight: "3rem", width: "100%" }}
          >
            <thead>
              <tr style={{ lineHeight: "1.2" }}>
                <th></th>
                <th>Match Name</th>
                <th>Open Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match, index) => (
                <tr className="trrow" key={match._id}>
                  <td>
                    <b>{index + 1}</b>
                  </td>
                  <td>
                    <Link to={`/matchInfo/${match.matchId}`}>{match.name}</Link>
                  </td>
                  <td >{match.inplay&&"🟢"}{new Date(match.openDate).toDateString()}</td>
                  <td>
                    <div className="switch-button">
                      <span
                        id="PointDetail"
                        className="font-weight-bold Text-15"
                      >
                       <MatchListSocket key={match.matchId} id={match.matchId} status={match.matchStatus} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row center-align"></div>
      </div>
    </section>
  );
};

export default CricketMatchList;
