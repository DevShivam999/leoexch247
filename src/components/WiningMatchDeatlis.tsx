import WiningMatchChild from "./WiningMatchChild";

const WiningMatchDetails = ({
  WiningMatch,
  SHOW,
}: {
  WiningMatch: any[];
  SHOW: string;
}) => {
  const filteredMatches = WiningMatch.filter((item: any) => {
    if (SHOW === "Match") return item.market === "MATCH_ODDS";
    if (SHOW === "Tie") return item.market === "TIED_MATCH";
    if (SHOW === "NotMatch")
      return item.market !== "MATCH_ODDS" && item.market !== "TIED_MATCH";
    return false;
  });

  return (
    <>
      {filteredMatches.map((item: any, index: number) => (
        <WiningMatchChild key={`${item.market}-${index}`} WiningMatch={item} />
      ))}
    </>
  );
};

export default WiningMatchDetails;
