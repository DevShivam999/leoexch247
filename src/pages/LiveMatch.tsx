import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../helper/store";
import CricketMatchDetails from "../components/MatchDetails";
import CricketBookmakerMatchDetails from "../components/CricketBookmakerMatchDeatlis";
import WiningMatchDetails from "../components/WiningMatchDeatlis";
import LiveMatchSideList from "../components/LiveMatchSideList";

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
    channel: 0,     // <- this is the TV channel id (diamond_id for eventId=4, else matchId)
    eventId: 0,
  });
  const dispatch = useDispatch();

  const SportName = async () => {
    const mId = String(id ?? "");
    try {
      // 1) fetch match meta
      const matchRes = await instance.get("/betting/match", {
        params: { matchId: mId, _: Date.now() },
      });

      // (optional) related markets
      await instance.get("/user/getMatchRelatedMarket", {
        params: { matchId: mId, _: Date.now() },
      });

      const data = matchRes.data as {
        name: string;
        openDate?: string;    // sometimes camelCase
        opendate?: string;    // sometimes lowercase
        channel?: number;
        defaltsetting?: any;
        blockStatus?: any;
        matchId: number | string;
        eventId: number;
        diamond_id?: number | string;
      };

      // TV channel id: eventId===4 -> diamond_id || matchId; else matchId
      const matchIdNum = Number(data?.matchId);
      const diamondIdNum = Number(data?.diamond_id);
      const tvChannel =
        data?.eventId === 4
          ? (diamondIdNum || matchIdNum) // if diamond_id missing/0 -> fallback to matchId
          : matchIdNum;

      setName({
        name: data?.name ?? "",
        created: new Date(data?.openDate || data?.opendate || Date.now()),
        channel: Number.isFinite(tvChannel) ? tvChannel : 0,
        eventId: data?.eventId ?? 0,
      });

      // ...rest mapping code as you had...
    } catch (err) {
      // fallback fetch for debugging visibility
      try {
        const url = new URL("/betting/match", window.location.origin);
        url.searchParams.set("matchId", String(id ?? ""));
        url.searchParams.set("_", String(Date.now()));
        await fetch(url.toString(), { credentials: "include" });
      } catch {}

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

        if (existingIndex !== -1) {
          const newMarkets = [...prev];
          newMarkets[existingIndex] = updatedMarket;
          return newMarkets;
        }
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
            return [
              ...currentMarkets,
              { ...incomingMarket, runners: newMarketRunners },
            ];
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

    SportName();

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
        numeric_id: user.user.numeric_id,
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

  // SCORE iframe: ALWAYS matchId (route param)
  const scoreUrl =
    name.eventId && id
      ? `https://leoexch247.com/score?eventid=${id}&sportid=${name.eventId}`
      : "";

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-8">
          <h2
            className="game-heading d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <span>{name.name}</span>
            <span>
              {name.created.toDateString()} {name.created.toLocaleTimeString()}
            </span>
          </h2>

          {scoreUrl && (
            <div className="card mb-3">
              <div className="card-body p-0">
                <iframe
                  width="100%"
                  height={name?.eventId === 4 ? 200 : 297}
                  frameBorder={0}
                  title="Scorecard"
                  src={scoreUrl}
                  allow="fullscreen"
                />
              </div>
            </div>
          )}

          {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"Match"} WiningMatch={Total} />
          )}
          {BookMakerData.length != 0 && (
            <CricketBookmakerMatchDetails BookMakerData={BookMakerData} />
          )}
          {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"NotMatch"} WiningMatch={Total} />
          )}
          {fancyData && fancyData.length > 0 && (
            <CricketMatchDetails id={id ?? ""} data={fancyData} />
          )}
          {Total && Total.length > 0 && (
            <WiningMatchDetails SHOW={"Tie"} WiningMatch={Total} />
          )}
        </div>

        {BookMakerData ||
        (Total && Total.length > 0) ||
        (fancyData && fancyData.length > 0) ? (
          <LiveMatchSideList
            html={html || ""}
            channel={name.channel}      // <- TV channel id (diamond_id for eventId=4; else matchId)
            eventId={name.eventId}
          />
        ) : (
          <>{loadingIn ? <Loading /> : "no have any  active market"}</>
        )}
      </div>
    </div>
  );
};

export default LineMatch;
