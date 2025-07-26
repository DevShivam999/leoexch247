import type { CurrentBet } from "../types/vite-env";
import ColorTd from "./ColorTd";

const UserCasino = ({
  casino,
  userData,
}: {
  casino: {
    results: CurrentBet[];
    total: number;
    totallist: any;
  } | null;
  userData: string;
}) => {
  return (
    <tbody>
      {casino?.results?.length === 0 ? (
        <tr>
          <td colSpan={10} className="text-center">
            No Record Found
          </td>
        </tr>
      ) : (
        casino?.results?.map((bet) => (
          <tr key={bet._id}>
            <td>{bet?.matchName}</td>
            <td>{userData}</td>
            <ColorTd amount={Number(bet.amount)} />
            <td>{new Date(bet.created).toLocaleTimeString()}</td>
            <td>{new Date(bet.created).toLocaleDateString()}</td>
          </tr>
        ))
      )}
    </tbody>
  );
};

export default UserCasino;
