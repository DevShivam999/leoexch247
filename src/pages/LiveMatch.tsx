import { useEffect, useRef, useState, useCallback } from "react";
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
      return "4";
    case "tennis":
      return "1";
    case "football":
      return "2";
    case "horse":
      return "7";
    case "greyhound":
      return "4339";
    default:
      return "2378961";
  }
};

type Runner = { selectionId: string | number; userbet?: number; [k: string]: any };
type Market = {
  marketId: string | number;
  marketName: string;
  runners: Runner[];
  [k: string]: any;
};

const LineMatch = () => {
  const { id, matchName } = useParams();
  const location = useLocation();

  const socket = useAppSelector((p: RootState) => p.socket.socket);
  const userState = useAppSelector((p: RootState) => p.changeStore);

  const [fancyData, setFancyData] = useState<any[] | null>(null);
  const [BookMakerData, setBookMakerData] = useState<Market[]>([]);
  const [Total, setTotal] = useState<Market[]>([]);
  const [html, setHtmlContent] = useState<string | null>(null);
  const [loadingIn, setShowLoading] = useState(true);

  const navigation = useNavigate();
  const [name, setName] = useState({
    name: "",
    created: new Date(),
    channel: 0,
    eventId: 0,
  });

  const dispatch = useDispatch();

  // ---- lifecycle guards
  const isAliveRef = useRef(true);
  const latestMatchIdRef = useRef<string>("");
  const activeMatchIdRef = useRef<string>(""); // 🚨 ensure handlers only update current match
  const exposerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMatchId = String(id ?? "");

  // Reset when match changes
  useEffect(() => {
    setName({
      name: matchName || "",
      created: new Date(),
      channel: 0,
      eventId: 0,
    });
    setFancyData(null);
    setBookMakerData([]);
    setTotal([]);
    setHtmlContent(null);
    setShowLoading(true);
  }, [currentMatchId, matchName]);

  const SportName = useCallback(async () => {
    const mId = String(id ?? "");
    latestMatchIdRef.current = mId;

    try {
      const matchRes = await instance.get("/betting/match", {
        params: { matchId: mId, _: Date.now() },
      });

      if (!isAliveRef.current || latestMatchIdRef.current !== mId) return;

      const data = matchRes.data as {
        name: string;
        openDate?: string;
        opendate?: string;
        matchId: number | string;
        eventId: number;
        diamond_id?: number | string;
      };

      const matchIdNum = Number(data?.matchId);
      const diamondIdNum = Number(data?.diamond_id);
      const tvChannel = data?.eventId === 4 ? (diamondIdNum || matchIdNum) : matchIdNum;

      setName({
        name: data?.name ?? "",
        created: new Date(data?.openDate || data?.opendate || Date.now()),
        channel: Number.isFinite(tvChannel) ? tvChannel : 0,
        eventId: data?.eventId ?? 0,
      });
    } catch (err) {
      if (!isAliveRef.current) return;
      ErrorHandler({ err, dispatch, navigation, pathname: location.pathname });
    } finally {
      if (isAliveRef.current) setShowLoading(false);
    }
  }, [id, dispatch, navigation, location.pathname]);

  useEffect(() => {
    isAliveRef.current = true;
    const prevMatchId = activeMatchIdRef.current;
    activeMatchIdRef.current = currentMatchId;

    if (!userState.user) {
      navigation("/login");
      return;
    }

    document.title = `🟢Live-${matchName}`;

    if (!socket || !currentMatchId) return;

    // leave only previous match room
    if (prevMatchId && prevMatchId !== currentMatchId) {
      socket.emit("leaveRoom", { matchId: prevMatchId });
    }

    const userwith = userState.user;

    // join new room
    socket.emit("savefancyandbookmaker", { matchId: currentMatchId });
    socket.emit("connect_user", { userId: userwith.numeric_id });
    socket.emit("joinRoom", {
      matchId: currentMatchId,
      eventId: getGameTypeName2(matchName || ""),
      numeric_id: userwith.numeric_id,
    });

    // exposer loop
    if (exposerIntervalRef.current) clearInterval(exposerIntervalRef.current);
    const sendExposer = () =>
      socket.emit("summerexposer", {
        matchId: currentMatchId,
        numeric_id: userwith.numeric_id,
      });
    sendExposer();
    exposerIntervalRef.current = setInterval(sendExposer, 5000);

    // --- handlers with match guard ---
    const onSessionData = (data: any) => {
      if (String(data?.matchId) !== activeMatchIdRef.current) return;
      setFancyData(data?.data || []);
    };

    const onBookOddsData = (data: any) => {
      if (String(data?.matchId) !== activeMatchIdRef.current) return;
      const incoming = data?.data;
      if (!incoming) return;

      setBookMakerData((prev) => {
        const existingIndex = prev.findIndex(
          (m) => String(m.marketName) === String(incoming.marketName)
        );

        const updatedRunners = (incoming.runners || []).map((newRunner: any) => {
          const existingRunner =
            existingIndex !== -1
              ? prev[existingIndex].runners.find(
                  (r: any) => String(r.selectionId) === String(newRunner.selectionId)
                )
              : null;

          return { ...newRunner, userbet: existingRunner?.userbet || 0 };
        });

        const updatedMarket: Market = { ...incoming, runners: updatedRunners };

        if (existingIndex !== -1) {
          const next = [...prev];
          next[existingIndex] = updatedMarket;
          return next;
        }
        return [...prev, updatedMarket];
      });
    };

    const onMatchOddsData = (data: any) => {
      if (String(data?.matchId) !== activeMatchIdRef.current) return;
      setTotal((prevTotal) => {
        const incomingMarket: Market = data?.data;
        const currentMarkets = Array.isArray(prevTotal) ? prevTotal : [];

        if (!incomingMarket) return currentMarkets;

        if (currentMarkets.length === 0) {
          const initialRunners = (incomingMarket.runners || []).map((r: any) => ({
            ...r,
            userbet: 0,
          }));
          return [{ ...incomingMarket, runners: initialRunners }];
        }

        const existingMarketIndex = currentMarkets.findIndex(
          (m) => String(m.marketId) === String(incomingMarket.marketId)
        );

        if (existingMarketIndex === -1) {
          const newMarketRunners = (incomingMarket.runners || []).map((r: any) => ({
            ...r,
            userbet: 0,
          }));
          return [...currentMarkets, { ...incomingMarket, runners: newMarketRunners }];
        } else {
          const updatedRunners = (incomingMarket.runners || []).map((newR: any) => {
            const prevRunner = currentMarkets[existingMarketIndex].runners.find(
              (pr: any) => String(pr.selectionId) === String(newR.selectionId)
            );
            return { ...newR, userbet: prevRunner?.userbet ?? 0 };
          });

          const next = currentMarkets.map((m, i) =>
            i === existingMarketIndex ? { ...incomingMarket, runners: updatedRunners } : m
          );
          return next;
        }
      });
    };

const onSummerExposer = (data: any) => {
  if (!data || (Array.isArray(data) && data.length === 0)) return;

  const exposerMarkets: any[] = Array.isArray(data) ? data : [data];

  // ---- update Match Odds / Total
  setTotal((prevMarkets) =>
    prevMarkets.map((market) => {
      const exposerMarket = exposerMarkets.find(
        (em) => String(em.marketId) === String(market.marketId)
      );
      if (!exposerMarket) return market;

      const updatedRunners = market.runners.map((runner: any) => {
        const exposerRunner = (exposerMarket.runners || []).find(
          (er: any) => String(er.selectionId) === String(runner.selectionId)
        );

        if (exposerRunner) {
          return { ...runner, userbet: exposerRunner.amount };
        }
        return runner; // don’t overwrite with 0
      });

      return { ...market, runners: updatedRunners };
    })
  );

  // ---- update Bookmaker
  setBookMakerData((prevMarkets) =>
    prevMarkets.map((market) => {
      const exposerMarket = exposerMarkets.find(
        (em) => String(em.marketId) === String(market.marketId)
      );
      if (!exposerMarket) return market;

      const updatedRunners = market.runners.map((runner: any) => {
        const exposerRunner = (exposerMarket.runners || []).find(
          (er: any) => String(er.selectionId) === String(runner.selectionId)
        );

        if (exposerRunner) {
          return { ...runner, userbet: exposerRunner.amount };
        }
        return runner;
      });

      return { ...market, runners: updatedRunners };
    })
  );
};



    const onScorecardData = (data: any) => {
      if (String(data?.matchId) !== activeMatchIdRef.current) return;

      const htmlString =
        typeof data === "object" && data?.scoreData
          ? data.scoreData
          : typeof data === "string"
          ? data
          : "";

      const cleanHtml = DOMPurify.sanitize(htmlString, {
        ADD_TAGS: ["style"],
        ADD_ATTR: ["style"],
      });

      setHtmlContent(cleanHtml);
    };

    // attach
    socket.on("sessionData", onSessionData);
    socket.on("bookOddsData", onBookOddsData);
    socket.on("matchOddsData", onMatchOddsData);
    socket.on("summerexposer", onSummerExposer);
    socket.on("scorecardData", onScorecardData);

    SportName();

    return () => {
      isAliveRef.current = false;
      if (exposerIntervalRef.current) {
        clearInterval(exposerIntervalRef.current);
        exposerIntervalRef.current = null;
      }
      socket.off("sessionData", onSessionData);
      socket.off("bookOddsData", onBookOddsData);
      socket.off("matchOddsData", onMatchOddsData);
      socket.off("summerexposer", onSummerExposer);
      socket.off("scorecardData", onScorecardData);
    };
  }, [socket, currentMatchId, matchName, userState.user, SportName]);

  const scoreUrl =
    name.eventId && id
      ? `https://leoexch247.com/score?eventid=${String(id)}&sportid=${name.eventId}`
      : "";

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-8">
          <h2 className="game-heading d-flex " style={{ justifyContent: "space-between" }}>
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

          {Total.length > 0 && <WiningMatchDetails SHOW="Match" WiningMatch={Total} />}
          {BookMakerData.length > 0 && <CricketBookmakerMatchDetails BookMakerData={BookMakerData} />}
          {Total.length > 0 && <WiningMatchDetails SHOW="NotMatch" WiningMatch={Total} />}
          {fancyData && fancyData.length > 0 && <CricketMatchDetails id={id ?? ""} data={fancyData} />}
          {Total.length > 0 && <WiningMatchDetails SHOW="Tie" WiningMatch={Total} />}
        </div>

        {BookMakerData.length > 0 || Total.length > 0 || (fancyData && fancyData.length > 0) ? (
          <LiveMatchSideList html={html || ""} channel={name.channel} eventId={name.eventId} />
        ) : (
          <>{loadingIn ? <Loading /> : "no have any  active market"}</>
        )}
      </div>
    </div>
  );
};

export default LineMatch;
