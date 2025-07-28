import type { MenuItem } from "../types/vite-env";

export const navMenu = [
  {
    label: "Dashboard",
    icon: "bi-house",
    to: "/",
  },
  {
    label: "Market Analysis",
    icon: "bi-bar-chart-fill",
    to: "/market-analysis",
  },
  {
    label: "List of Clients",
    icon: "bi-people-fill",
    to: "/list-of-clients",
  },
  {
    label: "Settings",
    icon: "bi-gear-fill",
    children: [
      { label: "Global Settings", to: "/global-settings" },
      { label: "Create Partner", to: "/create-partner" },
    ],
  }, {

    label: "Result Panel",
     icon: "bi-archive",
    children: [
      // { label: "Greyhound", to: "/matchList/4339" },
      // { label: "Horse", to: "/matchList/7" },
      { label: "Football", to: "/matchList/1" },
      { label: "Tennis", to: "/matchList/2" },
      { label: "Cricket", to: "/matchList/4" },
     
    ],
  },
  {
    label: "Reports",
    icon: "bi-journal",
    children: [
      { label: "Account's Statement", to: "/account-statement" },
      { label: "Current Bets", to: "/current-bets" },
      { label: "Chip Summary", to: "/chip-summary" },
      { label: "General Report", to: "/general-report" },
      { label: "Game Report", to: "/game-report" },
      { label: "Profit And Loss", to: "/profit-and-loss" },
      { label: "Event P|L", to: "/event-pl" },
      { label: "Commission Loss", to: "/commission-loss" },
      { label: "Client Commission Lenden", to: "/client-commission-lenden" },
    ],
  },
  {
    label: "Wallet",
    icon: "bi-wallet-fill",
    children: [
      { label: "Dashboard", to: "/wallet-dashboard" },
      { label: "All Transactions", to: "/all-transaction" },
      { label: "Deposit Transactions", to: "/deposit-transaction" },
      { label: "Total Deposit", to: "/total-deposit" },
      { label: "Withdraw Transaction", to: "/withdrawal-transaction" },
      { label: "Total Withdraw", to: "/total-withdraw" },
      { label: "Deposit Payment Method", to: "/deposit-payment-method" },
      { label: "Site Panel", to: "/site-panel" },
      { label: "Id Request", to: "/id-request" },
      { label: "Bonus", to: "/bonus" },
    ],
  },
];



export const menuItems: MenuItem[] = [
  { label: "List of Clients", path: "/list-of-clients" },
  { label: "Dashboard", path: "/" },
  { label: "Market Analysis", path: "/market-analysis" },
  {
    label: "Live Market",
    dropdown: [""].map((name) => ({
      label: name,
      path: `/live-market/${name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}`,
    })),
  },
  {
    label: "Settings",
    dropdown: [
      { label: "Global Settings", path: "/global-settings" },
      { label: "Create Partner", path: "/create-partner" },
    ],
  },
  {
    label: "Reports",
    dropdown: [
      { label: "Account's Statement", path: "/account-statement" },
      { label: "Current Bets", path: "/current-bets" },
      { label: "Chip Summary", path: "/chip-summary" },
      { label: "General Report", path: "/general-report" },
      { label: "Game Report", path: "/game-report" },
      { label: "Profit And Loss", path: "/profit-and-loss" },
      { label: "Event P|L", path: "/event-pl" },
      { label: "Commission Loss", path: "/commission-loss" },
      { label: "Client Commission Lenden", path: "/client-commission-lenden" },
    ],
  },
  {

    label: "Result Panel",
    dropdown: [
      // { label: "Greyhound", path: "/matchList/4339" },
      // { label: "Horse", path: "/matchList/7" },
      { label: "Football", path: "/matchList/1" },
      { label: "Tennis", path: "/matchList/2" },
      { label: "Cricket", path: "/matchList/4" },
     
    ],
  },
  {
    label: "Wallet",
    dropdown: [
      { label: "Dashboard", path: "/wallet-dashboard" },
      { label: "All Transactions", path: "/all-transaction" },
      { label: "Deposit Transactions", path: "/deposit-transaction" },
      { label: "Total Deposit", path: "/total-deposit" },
      { label: "Withdraw Transaction", path: "/withdrawal-transaction" },
      { label: "Total Withdraw", path: "/total-withdraw" },
      { label: "Deposit Payment Method", path: "/deposit-payment-method" },
      { label: "Site Panel", path: "/site-panel" },
      { label: "Id Request", path: "/id-request" },
      { label: "Bonus", path: "/bonus" },
    ],
  },
  { label: "Multi Login", path: "/create-partner" },
];
