import type { CurrentBet } from "../types/vite-env";

const UserProfileBetHistory = ({
  betHistoryData,
  userData,
}: {
  betHistoryData: {
    results: CurrentBet[];
    total: number;
    totallist: any;
  };
  userData: string | null;
}) => {
  return (
    <tbody>
      {betHistoryData?.results?.length === 0 ? (
        <tr>
          <td colSpan={10} className="text-center">
            No Record Found
          </td>
        </tr>
      ) : (
        betHistoryData?.results?.map((bet) => (
          <tr
            key={bet._id}
            className={bet.orderType === "Lay" ? "lay-bg" : "black-bg"}
          >
            <td>
              {bet.match?.name.includes("Cricket") ? "Cricket" : bet.oddsType}
            </td>

            <td>{bet.match?.name || bet.runnerName}</td>
            <td>{userData}</td>
            <td>{bet.runnerName != "" ? bet.runnerName : bet.sessionRunner}</td>
            <td>
              {bet.orderType} ({bet.oddsType})
            </td>

            <td>{`${bet.rate}/${bet.size}`}</td>
            <td>{bet.betAmount}</td>
            <td>{new Date(bet.created).toLocaleTimeString()}</td>

            <td>{new Date(bet.created).toLocaleDateString()}</td>

            <td
              className={
                bet.status === "Winner" ? "text-success" : "text-danger"
              }
            >
              {bet.status === "Winner"
                ? bet.teamSession.lossAmount
                : -bet.betAmount}
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};

export default UserProfileBetHistory;
