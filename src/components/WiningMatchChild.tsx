import type { RootState } from "../helper/store";
import { useAppSelector } from "../hook/hook";
import formatNumberShort from "../utils/NumberFormate";

type PriceSize = { price?: number; size?: number };

type Runner = {
  selectionId: string | number;
  name: string;
  userbet?: number;
  status?: string;

  // Primary socket keys
  min?: number | string;
  maxb?: number | string;

  // Aliases
  max?: number | string;
  minb?: number | string;
  minBet?: number | string;
  maxBet?: number | string;
  stakeMin?: number | string;
  stakeMax?: number | string;

  ex?: {
    availableToBack?: PriceSize[];
    availableToLay?: PriceSize[];
  };
};

type WiningMatchT = {
  marketId: string | number;
  marketName: string; // ✅ consistent now
  runners?: Runner[];
  min?: number | string;
  maxb?: number | string;
  max?: number | string;
};

type MarketLimit = { minBet?: number; maxBet?: number };

const numOrUndef = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const firstFromRunners = (runners: Runner[] | undefined, pick: (r: Runner) => any) => {
  if (!Array.isArray(runners)) return undefined;
  for (const r of runners) {
    const val = numOrUndef(pick(r));
    if (val !== undefined) return val;
  }
  return undefined;
};

const WiningMatchChild = ({ WiningMatch }: { WiningMatch: WiningMatchT }) => {
  const { MatchOdds } = useAppSelector((p: RootState) => p.MatchOddsBetDataStore);

  // get store limits
  const getStoreLimits = (): MarketLimit => {
    try {
      const anyStore = MatchOdds as any;
      if (anyStore?.get && typeof anyStore.get === "function") {
        return (anyStore.get(WiningMatch?.marketId) ?? {}) as MarketLimit;
      }
      return (anyStore?.[WiningMatch?.marketId as any] ?? {}) as MarketLimit;
    } catch {
      return {};
    }
  };

  const storeLimits = getStoreLimits();
  const storeMin = numOrUndef(storeLimits.minBet);
  const storeMax = numOrUndef(storeLimits.maxBet);

  const marketMin = numOrUndef(WiningMatch?.min);
  const marketMax = numOrUndef(WiningMatch?.maxb ?? WiningMatch?.max);

  const runnerMin =
    firstFromRunners(
      WiningMatch?.runners,
      (r) => r?.min ?? r?.minb ?? r?.minBet ?? r?.stakeMin
    ) ?? undefined;

  const runnerMax =
    firstFromRunners(
      WiningMatch?.runners,
      (r) => r?.maxb ?? r?.max ?? r?.maxBet ?? r?.stakeMax
    ) ?? undefined;

  const finalMin = marketMin ?? runnerMin ?? storeMin;
  const finalMax = marketMax ?? runnerMax ?? storeMax;

  const headerText =
    finalMin !== undefined && finalMax !== undefined
      ? `Min:${finalMin}, Max:${formatNumberShort(finalMax)}`
      : finalMax !== undefined
      ? `Max:${formatNumberShort(finalMax)}`
      : finalMin !== undefined
      ? `Min:${finalMin}`
      : null;

  const priceOrDash = (v?: number) =>
    v == null || Number(v) === 0 ? "-" : String(v);
  const sizeOrDash = (v?: number) =>
    v == null || Number(v) === 0 ? "-" : String(v);

  return (
    <div
      className="match-market-2"
      key={String(WiningMatch?.marketId)}
    >
      {/* ✅ use marketName instead of market */}
      <div className="market-name">{WiningMatch?.marketName}</div>

      <div className="row align-items-center m-0">
        <div className="col-7 team-name-detalis">
          {headerText && <h3 className="match-minmax">{headerText}</h3>}
        </div>
        <div className="col-5 row justify-content-center m-0 p-0">
          <div className="col-2 back lay-back-box">
            <span className="odds-black-lay">Back</span>
          </div>
          <div className="col-2 lay lay-back-box">
            <span className="odds-black-lay">Lay</span>
          </div>
        </div>
      </div>

      {WiningMatch?.runners &&
        WiningMatch.runners.map((p: Runner) => {
          const atb = p?.ex?.availableToBack ?? [];
          const atl = p?.ex?.availableToLay ?? [];

          return (
            <div
              className="row border-top-gray market-odds-row m-0"
              key={`${String(WiningMatch?.marketId)}-${String(p.selectionId)}`}
            >
              <div className="col-7 team-name-detalis">
                <a className="team-name">{p.name}</a>
<div
  style={{
    fontWeight: "bold",
    color:
      typeof p.userbet === "number"
        ? p.userbet > 0
          ? "green"
          : p.userbet < 0
          ? "red"
          : "black"
        : "black",
  }}
>
  {typeof p.userbet === "number" && !isNaN(p.userbet)
    ? p.userbet.toFixed(2)
    : "-"}   {/* ✅ now "-" instead of 0.00 */}
</div>

              </div>

              <div
                className="col-5 row p-0 m-0"
                style={{ position: "relative" }}
              >
                {(atb.length > 0 || atl.length > 0) ? (
                  <>
                    <div className="col-2 back2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atb[2]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atb[2]?.size)}</span>
                    </div>
                    <div className="col-2 back2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atb[1]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atb[1]?.size)}</span>
                    </div>
                    <div className="col-2 back2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atb[0]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atb[0]?.size)}</span>
                    </div>

                    <div className="col-2 lay2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atl[0]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atl[0]?.size)}</span>
                    </div>
                    <div className="col-2 lay2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atl[1]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atl[1]?.size)}</span>
                    </div>
                    <div className="col-2 lay2 odds-box-1">
                      <span className="odds-value">{priceOrDash(atl[2]?.price)}</span>
                      <span className="truncate-valus">{sizeOrDash(atl[2]?.size)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div className="col-2 odds-box-1" key={idx}>
                        <span className="odds-value">-</span>
                        <span className="truncate-valus">-</span>
                      </div>
                    ))}
                  </>
                )}

                {p?.status && p.status.toUpperCase() !== "ACTIVE" && (
                  <div
                    className="col-12 suspended"
                    style={{
                      position: "absolute",
                      backgroundColor: "rgb(0 0 0 / 65%)",
                      height: "100%",
                      justifyContent: "center",
                      color: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {p.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default WiningMatchChild;
