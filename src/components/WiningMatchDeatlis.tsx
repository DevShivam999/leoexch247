import WiningMatchChild from "./WiningMatchChild";

type WiningMatchT = {
  marketId: string | number;
  market: string;
  runners?: any[];
};

const WiningMatchDetails = ({
  WiningMatch,
  SHOW,
}: {
  WiningMatch: WiningMatchT[];
  SHOW: string;
}) => {
  const filteredMatches = WiningMatch.filter((item) => {
    if (SHOW === "Match") return item.market === "MATCH_ODDS";
    if (SHOW === "Tie") return item.market === "TIED_MATCH";
    if (SHOW === "NotMatch")
      return item.market !== "MATCH_ODDS" && item.market !== "TIED_MATCH";
    return false;
  });

  return (
    <>
      {filteredMatches.map((item) => (
        <WiningMatchChild
          key={item.marketId ?? item.market}
          WiningMatch={item}
        />
      ))}
    </>
  );
};

export default WiningMatchDetails;
