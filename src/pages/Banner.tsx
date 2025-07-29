
import { useEffect } from "react";
import BannerData from "../components/BannerData";
import GlobalSettingsBanner from "../components/GlobalSettingsBanner";

const Banner = () => {
  useEffect(()=>{
    document.title="Banner"
  },[])
  return (
    <div>
      <GlobalSettingsBanner />
      <BannerData />
    </div>
  );
};

export default Banner;
