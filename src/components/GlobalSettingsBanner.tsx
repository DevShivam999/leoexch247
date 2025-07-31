import { useState, useRef } from "react";
import instance from "../services/AxiosInstance";
import { success, Tp } from "../utils/Tp";
import { fetchBanner } from "../api/fetchUserPermissions";
import useAppDispatch from "../hook/hook";

const GlobalSettingsBanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const RECOMMENDED_WIDTH = 3059;
  const RECOMMENDED_HEIGHT = 626;

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
      resetForm();
    } catch (err) {
      console.error("Banner upload error:", err);
      Tp("Failed to upload banner");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        if (width !== RECOMMENDED_WIDTH || height !== RECOMMENDED_HEIGHT) {
          Tp(`Image must be exactly ${RECOMMENDED_WIDTH} × ${RECOMMENDED_HEIGHT} pixels`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        Tp("Invalid image file");
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      resetForm();
      return;
    }

    const selectedFile = e.target.files[0];
    
    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      Tp("Please select an image file (JPEG, PNG, etc.)");
      resetForm();
      return;
    }

    // Check file size (optional - limit to 5MB here)
    if (selectedFile.size > 5 * 1024 * 1024) {
      Tp("Image size must be less than 5MB");
      resetForm();
      return;
    }

    // Validate dimensions
    const isValid = await validateImage(selectedFile);
    if (!isValid) {
      resetForm();
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <div className="m-3">
      <label className="form-label">
        Update HomePage Banner:
        <span className="text-danger ms-2">
          Required size: {RECOMMENDED_WIDTH} × {RECOMMENDED_HEIGHT} pixels
        </span>
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        className="mgray-input-box form-control text-end"
        onChange={handleImageChange}
        accept="image/*"
        disabled={isUploading}
      />

      {previewUrl && (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-1">Selected file: {file?.name}</p>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={resetForm}
              disabled={isUploading}
            >
              Remove
            </button>
          </div>
          <div className="image-preview mt-2 border p-2">
            <img 
              src={previewUrl} 
              alt="Banner Preview" 
              className="img-fluid"
              style={{ maxHeight: "200px" }}
            />
            <div className="text-center mt-2 text-muted">
              Preview (actual size: {RECOMMENDED_WIDTH} × {RECOMMENDED_HEIGHT})
            </div>
          </div>
        </div>
      )}

      <div className="text-end mt-3">
        <button 
          className="btn modal-submit-btn" 
          onClick={sendBanner}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Uploading...
            </>
          ) : (
            "Update Banner"
          )}
        </button>
      </div>
    </div>
  );
};

export default GlobalSettingsBanner;