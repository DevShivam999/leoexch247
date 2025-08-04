import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser, toggleNav } from "../helper/Changes";
import React, { useEffect, useState } from "react";
import type { RootState } from "../helper/store";
import type { InplayMatchesData, MenuItem, SubMenuItem } from "../types/vite-env";
import { menuItems } from "../utils/nav.services";
import { useAppSelector } from "../hook/hook";
import CommanNav from "./commanNav";

const Nav: React.FC = () => {
  const [nav, setNav] = useState<MenuItem[]>(menuItems);
  const User = useAppSelector((p: RootState) => p.changeStore.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const Logout = () => {
    dispatch(removeUser());
    navigation("/login");
  };

  const { socket } = useAppSelector((p: RootState) => p.socket);
  const  Permissions  = useAppSelector((p: RootState) => p.Permissions);

  useEffect(() => {
    if (!User) {
      navigation("/login");
    }

    socket.emit("inplaymatches", { userId: User.numeric_id });

    const handleInplayMatches = (data: InplayMatchesData) => {
      let allLiveMarketItems: SubMenuItem[] = [];

      Object.keys(data).forEach((sportName) => {
        const sportData = data[sportName];
        if (sportData && sportData.matches) {
          sportData.matches.forEach((match) => {
            allLiveMarketItems.push({
              label: `${match.name} (${sportName})`,
              path: `/live-market/${sportName}/${match.matchId}`,
            });
          });
        }
      });

      //@ts-ignore
      setNav((prevNav) =>
        prevNav.map((item) => {
          if (item.label === "Live Market" && "dropdown" in item) {
            return { ...item, dropdown: allLiveMarketItems };
          }
          return item;
        }),
      );
    };

    socket.on("inplaymatches", handleInplayMatches);

    return () => {
      socket.off("inplaymatches", handleInplayMatches);
    };
  }, [socket, setNav]);

  let p = useAppSelector((p: RootState) => p.changeStore.user);

  if (p) p = p?.numeric_id;

  return (
    <header className="admin-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div
          className="navbar-collapse menu-list"
          style={{ justifyContent: "space-between", flexWrap: "nowrap" }}
        >
          <Link className="navbar-brand" to="/">
            <img alt="logo" src="/logo-1.png" style={{ height: "30px" }} />
          </Link>
          <button
            type="button"
            onClick={() => dispatch(toggleNav())}
            className="menu-button"
            id="menu-button"
          >
            <i className="fa fa-bars"></i>
          </button>

          <div className="header-top-menu navbar-nav navbar">
            <ul className="menu-row">
              {nav.map((item, index) => (
                <React.Fragment key={index}>
                  {item.label == "Wallet" ? (
                    (Permissions.permissions?.acceptWalletWithdrawRequest ||
                      Permissions.permissions?.acceptWalletWithdrawRequest) && (
                  <CommanNav item={item} p={p} index={index}/>
                    )
                  ) : (
                     <CommanNav item={item} p={p} index={index}/>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>

          <div className="rightmenu">
            <ul className="rightmenu-ul">
       
              <li className="menu-item dropdown menu-dropbtn">
                <button
                  className="btn dropdown-toggle menu-link"
                  
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: "transparent !important" }}
                >
                  <img src="/user.svg" alt="User icon" />
                  {User?.firstName ?? "Leoexch247"}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Bal. : <span>{User.credit-User.upCredit || 100000}</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/change-password">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/security-auth-verification"
                    >
                      Security Auth Verification
                    </Link>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href={`https://api.whatsapp.com/send?phone=${User?.number}&text=&source=&data=&app_absent=`}
                    >
                      <i className="fab fa-whatsapp text-success"></i> Leoexch247
                    </a>
                  </li>
                  <li>
                    <div
                      className="dropdown-item"
                      onClick={() => User !== null && Logout()}
                    >
                      {User === null || User == "" ? "Login" : "Log out"}
                    </div>
                  </li>
                </ul>
              </li>
              {/* <form className="search-input-box">
                <input
                  name="searchSport"
                  placeholder="All Client..."
                  className="search-input"
                />
                <i className="fas fa-search-plus"></i>
              </form> */}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
