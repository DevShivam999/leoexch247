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
  const [Total, setTotal] = useState<any[]>([]);
  const [html, setHtmlContent] = useState<null | string>(null);
  const [loadingIn, setShowLoading] = useState(true);
  const navigation = useNavigate();
  const [name, setName] = useState({
    name: "",
    created: new Date(),
    channel: 0,
    eventId: 0,
  });
  const dispatch = useDispatch();

  const SportName = async () => {
    const mId = String(id ?? "");
    try {
      const matchRes = await instance.get("/betting/match", {
        params: { matchId: mId, _: Date.now() },
      });

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
      const tvChannel =
        data?.eventId === 4
          ? (diamondIdNum || matchIdNum)
          : matchIdNum;

      setName({
        name: data?.name ?? "",
        created: new Date(data?.openDate || data?.opendate || Date.now()),
        channel: Number.isFinite(tvChannel) ? tvChannel : 0,
        eventId: data?.eventId ?? 0,
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

    socket.emit("savefancyandbookmaker", { matchId: id });
    socket.emit("connect_user", { userId: userwith.numeric_id });
    socket.emit("joinRoom", {
      matchId: id,
      eventId: getGameTypeName2(matchName || ""),
      numeric_id: userwith.numeric_id,
    });

    // Emit exposer immediately + every 5s
    const sendExposer = () =>
      socket.emit("summerexposer", {
        matchId: id,
        numeric_id: userwith.numeric_id,
      });
    sendExposer();
    const exposerInterval = setInterval(sendExposer, 5000);

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
                  (r: any) =>
                    String(r.selectionId) === String(newRunner.selectionId)
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

    // Odds update
    socket.on("matchOddsData", (data) => {
      if (id != data.matchId) return;

      setTotal((prevTotal: any[]) => {
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
          (market: any) =>
            String(market.marketId) === String(incomingMarket.marketId)
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
            const prevRunner = currentMarkets[existingMarketIndex].runners.find(
              (pr: any) =>
                String(pr.selectionId) === String(newR.selectionId)
            );
            return {
              ...newR,
              userbet: prevRunner?.userbet ?? 0,
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

    // Exposer update
 socket.on("summerexposer", (data) => {
  if (!data || data.length === 0) return;

  const exposerMarkets = Array.isArray(data) ? data : [data];

  // 1) Update Total (MATCH_ODDS etc.)
  setTotal((prevMarkets: any[]) => {
    if (!prevMarkets || prevMarkets.length === 0) return prevMarkets;

    return prevMarkets.map((market) => {
      const exposerMarket = exposerMarkets.find(
        (em: any) => String(em.marketId) === String(market.marketId)
      );
      if (!exposerMarket) return market;

      const updatedRunners = market.runners.map((runner: any) => {
        const exposerRunner = exposerMarket.runners.find(
          (er: any) => String(er.selectionId) === String(runner.selectionId)
        );
        return {
          ...runner,
          userbet:
            exposerRunner != null
              ? exposerRunner.amount
              : runner.userbet ?? 0,
        };
      });

      return {
        ...market,
        runners: updatedRunners,
      };
    });
  });

  // 2) Update BookMakerData
  setBookMakerData((prevMarkets: any[]) => {
    if (!prevMarkets || prevMarkets.length === 0) return prevMarkets;

    return prevMarkets.map((market) => {
      const exposerMarket = exposerMarkets.find(
        (em: any) => String(em.marketId) === String(market.marketId)
      );
      if (!exposerMarket) return market;

      const updatedRunners = market.runners.map((runner: any) => {
        const exposerRunner = exposerMarket.runners.find(
          (er: any) => String(er.selectionId) === String(runner.selectionId)
        );
        return {
          ...runner,
          userbet:
            exposerRunner != null
              ? exposerRunner.amount
              : runner.userbet ?? 0,
        };
      });

      return {
        ...market,
        runners: updatedRunners,
      };
    });
  });
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

    return () => {
      setShowLoading(true);
      setFancyData(null);
      setTotal([]);
      setBookMakerData([]);
      clearInterval(exposerInterval);
      socket.emit("leaveRoom", { matchId: id });
    };
  }, [socket, id]);

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
            channel={name.channel}
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
