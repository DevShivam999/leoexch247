/// <reference types="vite/client" />

declare module "*?worker" {
  const workerConstructor: {
    new(): Worker;
  };
  export default workerConstructor;
}

export interface Odd {
  name: string;
  amount: number;
  marketId: string;
  marketName: string;
}
export interface FancyOdd {
  name: string;
  amount: number;
  marketId: string;
}
export interface MatchIdInfo {
  matchId: number;
  eventName: string;
}

export interface Bookmaker { }
export interface MatchResult {
  _id: number;
  eventName: string;
  matchId: number;
  eventId: number;
  matchODs?: Odd[][];
  fancy?: FancyOdd[][];
  bookmaker?: Odd[][];
  BetStatus?: boolean
}

export interface ApiResponse {
  results: MatchResult[];
}

export interface IDepositWithdrawFormInputs {
  bigAdminCR: string;
  bigAdminValue1: string;
  bigAdminValue2: string;
  supscValue1: string;
  supscValue2: string;
  amount: number;
  remark: string;
  transactionPassword: string;
}

export interface IExposureCreditLimitFormInputs {
  oldLimit: string;
  newLimit: number;
  transactionPassword: string;
}

export interface IPasswordLimitFormInputs {
  newPassword: string;
  confirmPassword: string;
  transactionPassword: string;
}

export interface IChangeStatusFormInputs {
  userActive: boolean;
  betActive: boolean;
  transactionPassword: string;
}

export interface ISportsSettingsFormInputs {
  cricketEnabled: boolean;
  soccerEnabled: boolean;
  tennisEnabled: boolean;
  casinoQtechEnabled: boolean;
  diamondCasinoEnabled: boolean;
  virtualCricketEnabled: boolean;
  ballByBallEnabled: boolean;
  transactionPassword: string;
}

export interface User {
  username: string;
  creditReference: string;
  balance: string;
  clientPL: string;
  myPL: string;
  exposure: string;
  availableBalance: string;
  uSt: boolean;
  bSt: boolean;
  defaultValue: string;
  accountType: string;
}

export interface AccountStatementData {
  created: Date;
  remarks: string;
  amount: number;
  closing: number | string;
  category: string;
  txType: "CR" | "DR";
  marketId: string;
  balance: number
}

export interface BetDetails {
  uplevel: string;
  userName: string;
  nation: string;
  userRate: string;
  amount: number;
  winLoss: number;
  placeDate: string;
  matchDate: string;
  ip: string;
  browserDetail: string;
}

export interface ExposureModalData {
  totalWinLoss: number;
  totalCount: number;
  totalSoda: number;
  betDetails: BetDetails[];
}

export interface AccountStatementsApiResponse {
  results: AccountStatementData[];
  totalCount?: number;
  currentPage?: number;
}

export interface SubMenuItem {
  label: string;
  path: string;
}

export interface MenuItemWithDropdown {
  label: string;
  dropdown: SubMenuItem[];

  path?: never;
}

export interface MenuItemWithoutDropdown {
  label: string;
  path: string;

  dropdown?: never;
}

export type MenuItem = MenuItemWithDropdown | MenuItemWithoutDropdown;

export interface UserData {
  firstName: string;
  balance: number;
  number: number;
}

export interface SportData {
  matches: MatchItem[];
  summaries: any[];
}

export interface MatchItem {
  id: string;
  name: string;

  [key: string]: any;
}

export interface InplayMatchesData {
  cricket?: SportData;
  football?: SportData;
  tennis?: SportData;

  [key: string]: SportData | undefined;
}

export interface DashBoardType {
  AvailableBalWPL: number;
  AvailableBalance: number;
  DownLevelCreditRef: number;
  DownLevelOccupyBal: number;
  DownLevelPL: number;
  MyPL: number;
  TotalMasterBal: number;
  UpperLevel: number;
  UpperlevelCreditRef: number;
  UsersAvailBalance: number;
  UsersExposure: number;
}

interface ReportItem {
  commission: number;
  gameId: number;
  matches: Match[];
  sportName: string;
  profitLoss: number;
  totalPL: number;
}

interface Match {
  matchId: string;
  matchName: string;
  date: string;
  commission: number;
  profitLoss: number;
  totalPL: number;
  markets: Market[];
}

interface Market {
  marketId: string;
  marketType: string;
  profitLoss: number;
  commission: number;
  totalPL: number;
  matchId: string;
  matchName: string;
  sportName: string;
  bets: Bet[];
}

interface Bet {
  uplinetotal: number;
  amount: number;
  team: string;
  username: string;
  placedAt: string;
}

interface WalletDashboardData {
  totalUsers: number;
  activeUsers: number;
  weeklyUsers: number;
  monthlyUsers: number;
  overallDeposits: number;
  overallWithdraws: number;
  todayDeposits: number;
  todayWithdraws: number;
  weeklyDeposits: number;
  weeklyWithdraws: number;
  monthlyDeposits: number;
  monthlyWithdraws: number;
}

interface CurrentBetMatch {
  _id: string;
  name: string;
}
interface CurrentBetUser {
  _id: string;
  username: string;
  displayName: string;
  numeric_id: number;
}
interface CurrentBetRunner {
  name: string;
  amount: number;
  selectionId: number;
}

export interface CurrentBet {
  _id: string;
  orderId: string;
  marketId: string;
  selectionId: string;
  betAmount: number;
  comm_in: number;
  comm_out: number;
  created: string;
  deletedAt: string | null;
  deletedType: string;
  eventId: number;
  isDeleted: boolean;
  marketName: string;
  match: CurrentBetMatch;
  matchId: number;
  oddsType: string;
  orderCategory: string;
  orderType: string;
  rate: number;
  runnerName: string;
  runners: CurrentBetRunner[];
  sessionOrderRun: number;
  size: number;
  status: string;
  updated: string;
  user: CurrentBetUser;
  user_ip: string;
  amount: string;
  __v: number;
  matchName: string;
  username: string;
}

interface ProfitLossReportData {
  PL: number;
  UplinePl: number;
  percentage: number;
  _id: {
    id: string;
    role: string[];
    username: string;
    token: string[];
    numeric_id: number;
  };
}

interface Transaction {
  _id: string;
  txId: string;
  txType: "DR" | "CR";
  category: string;
  status: string;
  remarks: string;
  amount: number;
  user: string;
  refUser: string;
  winnerName: string;
  balance: number;
  note: string;
  comm_in: number;
  comm_out: number;
  uplinetotal: number;
  isresult: boolean;
  created: string;
  __v: number;
}

interface NewGameData {
  [gameId: string]: [number];
}

interface GameResults {
  newData: NewGameData;
  sums: number;
}

interface ChildGameResults {
  newChildData: NewGameData;
  child_sums: number;
}

interface FixedBetLabel {
  label: string;
  value: number;
}

interface SportData {
  sportType: string;
  isEnable: boolean;
  _id: string;
}

interface UserDetails {
  parent: string | null;
  _id: string;
  password?: string;
  masterPassword?: string;
  status: boolean;
  statusBy: string;
  betStatus: boolean;
  betStatusBy: string;
  token: string[];
  roles: string[];
  questions: any[];
  answers: any[];
  credit: number;
  upCredit: number;
  profitLossCredit: number;
  balance: number;
  upBalance: number;
  profitLossBalance: number;
  firstLogin: boolean;
  loginCount: number;
  loginAllowed: number;
  fixedBetLabel: FixedBetLabel[];
  comm_in: number;
  comm_out: number;
  sportsData: SportData[];
  numeric_id: number;
  firstName: string;
  displayName: string;
  lastName: string;
  username: string;
  exposerLimit: number;
  city: string;
  phone: string;
  salt?: string;
  masterSalt?: string;
  __v: number;
  user_lock: boolean;
  iCasinoRegiter: boolean;
  rummyToken: string;
  created: string;
  email: string;
  invaliedlogin: number;
  lastInvalidLogin: string;
}


interface EventPLRow {
  sportname: string;
  profitLoss: number;
  commission: number;
  totalPL: number;
}

interface EventPLTotals {
  overallProfitLoss: number;
  overallCommission: number;
  overallTotalPL: number;
}

interface EventPLApiResponse {
  success: boolean;
  message: string;
  data: EventPLRow[];
  totals: EventPLTotals;
}

interface BetData {
  event_Type: string;
  event_Name: string;
  user_Name: string;
  runner_Name: string;
  bet_Type: string;
  user_Rate: number;
  amount: number;
  bet_Time: string;
  match_Date: string;
  ip: string;
  isSelect: boolean;
  orderType: string;
  user: {
    username: string;
  };
  match: {
    name: string;
  };
  sessionRunner: String
  runnerName: string;
  oddstype: string;
  betAmount: string;
  rate: string;
  oddsType: string;
  user_ip: string;
  created: string;
  updated: string;
  _id: string;
  matchId: string;
}

type FancyOrder = {
  _id: string;
  match: {
    name: string;
    countryCode?: string;
  };
  user: {
    username: string;
  };
  orderType?: string;
  rate?: number;
  size?: number;
  betAmount?: number;
  isSelected: boolean;
  created: string;
  user_ip: string;
  oddsType?: string;
  runners: any[];
};

interface ActivityLogEntry {
  city: string;
  country: string;
  createdAt: string;
  ip: string;
  loc: string;
  name: string;
  org: string;
  postal: string;
  region: string;
  remark: string;
  status: string;
  timezone: string;
  updatedAt: string;
}
interface FancyMarketData {
  gtype: string,
  mtype: string
  RunnerName: string,
  userbet?: number,
  LayPrice1: number,
  BackSize1: number,
  BackPrice1: number,
  LaySize1: number,
  g_status: string
  SelectionId: string
  min: number,
  max: number
  maxb: number
  selectionId: string
}
interface Permission {
  userDeposit: boolean;
  userWithdraw: boolean;
  addUser: boolean;
  userStatus: boolean;
  betStatus: boolean;
  userPasswordUpdate: boolean;
  eventEnableDisable: boolean;
  reportHideShow: boolean;
  acceptWalletWithdrawRequest: boolean;
  acceptWalletDepositRequest: boolean;
}


interface Match {
  id: string | number;
  name: string,
  countryCode?: string,
  openDate?: string

}

interface EventData {
  name: string;
  matches: Match[];

}

interface SportType {
  comp_name: string;
  eventData?: EventData[];
  matches?: Match[];
}

interface LiveSportNavProps {
  sport: SportType[];
}

interface Fancy {
  minBet: number;
  maxBet: number;
}

interface MatchList {
  _id: string
  matchId: number;
  name: string;
  openDate: string;
  matchStatus: string;
  inplay: boolean
}

interface Sessions {
  _id: string;
  matchId: number;
  RunnerName: string;
  date: string;
  status: string;
  created: string;
  selectionId: string
}
interface Runner {
  selectionId: number
  name: string
  runner: string
}
interface MarketData {

  runners: Runner[];
}
interface MatchSession {
  name: string
  marketId: string;
  isResult: boolean
  matchId: string;
  marketData: MarketData[]
}