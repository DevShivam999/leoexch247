import React, { useEffect } from "react";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import { navMenu } from "../utils/nav.services";
import LiveSportNav from "./LiveSport.Nav";
import MiddNav from "./MiddNav.Nav";
import { useDispatch } from "react-redux";
import { removeUser } from "../helper/Changes";
import { getSport } from "../helper/Sport";

const LeftNav: React.FC = () => {
  const { socket } = useAppSelector((p: RootState) => p.socket);
  const { user } = useAppSelector((p: RootState) => p.changeStore);
  const Permissions = useAppSelector((p: RootState) => p.Permissions);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(removeUser());
    }

    if (!socket) return;

    // Emit once
    socket.emit("competitionData", {});
    socket.emit("competitionDataHRGR", {});

    // Common handler
    const handleSportData = (data: any) => {
      dispatch(getSport({ sport: data }));
    };

    socket.on("competitionData", handleSportData);
    socket.on("competitionDataHRGR", handleSportData);

    return () => {
      socket.off("competitionData", handleSportData);
      socket.off("competitionDataHRGR", handleSportData);
    };
  }, [user, socket, dispatch]);

  const userId = user?.numeric_id;

  return (
    <section
      className="left-nav-section"
      style={{
        background: "#f3ecec",
        minHeight: "100vh",
        minWidth: "300px",
      }}
    >
      <ul className="left-navbar accordion" id="left-navbar">
        {navMenu.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.label === "Wallet" ? (
              Permissions.permissions?.acceptWalletWithdrawRequest && (
                <MiddNav idx={idx} item={item} p={userId} />
              )
            ) : (
              <MiddNav idx={idx} item={item} p={userId} />
            )}
          </React.Fragment>
        ))}
        <LiveSportNav />
      </ul>
    </section>
  );
};

export default LeftNav;
