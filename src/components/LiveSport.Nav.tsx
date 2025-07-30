import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

const LiveSportNav = () => {
  const { sport } = useAppSelector((p: RootState) => p.Sport);
  const location = useLocation();

  return (
    <li className="left-bar-item accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button accordion-item-btn collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseSports"
          aria-expanded="false"
          aria-controls="collapseSports"
        >
          <i className="bi bi-trophy-fill"></i> Sports
        </button>
      </h2>
      <div
        id="collapseSports"
        className="accordion-collapse collapse"
        data-bs-parent="#left-navbar"
      >
        <div className="accordion-body p-0">
          <ul className="accordion-inner-ul">
            {sport.map((sp, sportIdx) => (
              <li
                className="accordion-inner-item accordion-item"
                key={sportIdx}
              >
                <h2 className="accordion-header">
                  <button
                    className="accordion-button accordion-item-btn collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#comp-${sportIdx}`}
                    aria-expanded="false"
                    aria-controls={`comp-${sportIdx}`}
                  >
                    {sp.comp_name}
                  </button>
                </h2>

                <div
                  id={`comp-${sportIdx}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#collapseSports"
                >
                  <div className="accordion-body p-0">
                    <ul className="accordion-inner-ul">
                      {sp.comp_name !== "horse" &&
                      sp.comp_name !== "greyhound" ? (
                        sp.eventData && sp.eventData.length > 0 ? (
                          sp.eventData.map((competition, compIdx) => (
                            <li
                              className="accordion-inner-item accordion-item"
                              key={compIdx}
                            >
                              <h2 className="accordion-header">
                                <button
                                  className="accordion-button accordion-item-btn collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#match-${sportIdx}-${compIdx}`}
                                  aria-expanded="false"
                                  aria-controls={`match-${sportIdx}-${compIdx}`}
                                >
                                  {competition.name}
                                </button>
                              </h2>

                              <div
                                id={`match-${sportIdx}-${compIdx}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#comp-${sportIdx}`}
                              >
                                <div className="accordion-body p-0">
                                  <ul className="accordion-inner-ul">
                                    {competition.matches.map(
                                      (match, matchIdx) => (
                                        <li
                                          className="accordion-inner-item accordion-item"
                                          key={matchIdx}
                                        >
                                          <Link
                                            to={`/live-market/${sp.comp_name}/${match.id}`}
                                            className={`accordion-inner-link ${
                                              location.pathname ===
                                              `/live-market/${sp.comp_name}/${match.id}`
                                                ? "active"
                                                : ""
                                            }`}
                                          >
                                            {match.name}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="accordion-inner-item accordion-item">
                            <div className="skeleton-wrapper">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="skeleton-item">
                                  <div className="dot" />
                                  <div className="skeleton-box" />
                                </div>
                              ))}
                            </div>
                          </li>
                        )
                      ) : (
                        <div
                          id={`match-${sportIdx}`}
                          className="accordion-collapse collapse show"
                          data-bs-parent={`#comp-${sportIdx}`}
                        >
                          <div className="accordion-body p-0">
                            <ul className="accordion-inner-ul">
                              {sp.matches && sp.matches.length > 0 ? (
                                sp.matches.map((match, matchIdx) => (
                                  <li
                                    className="accordion-inner-item accordion-item"
                                    key={matchIdx}
                                  >
                                    <Link
                                      to={`/live-market/${sp.comp_name}/${match.id}`}
                                      className={`accordion-inner-link ${
                                        location.pathname ===
                                        `/live-market/${sp.comp_name}/${match.id}`
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      {`${String(new Date(match.openDate || "").getHours()).padStart(2, "0")}:${String(new Date(match.openDate || "").getMinutes()).padStart(2, "0")}`}
                                      {match.name} ({match.countryCode})
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li className="accordion-inner-item accordion-item">
                                  <div className="skeleton-wrapper">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="skeleton-item">
                                        <div className="dot" />
                                        <div className="skeleton-box" />
                                      </div>
                                    ))}
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default LiveSportNav;
