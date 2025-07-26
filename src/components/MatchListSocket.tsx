import { useEffect, useState } from "react";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";

interface Props {
  id: number;
  status: string; 
}

const MatchListSocket = ({ id, status }: Props) => {
  const [matchStatus, setMatchStatus] = useState(status);
  const { socket } = useAppSelector((state: RootState) => state.socket);

  const handleToggle = () => {
    const newStatus = matchStatus.toLowerCase() === "active" ? "inactive" : "active";
    console.log("Toggle Match Status:", id, newStatus);

    socket.emit("assetStatus", {
      matchId: id,
      asset: "match",
      status: newStatus,
    });
  };

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      if (data?.data?.matchId === id) {
        setMatchStatus(data.data.status.toUpperCase());
      }
    };

    socket.on("assetStatus", handleStatusUpdate);

    return () => {
      socket.off("assetStatus", handleStatusUpdate);
    };
  }, [socket, id]);

  return (
    <label className="switch1 vertical-align-middle">
      <input
        type="checkbox"
        id="chkisActiveUsers"
        name="rbtn"
        className="px"
        checked={matchStatus === "ACTIVE"}
        onChange={handleToggle}
      />
      <div className="slider1 round1">
        <span className="on">Active</span>
        <span className="off">In-Active</span>
      </div>
    </label>
  );
};

export default MatchListSocket;
