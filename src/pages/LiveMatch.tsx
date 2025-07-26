import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../helper/store";
import CricketMatchDetails from "../components/MatchDetails";
import CricketBookmakerMatchDetails from "../components/CricketBookmakerMatchDeatlis";
import WiningMatchDetails from "../components/WiningMatchDeatlis";
import LiveMatchSideList from "../components/LiveMatchSideList";
import ExposerWorker from "../workers/exposerWorker?worker";
import DOMPurify from "dompurify";
import Loading from "../components/Loading";
import instance from "../services/AxiosInstance";
import { useAppSelector } from "../hook/hook";
import ErrorHandler from "../utils/ErrorHandle";
export const getGameTypeName2 = (gameId: string): string => {
  switch (gameId.toLowerCase()) {
    case "cricket":
      return "1";
    case "tennis":
      return "2";
    case "football":
      return "4";
    case "horse":
      return "7";
    case "greyhound":
      return "4339";
    default:
      return `2378961`;
  }
};
// export const allowedMarkets = [
//   // "Match Odds",
//   // "Half Time",
//   // "Over/Under 1.5 Goals",
//   // "Over/Under 0.5 Goals",
//   // "Winner",
//   // "Set Betting",
//   // "BOOKMAKER",
//   // "MINI BOOKMAKER",
//   // "BM 1 TO 10 OVER",
//   // "Match Odds  Draw No Bet",
//   // "Match Odds DNB",
//   // "Winner (incl. super over)",
//   // "Will there be a tie",
//   // "Tied Match",
//   // "Completed Match",
//   // "Winner",
//   // "To Win The Toss",
//   // "Total Sixes",
//   // "Total Fours",
//   // "Set 1 Winner",
//   // "Set 2 Winner",
//   // "Set 3 Winner",
//   // "Set 4 Winner",
//   // "Set 5 Winner",
//   // "Set 6 Winner",
//   ""
// ];

const LineMatch = () => {
  const { id, matchName } = useParams();
  const location = useLocation();

  const socket = useAppSelector((p: RootState) => p.socket.socket);
  const user = useAppSelector((p: RootState) => p.changeStore);
  const [fancyData, setFancyData] = useState<any | null>(null);
  const [BookMakerData, setBookMakerData] = useState<any[]>([]);
  const [Total, setTotal] = useState<any | null>(null);
  const [html, setHtmlContent] = useState<null | string>(null);
  const [loadingIn, setShowLoading] = useState(true);
  const navigation = useNavigate();
  const [name, setName] = useState({
    name: "",
    created: new Date(),
    channel: 0,
  });
  const dispatch = useDispatch();
  const SportName = async () => {
    try {
      const [{ data }] = await Promise.all([
        instance.get<{
          name: string;
          openDate: string;
          channel: number;
          defaltsetting: any;
        }>(`betting/match?matchId=${id}`)
      ]);
      setName({
        name: data.name,
        created: new Date(data.openDate),
        channel: data.channel,
      });
     
    } catch (err) {
      ErrorHandler({ err, dispatch, navigation, pathname: location.pathname });
    } finally {
      setShowLoading(false);
    }
  };
  useEffect(() => {
    if (user.user == null) {
      navigation("/login");
    }
    document.title = `🟢Live-${matchName}`;

    const userwith = user.user;
    SportName();

    socket.emit("savefancyandbookmaker", { matchId: id });
    socket.emit("connect_user", { userId: userwith.numeric_id });
    socket.emit("joinRoom", {
      matchId: id,
      eventId: getGameTypeName2(matchName || ""),
      numeric_id: userwith.numeric_id,
    });
    socket.emit("rates", {
      matchId: id,
      eventId: getGameTypeName2(matchName || ""),
      numeric_id: userwith.numeric_id,
    });
    socket.emit("summerexposer", {
      matchId: id,
      numeric_id: userwith.numeric_id,
    });

    socket.on("sessionData", (data) => {
      setFancyData(data.data);
    });

    socket.on("bookOddsData", (data) => {
  setBookMakerData((prev: any[]) => {
    const existingIndex = prev.findIndex(
      (market) => market.marketName === data.data.marketName
    );

    const updatedRunners = data.data.runners.map((newRunner: any) => {
      const existingRunner = 
        existingIndex !== -1
          ? prev[existingIndex].runners.find(
              (r: any) => r.selectionId === newRunner.selectionId
            )
          : null;

      return {
        ...newRunner,
        userbet: existingRunner?.userbet || 0,
      };
    });

    const updatedMarket = {
      ...data.data,
      runners: updatedRunners,
    };

    // If market exists, update it
    if (existingIndex !== -1) {
      const newMarkets = [...prev];
      newMarkets[existingIndex] = updatedMarket;
      return newMarkets;
    }

    // Else, add it as a new market
    return [...prev, updatedMarket];
  });
});


    socket.on("matchOddsData", (data) => {
      id == data.matchId &&
        setTotal((prevTotal: any) => {
          const incomingMarket = data.data;
          const currentMarkets = Array.isArray(prevTotal) ? prevTotal : [];

          if (currentMarkets.length === 0) {
            const initialRunners = incomingMarket.runners.map((r: any) => ({
              ...r,
              userbet: 0,
            }));
            return [{ ...incomingMarket, runners: initialRunners }];
          }

          const existingMarketIndex = currentMarkets.findIndex(
            (market: any) => market.marketId === incomingMarket.marketId
          );

          if (existingMarketIndex === -1) {
            const newMarketRunners = incomingMarket.runners.map((r: any) => ({
              ...r,
              userbet: 0,
            }));
            const newState = [
              ...currentMarkets,
              { ...incomingMarket, runners: newMarketRunners },
            ];
            return newState;
          } else {
            const updatedRunners = incomingMarket.runners.map((newR: any) => {
              const prevRunner = currentMarkets[
                existingMarketIndex
              ].runners.find(
                (pr: any) =>
                  pr.name?.toLowerCase().trim() ===
                    newR.name?.toLowerCase().trim() ||
                  pr.selectionId === newR.selectionId
              );
              return {
                ...newR,
                userbet: prevRunner?.userbet ?? newR.userbet,
              };
            });

            const newState = currentMarkets.map((market: any, index: number) =>
              index === existingMarketIndex
                ? { ...incomingMarket, runners: updatedRunners }
                : market
            );

            return newState;
          }
        });
    });

    socket.on("rates", (newData) => {
      if (
        !Total ||
        Total.length === 0 ||
        matchName === "greyhound" ||
        matchName === "horse"
      )
        return;
      //@ts-ignore
      if (newData.length > 0) {
        for (let i = 0; i < newData.length; i++) {
          const element = newData[i];
          setTotal((prevBookMakerData: any) => {
            if (matchName != "greyhound" && matchName != "horse") {
              if (prevBookMakerData != null && prevBookMakerData.length > 0) {
                const updatedMarketData =
                  element.marketId == prevBookMakerData?.marketId &&
                  element.market == prevBookMakerData?.marketId;

                if (!updatedMarketData) {
                  //@ts-ignore
                  return [...prevBookMakerData, element];
                } else if (updatedMarketData)
                  return prevBookMakerData.map((market: any) =>
                    element.marketId === market?.marketId &&
                    element.market == market?.marketId
                      ? element
                      : market
                  );
                else {
                  return [...[prevBookMakerData], element];
                }
              } else {
                return prevBookMakerData;
              }
            } else {
              return prevBookMakerData;
            }
          });
        }
      }
    });

    socket.on("scorecardData", (data) => {
      const htmlString =
        typeof data === "object" && data.scoreData
          ? data.scoreData
          : typeof data === "string"
            ? data
            : "";

      const cleanHtml = DOMPurify.sanitize(htmlString, {
        ADD_TAGS: ["style"],
        ADD_ATTR: ["style"],
      });

      setHtmlContent(cleanHtml);
    });
    const interval = setInterval(() => {
      socket.emit("summerexposer", {
        matchId: id,
        eventId: getGameTypeName2(matchName || ""),
        numeric_id: userwith.numeric_id,
      });
    }, 1000);

    return () => {
      setShowLoading(true);
      setFancyData(null);
      setTotal([]);
      setBookMakerData([]);
      clearInterval(interval);
      socket.emit("leaveRoom", { matchId: id });
    };
  }, [socket, id]);
  // useEffect(() => {
  //   // socket.on("summerexposer", (data) => {
  //   //   let updatedBookMakerData = BookMakerData;

  //   //   //    if (Total) {
  //   //   for (let i = 0; i < data.length; i++) {
  //   //     //     const element = newData[i];
  //   //     //     const updatedTotalMarkets = Total.map((prevMarket: any) => {
  //   //     //       // if (element.marketId != prevMarket.marketId) return prevMarket;

  //   //     //       const updatedRunners = prevMarket.runners.map((prevRunner: any) => {

  //   //     //         const newRunner = element.runners.find(
  //   //     //           (r: any) =>
  //   //     //             r.selectionId === prevRunner.selectionId
  //   //     //         );
  //   //     //         return {
  //   //     //           ...prevRunner,
  //   //     //           userbet: newRunner?.amount??prevRunner.userbet,
  //   //     //         };
  //   //     //       });

  //   //     //       return { ...prevMarket, runners: updatedRunners };
  //   //     //     });

  //   //     //     // if (
  //   //     //     //   !updatedTotalMarkets.some(
  //   //     //     //     (m: any) => m.marketId === element.marketId,
  //   //     //     //   )
  //   //     //     // ) {
  //   //     //     //   updatedTotalMarkets.push({
  //   //     //     //     ...element,
  //   //     //     //     runners: element.runners.map((r: any) => {
  //   //     //     //        const newRunner = element.runners.find(
  //   //     //     //       (r: any) =>
  //   //     //     //         r.selectionId === r.selectionId
  //   //     //     //     );

  //   //     //     //     return {
  //   //     //     //       ...r,
  //   //     //     //       userbet: newRunner?.amount ?? r.userbet,
  //   //     //     //     };
  //   //     //     //     }),
  //   //     //     //   });
  //   //     //     // }

  //   //     //      console.log("updatedTotalMarkets",updatedTotalMarkets);
  //   //     //   }
  //   //     // }
  //   //     if (BookMakerData && data.length > 0) {
  //   //       const element = data.find(
  //   //         (el: any) => el.marketId === BookMakerData.marketId
  //   //       );

  //   //       if (element) {
  //   //         const updatedRunners = BookMakerData.runners.map(
  //   //           (prevRunner: any) => {
  //   //             const newRunner = element.runners.find(
  //   //               (r: any) => r.name === prevRunner.runner
  //   //             );
  //   //             return {
  //   //               ...prevRunner,
  //   //               userbet: newRunner?.amount ?? prevRunner.userbet,
  //   //             };
  //   //           }
  //   //         );

  //   //         updatedBookMakerData = {
  //   //           ...BookMakerData,
  //   //           runners: updatedRunners,
  //   //         };
  //   //       }
  //   //     }

  //   //     // // if (fancyData != null) {
  //   //     // //   for (let i = 0; i < newData.length; i++) {
  //   //     // //     const element = newData[i];
  //   //     // //     //@ts-ignore
  //   //     // //     setFancyData((prevBookMakerData) => {
  //   //     // //       const updatedMarketData = element.find(
  //   //     // //         //@ts-ignore
  //   //     // //         (data) => data.marketId === prevBookMakerData.marketId
  //   //     // //       );

  //   //     // //       if (updatedMarketData) {
  //   //     // //         const updatedRunners = prevBookMakerData.runners.map(
  //   //     // //           //@ts-ignore
  //   //     // //           (prevRunner) => {
  //   //     // //             const newRunnerData = updatedMarketData.runners.find(
  //   //     // //               //@ts-ignore
  //   //     // //               (newR) =>
  //   //     // //                 newR.name.toString().toLowerCase().trim() ==
  //   //     // //                 prevRunner.RunnerName.toString().toLowerCase().trim()
  //   //     // //             );
  //   //     // //             if (newRunnerData) {
  //   //     // //               return { ...prevRunner, userbet: newRunnerData.amount };
  //   //     // //             }
  //   //     // //             return prevRunner;
  //   //     // //           }
  //   //     // //         );

  //   //     // //         return { ...prevBookMakerData, runners: updatedRunners };
  //   //     // //       }
  //   //     // //       return prevBookMakerData;
  //   //     // //     });
  //   //     // //   }
  //   //   }
  //   //   if (updatedBookMakerData) {
  //   //     setBookMakerData(updatedBookMakerData);
  //   //     console.log("====================================");
  //   //     console.log(updatedBookMakerData);
  //   //     console.log("====================================");
  //   //     updatedBookMakerData = null;
  //   //   }
  //   // });
  // }, [BookMakerData, socket, id]);

  useEffect(() => {
    const exposerWorker = new ExposerWorker();

    socket.on("summerexposer", (newData) => {
      exposerWorker.postMessage({
        data: newData,
        total: Total,
        bookMakerData: BookMakerData,
      });

      exposerWorker.onmessage = (e) => {
        const { total, bookMakerData } = e.data;
        
        setTotal(total);
        bookMakerData != null && setBookMakerData(bookMakerData);
      };

      exposerWorker.onerror = (err) => {
        console.error("Worker Error:", err);
      };
    });

    return () => {
      exposerWorker.terminate();
    };
  }, [socket, id, Total,BookMakerData]);

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-8">
          {" "}
          <h2
            className="game-heading d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <span>{name.name}</span>
            <span>
              {name.created.toDateString()} {name.created.toLocaleTimeString()}
            </span>
          </h2>
          {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"Match"} WiningMatch={Total} />
          )}
          {BookMakerData.length!=0 && (
            <CricketBookmakerMatchDetails
              BookMakerData={BookMakerData}
            />
          )}
          {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"NotMatch"} WiningMatch={Total} />
          )}
          {fancyData && fancyData.length > 0 && (
            <CricketMatchDetails id={id ?? ""} data={fancyData} />
          )}
         {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"Tie"}  WiningMatch={Total} />
          )}
        </div>
        {BookMakerData ||
        (Total && Total.length > 0) ||
        (fancyData && fancyData.length > 0) ? (
          <LiveMatchSideList html={html || ""} channel={name.channel} />
        ) : (
          <>{loadingIn ? <Loading /> : "no have any  active market"}</>
        )}
      </div>
    </div>
  );
};

export default LineMatch;
