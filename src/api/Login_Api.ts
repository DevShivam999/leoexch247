import axios from "axios";
import type { ILoginFormInputs } from "../pages/Login";
import { Tp } from "../utils/Tp";

export const Login_Api = async (data: ILoginFormInputs) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_Api_Url}/auth/signin`,
      {
        client_id: "",
        client_secret: "",
        password: data.password,
        username: data.username,
      },
    );
     if(response.data?.roles[0]=="user"){
      return Tp("not valid User")
    }


    const user = {
      balance: response.data?.balance ?? null,
      betStatus: response.data?.betStatus ?? null,
      credit: response.data?.credit ?? null,
      displayName: response.data?.displayName ?? "",
      email: response.data?.email ?? "",
      exposerLimit: response.data?.exposerLimit ?? null,
      firstLogin: response.data?.firstLogin ?? false,
      firstName: response.data?.firstName ?? "",
      lastName: response.data?.lastName?.toString() ?? "",
      loginCount: response.data?.loginCount ?? 0,
      numeric_id: response.data?.numeric_id ?? null,
      phone: response.data?.phone ?? "",
      profitLossBalance: -2629953.9499999597,
      profitLossCredit: 0,
      roles: response.data?.roles ?? ["user"],
      rummyToken:
        response.data?.rummyToken ?? "DTgPxkEbUA5WqNBMzTot2VUTM9Q0fPOk",
      status: response.data?.status ?? false,
      upBalance: response.data?.upBalance ?? 0,
      upCredit: response.data?.upCredit ?? 0,
      username: response.data?.username ?? "Guest",
      _id: response.data?._id ?? null,
    };
   
    localStorage.setItem(
      "fixedBetLabel",
      JSON.stringify(response.data.fixedBetLabel),
    );
    localStorage.setItem(
      "sports_data",
      JSON.stringify(response.data.sportsData),
    );
    localStorage.setItem("token", JSON.stringify(response.data.token));
    localStorage.setItem("user", JSON.stringify(user));
    
    return  {data:response.data.firstLogin,result:true};
  } catch (error) {
    if (error instanceof Error) {
      //@ts-ignore
      Tp(error.response.data.message);
      console.log("old error", error);
    } else {
      console.log("new Error", error);
    }
    return {result:false};
  }
};
