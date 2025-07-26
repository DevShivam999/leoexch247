import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "../hook/hook";
import type { RootState } from "../helper/store";
import LeftNav from "../components/LeftNav";
import Loading from "../components/Loading";
import { routeConfig } from "../services/route.config";

const Router = () => {
  const showNav = useAppSelector((p: RootState) => p.changeStore.showNav);
  const path = useLocation();

  return (
    <div className="d-flex">
      {showNav && path.pathname.split("/")[1] !== "login"&&path.pathname.split("/")[1]!=="firstLogin" &&path.pathname.split("/")[1]!="TransactionPasswordSuccess"&& <LeftNav />}
      <div style={{ width: "100%" }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routeConfig.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Router;
