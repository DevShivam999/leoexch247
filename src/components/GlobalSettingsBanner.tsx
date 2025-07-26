import { useState } from "react";
import instance from "../services/AxiosInstance";
import { Tp } from "../utils/Tp";

const GlobalSettingsBanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const sendBanner = async () => {
    const fromData = new FormData();
    if (!file) return Tp("select the file");
    fromData.append("banner", file);
    fromData.append("type", "bannerA");
    await instance.post("user/add_banner", fromData);
  };
  const HandleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) setFile(e.target.files[0]);
  };
  return (
    <div className="m-3">
      <label className="form-label">
        Update HomePage Banner : Note :
        <span className="text-danger">
          {" "}
          Banners size should be (3059 x 626)
        </span>
      </label>
      <input
        type="file"
        className="mgray-input-box form-control text-end"
        onChange={(e) => HandleImg(e)}
      />

      <div className="text-end mt-3">
        <button className="btn modal-submit-btn" onClick={sendBanner}>
          Update
        </button>
      </div>
    </div>
  );
};

export default GlobalSettingsBanner;
