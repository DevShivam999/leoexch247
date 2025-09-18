import WiningMatchChild from "./WiningMatchChild";

type WiningMatchT = {
  marketId: string | number;
  marketName: string;   // ✅ consistent naming
  runners?: any[];
  min?: number | string;
  maxb?: number | string;
  max?: number | string;
};

const WiningMatchDetails = ({
  WiningMatch,
  SHOW,
}: {
  WiningMatch: WiningMatchT[];
  SHOW: "Match" | "Tie" | "NotMatch";  // ✅ stricter typing
}) => {
  const filteredMatches = WiningMatch.filter((item) => {
    switch (SHOW) {
      case "Match":
        return item.marketName === "MATCH_ODDS";
      case "Tie":
        return item.marketName === "TIED_MATCH";
      case "NotMatch":
        return (
          item.marketName !== "MATCH_ODDS" &&
          item.marketName !== "TIED_MATCH"
        );
      default:
        return false;
    }
  });

  if (filteredMatches.length === 0) return null;

  return (
    <>
      {filteredMatches.map((item) => (
        <WiningMatchChild
          key={String(item.marketId) || item.marketName}
          WiningMatch={item}
        />
      ))}
    </>
  );
};

export default WiningMatchDetails;
