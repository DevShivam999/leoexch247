import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../pages/Currentbet";
import { useDispatch } from "react-redux";
import type { RootState } from "../helper/store";
import { getGameTypeName2 } from "../pages/LiveMatch";
import MarketSettingsModal from "./ViewMs";
import ColorTd from "./ColorTd";
import type { FancyOrder } from "../types/vite-env";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
import { Tp } from "../utils/Tp";
import { getFancyData } from "../helper/FancyBetData";

const LiveMatchSideList = React.memo(
  ({
    html,
    channel,
    eventId,
  }: {
    html: string;
    channel: number;
    eventId: number;
  }) => {
    const location = useLocation();
    const { id, matchName } = useParams();
    const [fancyOrders, setFancyOrders] = useState<FancyOrder[]>([]);
    const navigation = useNavigate();
    const socket = useAppSelector((p: RootState) => p.socket);
    const { user, token } = useAppSelector((p: RootState) => p.changeStore);
    const dispatch = useDispatch();

    const [userBook, setUserBook] = useState<any[]>([]);
    const [showMarketSettingsModal, setShowMarketSettingsModal] =
      useState(false);
    const [isBookModalOpen, setIsBookModalOpen] = useState<string | null>(null);

    const [viewMoreFilters, setViewMoreFilters] = useState({
      username: "",
      amountMin: "",
      amountMax: "",
      ipAddress: "",
      type: "25",
    });
    const [filteredViewMoreData, setFilteredViewMoreData] = useState<
      FancyOrder[]
    >([]);
    const [keyOK, setkey] = useState(false);
    const [selectAllForDeletion, setSelectAllForDeletion] = useState(false);

    // Nation: ONLY sessionRunner or runnerName
    const nationOf = (o: any) =>
      (o?.sessionRunner && String(o.sessionRunner).trim()) ||
      (o?.runnerName && String(o.runnerName).trim()) ||
      "-";

    const BetListApi = useCallback(async () => {
      if (isBookModalOpen == "book") return;
      try {
        const { data } = await instance.get(
          `betting/orders?matchId=${id}&numeric_id=${user.numeric_id}`
        );

        if (data.fancy_orders || data.unmatched_orders) {
          const combinedOrders = [
            ...(data.fancy_orders || []),
            ...(data.unmatched_orders || []),
          ].map((bet: FancyOrder) => ({ ...bet, isSelected: false }));

          dispatch(getFancyData({ data: data.fancy_orders }));
          setFancyOrders(combinedOrders);
        } else if (data.orders) {
          setFancyOrders(
            data.orders.map((bet: FancyOrder) => ({
              ...bet,
              isSelected: false,
            }))
          );
          setUserBook(
            data.orders.filter((p: any) => p.marketName == "BOOKMAKER")
          );
          dispatch(
            getFancyData({
              data: data.orders.filter((p: any) => p.oddsType == "Session"),
            })
          );
        }
      } catch (err) {
        ErrorHandler({
          err,
          dispatch,
          navigation,
          pathname: location.pathname,
        });
      }
    }, [
      id,
      user._id,
      user.numeric_id,
      token,
      isBookModalOpen,
      navigation,
      dispatch,
    ]);

    const BetLockApi = async (matchId: string, isUser = true, fan = false) => {
      try {
        await instance.post(`betting/betlock`, {
          type: isUser ? "all" : "user",
          match: matchId,
          userId: user._id,
          status: true,
          fancy: fan,
        });
      } catch (err) {
        ErrorHandler({
          err,
          dispatch,
          navigation,
          pathname: location.pathname,
        });
      }
    };

    const fetchBookData = useCallback(async () => {
      if (!isBookModalOpen) return;
      try {
        const event = await getGameTypeName2(matchName || "");
        const { data } = await instance.get(
          `betting/matchSummary?matchId=${id}&marketId=${
            isBookModalOpen === "user" ? "" : "1.2145500_SB"
          }&eventId=${event}&numeric_id=${user.numeric_id}`
        );
        isBookModalOpen != "book" && setUserBook(data.data);
      } catch (err) {
        ErrorHandler({
          err,
          dispatch,
          navigation,
          pathname: location.pathname,
        });
      }
    }, [
      id,
      matchName,
      isBookModalOpen,
      user._id,
      user.numeric_id,
      token,
      navigation,
      dispatch,
    ]);

    useEffect(() => {
      BetListApi();
    }, [BetListApi]);

    useEffect(() => {
      isBookModalOpen && fetchBookData();
    }, [isBookModalOpen, fetchBookData]);

    const [showScoreCardHtml, setShowScoreCardHtml] = useState(false);

    useEffect(() => {
      socket.socket.on("deleteBetsOrders", (data) => {
        data;
        BetListApi();
      });

      return () => {
        socket.socket.off("deleteBetsOrders");
      };
    }, [BetListApi, socket.socket]);

    useEffect(() => {
      const blockDevToolsShortcut = (e: KeyboardEvent) => {
        if (
          e.key === "F12" ||
          e.key === "F11" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.shiftKey && e.key === "C")
        ) {
          setkey(true);
        }
      };

      document.addEventListener("keydown", blockDevToolsShortcut);

      return () => {
        document.removeEventListener("keydown", blockDevToolsShortcut);
        setkey(false);
      };
    }, []);

    const handleDeleteBet = (
      type: string,
      oddsType: string,
      orderId: string | null
    ) => {
      const ordersToDelete = selectAllForDeletion
        ? fancyOrders.filter((bet) => bet.isSelected)
        : fancyOrders.filter((bet) => bet.isSelected);

      if (type === "All") {
        socket.socket.emit("deleteBetsOrders", {
          matchId: id,
          oddsType: oddsType,
          selectionId: null,
          type: type,
          orderIds: ordersToDelete.map((o) => o._id),
        });
      } else if (orderId) {
        socket.socket.emit("deleteBetsOrders", {
          matchId: id,
          oddsType: oddsType,
          selectionId: null,
          type: type,
          orderId: orderId,
        });
      }

      if (type === "All") {
        setFancyOrders([]);
        setFilteredViewMoreData([]);
        setSelectAllForDeletion(false);
      } else if (orderId) {
        setFancyOrders((prev) => prev.filter((o) => o._id !== orderId));
        setFilteredViewMoreData((prev) =>
          prev.filter((o) => o._id !== orderId)
        );
      }
    };

    const handleSelectAllBets = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectAllForDeletion(isChecked);
      setFilteredViewMoreData((prev) =>
        prev.map((bet) => ({ ...bet, isSelected: isChecked }))
      );
    };

    const handleIndividualBetSelect = (betId: string) => {
      setFilteredViewMoreData((prev) => {
        const updatedData = prev.map((bet) =>
          bet._id === betId ? { ...bet, isSelected: !bet.isSelected } : bet
        );

        setSelectAllForDeletion(updatedData.every((bet) => bet.isSelected));
        return updatedData;
      });
    };

    const applyViewMoreFilters = () => {
      let tempOrders = [...fancyOrders];

      if (viewMoreFilters.username) {
        tempOrders = tempOrders.filter((bet) =>
          bet.user.username
            .toLowerCase()
            .includes(viewMoreFilters.username.toLowerCase())
        );
      }
      if (viewMoreFilters.amountMin) {
        tempOrders = tempOrders.filter(
          (bet) =>
            bet.betAmount &&
            bet.betAmount >= parseFloat(viewMoreFilters.amountMin)
        );
      }
      if (viewMoreFilters.amountMax) {
        tempOrders = tempOrders.filter(
          (bet) =>
            bet.betAmount &&
            bet.betAmount <= parseFloat(viewMoreFilters.amountMax)
        );
      }
      if (viewMoreFilters.ipAddress) {
        tempOrders = tempOrders.filter((bet) =>
          bet.user_ip.includes(viewMoreFilters.ipAddress)
        );
      }

      setFilteredViewMoreData(tempOrders);
      setSelectAllForDeletion(false);
    };

    useEffect(() => {
      if (isBookModalOpen === "viewMore") {
        applyViewMoreFilters();
      }
    }, [fancyOrders, isBookModalOpen]);

    return (
      <div className="col-lg-4">
        {isBookModalOpen &&
          (isBookModalOpen === "user" || isBookModalOpen === "book") && (
            <>
              <div
                className="modal fade show exposure-modal modal-one"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="ExposureModalLabel"
                aria-modal="true"
                style={{ display: "block" }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsBookModalOpen(null);
                  }
                }}
              >
                <div className="modal-dialog modal-xl" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      {isBookModalOpen === "user" ? "User Book" : "Book Match"}
                      <br />
                      {fancyOrders.length > 0 && fancyOrders[0]?.match.name}
                      <button
                        type="button"
                        className="modal-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsBookModalOpen(null);
                        }}
                        aria-label="Close"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="accordion-item">
                      <table className="table table-two">
                        {isBookModalOpen !== "book" &&
                          userBook.length > 0 &&
                          (() => {
                            const uniqueRunnersMap = new Map(
                              userBook.flatMap((p) =>
                                Object.values(p.runners).map((q: any) => [
                                  q?.selectionId ?? q?._id,
                                  {
                                    name: q?.name || q?.user?.username,
                                    id: q?._id,
                                  },
                                ])
                              )
                            );
                            const uniqueRunners = [
                              ...uniqueRunnersMap.values(),
                            ];

                            return (
                              <>
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        backgroundColor: "#6c757d",
                                        color: "white",
                                      }}
                                    >
                                      Username
                                    </th>
                                    {uniqueRunners.map((runner, idx) => (
                                      <th
                                        key={idx}
                                        style={{
                                          backgroundColor: "#6c757d",
                                          color: "white",
                                        }}
                                      >
                                        {runner.name}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {userBook.length > 0 ? (
                                    userBook.map((p, i: number) => (
                                      <tr key={i}>
                                        <td>
                                          {p?.username || p?.user?.username}
                                        </td>
                                        {uniqueRunners.map((runner) => {
                                          const matchingRunner: any =
                                            Object.values(p.runners).find(
                                              (r: any) => r._id === runner.id
                                            );

                                          return matchingRunner ? (
                                            <ColorTd
                                              key={runner.id}
                                              amount={matchingRunner?.amount}
                                            />
                                          ) : (
                                            <td key={runner.id}>-</td>
                                          );
                                        })}
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={uniqueRunners.length + 1}>
                                        No book data available.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </>
                            );
                          })()}

                        {isBookModalOpen === "book" && (
                          <>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                  }}
                                >
                                  User Name
                                </th>
                                {userBook.length > 0 &&
                                  Object.values(userBook[0].runners).map(
                                    (p: any, idx: number) => (
                                      <th
                                        key={idx}
                                        style={{
                                          backgroundColor: "#6c757d",
                                          color: "white",
                                        }}
                                      >
                                        {p?.name || p?.user?.username}
                                      </th>
                                    )
                                  )}
                              </tr>
                            </thead>
                            <tbody>
                              {userBook.length > 0 ? (
                                userBook.map((p, i: number) => (
                                  <tr key={i}>
                                    <td>{p?.username || p?.user?.username}</td>
                                    {Object.keys(p.runners).map((key) => {
                                      const runner = p.runners[key];
                                      return (
                                        <ColorTd
                                          key={key}
                                          amount={runner.amount}
                                        />
                                      );
                                    })}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3}>No book data available.</td>
                                </tr>
                              )}
                            </tbody>
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add backdrop overlay */}
              <div
                className="modal-backdrop fade show"
                onClick={() => setIsBookModalOpen(null)}
              ></div>
            </>
          )}
        <ul className="match-Settng-ul">
          <li>
            <div className="dropdown button-dark-yellowdown">
              <button
                className="btn button-dark-yellow"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Bet Lock
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      BetLockApi(String(id));
                    }}
                    data-bs-dismiss="dropdown"
                  >
                    All Deactive
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      BetLockApi(String(id), false);
                    }}
                    data-bs-dismiss="dropdown"
                  >
                    Userwise
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="dropdown button-dark-yellowdown">
              <button
                className="btn button-dark-yellow"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Fancy Lock
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      BetLockApi(String(id), true, true);
                    }}
                    data-bs-dismiss="dropdown"
                  >
                    All Deactive
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      BetLockApi(String(id), false, true);
                    }}
                    data-bs-dismiss="dropdown"
                  >
                    Userwise
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <button
              type="button"
              className="btn button-dark-yellow"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="UserBook"
              onClick={() => setIsBookModalOpen("user")}
            >
              UB
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn button-dark-yellow"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="BookmakerBook"
              onClick={() => setIsBookModalOpen("book")}
            >
              BB
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn button-dark-yellow"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="BookmakerBook"
              onClick={() =>
                user.roles[0] == "owner_admin"
                  ? (setShowMarketSettingsModal((p) => !p),
                    setIsBookModalOpen(null))
                  : Tp("you don't have permission to change the  setting")
              }
            >
              MS
            </button>
            {showMarketSettingsModal && (
              <MarketSettingsModal setshowModal={setShowMarketSettingsModal} />
            )}
          </li>
        </ul>

        <div className="card mt-3">
          <div className="card-body">
            <div
              className="accordion live-match-accodion"
              id="accordionPanelsStayOpenExample"
            >
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseLiveMatch"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseLiveMatch"
                  >
                    Live Match
                    <span>
                      <i className="fas fa-tv"></i>
                      live stream started
                    </span>
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseLiveMatch"
                  className="accordion-collapse collapse"
                >
                  <div className="upper-frame">
                    {keyOK ? (
                      <div id="sub-frame-error">
                        <div className="icon icon-generic"></div>
                        <div id="sub-frame-error-details">
                          <strong>www.google.com</strong> refused to connect.
                        </div>
                      </div>
                    ) : (
                      <iframe
                        _ngcontent-trw-c92=""
                        width="100%"
                        height="240"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={false}
                        title="san francisco unicorns v mi new york"
                        src={`https://leoexch247.com/frame/?channel=${channel}&sportid=${eventId}`}
                      ></iframe>
                    )}
                  </div>
                </div>
              </div>

              {/* View More modal (filters + table) */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseScoreCard"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseScoreCard"
                    onClick={() => setShowScoreCardHtml((p) => !p)}
                  >
                    Score Card
                  </button>
                  {showScoreCardHtml && html && (
                    <div dangerouslySetInnerHTML={{ __html: html }}></div>
                  )}
                </h2>
                <div
                  id="panelsStayOpen-collapseScoreCard"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body p-0"></div>
                </div>
              </div>

              {/* View More Modal */}
              <div className="accordion-item">
                <div className="accordion-button">
                  <span className="dark-button">Matched</span>
                  <button
                    className="button-dark-yellow btn"
                    data-bs-toggle="modal"
                    data-bs-target="#ViewMore-modal"
                    onClick={() => {
                      setIsBookModalOpen("viewMore");
                      setFilteredViewMoreData(
                        fancyOrders.map((bet) => ({
                          ...bet,
                          isSelected: false,
                        }))
                      );
                      setSelectAllForDeletion(false);
                      setViewMoreFilters({
                        username: "",
                        amountMin: "",
                        amountMax: "",
                        ipAddress: "",
                        type: "25",
                      });
                    }}
                  >
                    View More
                  </button>
                </div>

                {isBookModalOpen == "viewMore" && (
                  <div
                    className="modal fade modal-one"
                    id="ViewMore-modal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title me-5"
                            id="ViewMore-modalLabel"
                          >
                            View More Bet
                          </h1>
                          <button
                            type="button"
                            className="modal-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setIsBookModalOpen(null)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <div className="modal-body">
                          {/* filters ... (unchanged) */}
                          <div className="container-fluid">
                            {/* filter UI omitted for brevity; unchanged */}
                            <div className="table-responsive">
                              <table className="table table-two">
                                <thead>
                                  <tr>
                                    <th>
                                      <input
                                        type="checkbox"
                                        checked={selectAllForDeletion}
                                        onChange={handleSelectAllBets}
                                      />
                                    </th>
                                    <th>UserName</th>
                                    <th>Nation</th>
                                    <th>M type</th>
                                    <th>Bet Type</th>
                                    <th>Amount</th>
                                    <th>UserRate</th>
                                    <th>PlaceDate</th>
                                    <th>IP</th>
                                    <th>
                                      ACTION
                                      {selectAllForDeletion && (
                                        <>
                                          <button
                                            type="button"
                                            className="btn btn-danger text-white p-2 me-2"
                                            onClick={() =>
                                              handleDeleteBet(
                                                "delete",
                                                "All",
                                                null
                                              )
                                            }
                                          >
                                            Delete Selected
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-danger text-white p-2"
                                            onClick={() =>
                                              handleDeleteBet(
                                                "void",
                                                "All",
                                                null
                                              )
                                            }
                                          >
                                            Void Selected
                                          </button>
                                        </>
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredViewMoreData.length > 0 ? (
                                    filteredViewMoreData.map((bet) => (
                                      <tr
                                        key={bet._id}
                                        className={`${
                                          bet.orderType === "Back"
                                            ? "black-bg"
                                            : "lay-bg"
                                        }`}
                                      >
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={bet.isSelected}
                                            onChange={() =>
                                              handleIndividualBetSelect(bet._id)
                                            }
                                          />
                                        </td>
                                        <td>{bet.user.username}</td>
                                        {/* NATION: sessionRunner || runnerName */}
                                        <td>{nationOf(bet)}</td>
                                        <td>{bet.oddsType}</td>
                                        <td>{bet.orderType}</td>
                                        <td>{bet.betAmount}</td>
                                        <td>
                                          {bet.rate}/{bet.size}
                                        </td>
                                        <td>{formatDateTime(bet.created)}</td>
                                        <td>{bet.user_ip}</td>
                                        <td>
                                          {bet.isSelected && (
                                            <>
                                              <button
                                                type="button"
                                                className="btn btn-danger text-white p-2 me-2"
                                                onClick={() =>
                                                  handleDeleteBet(
                                                    "delete",
                                                    bet.oddsType || "matchOdds",
                                                    bet._id
                                                  )
                                                }
                                              >
                                                Delete
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-danger text-white p-2"
                                                onClick={() =>
                                                  handleDeleteBet(
                                                    "void",
                                                    bet.oddsType || "matchOdds",
                                                    bet._id
                                                  )
                                                }
                                              >
                                                Void Delete
                                              </button>
                                            </>
                                          )}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={10}>No bets to display.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Matched table */}
                <div className="table-responsive">
                  <table className="table table-two">
                    <thead>
                      <tr>
                        <th>
                          Username <br />
                          [Uplevel] <br />
                        </th>
                        <th>Nation</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>PlaceDate</th>
                        <th>GameType</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fancyOrders.length > 0 ? (
                        fancyOrders.map((bet) => (
                          <tr
                            key={bet._id}
                            className={`${bet.orderType === "Back" ? "black-bg" : "lay-bg"}`}
                          >
                            <ColorTd amount={bet.user.username} />
                            {/* NATION: sessionRunner || runnerName */}
                            <td>{nationOf(bet)}</td>
                            <td>
                              {bet.rate}/{bet.size}
                            </td>
                            <td>{bet.betAmount}</td>
                            <td>{formatDateTime(bet.created)}</td>
                            <td>{bet.oddsType}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>No matched bets available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LiveMatchSideList;
