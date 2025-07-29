import { useState, useRef } from "react";
import instance from "../services/AxiosInstance";
import { success, Tp } from "../utils/Tp";
import { fetchBanner } from "../api/fetchUserPermissions";
import useAppDispatch from "../hook/hook";

const GlobalSettingsBanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const sendBanner = async () => {
    if (!file) {
      Tp("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("banner", file);
    formData.append("type", "bannerA");

    setIsUploading(true);
    try {
      await instance.post("user/add_banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      success();
      dispatch(fetchBanner());
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      Tp("Failed to upload banner");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.match("image.*")) {
        Tp("Please select an image file");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  return (
    <div className="m-3">
      <label className="form-label">
        Update HomePage Banner:
        <span className="text-danger ms-2">
          Recommended size: 3059 x 626 pixels
        </span>
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        className="mgray-input-box form-control text-end"
        onChange={handleImageChange}
        accept="image/*"
      />

      {file && (
        <div className="mt-2">
          <p>Selected file: {file.name}</p>
          <div className="image-preview mt-2">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </div>
        </div>
      )}

      <div className="text-end mt-3">
        <button 
          className="btn modal-submit-btn" 
          onClick={sendBanner}
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default GlobalSettingsBanner;