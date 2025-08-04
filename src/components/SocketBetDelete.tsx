// useSocketVDelete.ts
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

const useSocketVDelete = () => {
  const socket = useAppSelector((p: RootState) => p.socket.socket);

  const deleteSessionBet = (
    matchId: string,
    orderId: string | null,
    type: string,
    selectionId: string | null
  ) => {
    if (!socket) return;
    socket.emit("deleteBetsOrders", {
      matchId,
      oddsType: "All",
      selectionId,
      type,
      orderIds: orderId,
    });
  };

  return deleteSessionBet;
};

export default useSocketVDelete;
