import { lazy } from "react";
import TransactionPasswordSuccess from "../pages/TransactionPasswordSuccess";

const DashBoard = lazy(() => import("../pages/DashBoared"));
const Market_analysis_api = lazy(() => import("../api/Market_analysis_api"));
const Login = lazy(() => import("../pages/Login"));
const ClientList = lazy(() => import("../pages/ClientList"));
const GlobalSetting = lazy(() => import("../pages/GlobalSetting"));
const AccountStatement = lazy(() => import("../pages/AccountStatment"));
const CurrentBet = lazy(() => import("../pages/Currentbet"));
const ChipSetting = lazy(() => import("../pages/ChipSetting"));
const LedgeAccountStatement = lazy(() => import("../pages/ledgeAccountStatment"));
const ProfitLossReport = lazy(() => import("../pages/ProfitLossReport"));
const GameReport = lazy(() => import("../pages/GameReport"));
const GeneralReport = lazy(() => import("../pages/GeneralReport"));
const EventPL = lazy(() => import("../pages/EventPL"));
const CommissionLoss = lazy(() => import("../pages/ComissionLoss"));
// const ClientCommissionLedge = lazy(() => import("../pages/ClientCommissionLendge"));
const CreatePartner = lazy(() => import("../pages/CreatePartner"));
const Banner = lazy(() => import("../pages/Banner"));
const WalletDashboard = lazy(() => import("../pages/WalletDashboard"));
const AllTransaction = lazy(() => import("../pages/AllTransaction"));
const TotalDeposit = lazy(() => import("../pages/TotalDeposit"));
const WithdrawalTransaction = lazy(() => import("../pages/WithdrawalTransaction"));
const TotalWithdraw = lazy(() => import("../pages/TotalWithdraw"));
const LineMatch = lazy(() => import("../pages/LiveMatch"));
const AddUser = lazy(() => import("../pages/AddUser"));
const NotFound = lazy(() => import("../pages/404"));
const Changepassword = lazy(() => import("../pages/Changepassword"));
const SecurityAuthVerification = lazy(() => import("../pages/SecurityAuthVerfication"));
const UserDetails = lazy(() => import("../pages/UserDetails"));
const AddPartner = lazy(() => import("../pages/add"));
const DepositMethod = lazy(() => import("../pages/DepositMethod"));
// const SitePanel = lazy(() => import("../pages/SitePanel"));
// const RequestId = lazy(() => import("../pages/RequestId"));
// const Bonus = lazy(() => import("../pages/Bonus"));
const DepositTansaction = lazy(() => import("../pages/DepositTansaction"));
const MatchList = lazy(() => import("../pages/MatchList"));
const MatchInfo = lazy(() => import("../pages/MatchInfo"));
const FancyCricketSettings = lazy(() => import("../pages/FancyMatchSettingAtUser"));
const UserCommission = lazy(() => import("../pages/CommissionUser"));

export const routeConfig = [
 { path: "/", element: <DashBoard /> },
 { path: "/market-analysis", element: <Market_analysis_api /> },
 { path: "/login", element: <Login /> },
 { path: "/list-of-clients", element: <ClientList /> },
 { path: "/global-settings", element: <GlobalSetting /> },
 { path: "/account-statement/:id", element: <AccountStatement /> },
 { path: "/current-bets", element: <CurrentBet /> },
 { path: "/chip-summary", element: <ChipSetting /> },
 { path: "/ledger-account-statement/:id", element: <LedgeAccountStatement /> },
 { path: "/profit-and-loss", element: <ProfitLossReport /> },
 { path: "/game-report", element: <GameReport /> },
 { path: "/general-report", element: <GeneralReport /> },
 { path: "/event-pl", element: <EventPL /> },
 { path: "/commission-loss", element: <CommissionLoss /> },
 // { path: "/client-commission-lenden", element: <ClientCommissionLedge /> },
 { path: "/create-partner", element: <CreatePartner /> },
 { path: "/create-banner", element: <Banner /> },
 { path: "/wallet-dashboard", element: <WalletDashboard /> },
 { path: "/all-transaction", element: <AllTransaction /> },
 { path: "/deposit-transaction", element: <DepositTansaction /> },
 { path: "/total-deposit", element: <TotalDeposit /> },
 { path: "/withdrawal-transaction", element: <WithdrawalTransaction /> },
 { path: "/total-withdraw", element: <TotalWithdraw /> },
 { path: "/live-market/:matchName/:id", element: <LineMatch /> },
 { path: "/add-partner", element: <AddUser /> },
 { path: "/add-Client", element: <AddPartner /> },
 { path: "/change-password", element: <Changepassword /> },
 { path: "/firstLogin", element: <Changepassword /> },
 { path: "/security-auth-verification", element: <SecurityAuthVerification /> },
 { path: "/user/:id", element: <UserDetails /> },
 { path: "/deposit-payment-method", element: <DepositMethod /> },
 // { path: "/site-panel", element: <SitePanel /> },
 // { path: "/id-request", element: <RequestId /> },
 { path: "/TransactionPasswordSuccess/:id", element: <TransactionPasswordSuccess /> },
 { path: "/matchList/:id", element: <MatchList /> },
 { path: "/matchInfo/:id", element: <MatchInfo /> },
 { path: "/UserSettings/:id", element: <FancyCricketSettings /> },
 { path: "/UserCommission/:id", element: <UserCommission /> },
 // { path: "/bonus", element: <Bonus /> },
 { path: "*", element: <NotFound /> },
];

