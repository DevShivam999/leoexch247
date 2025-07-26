import wifiCallingIcon from "/wifi-calling-icon.png";
import messageIcon from "/message-icon.png";
import { memo, useState } from "react";
import instance from "../services/AxiosInstance";
import type { RootState } from "../helper/store";
import { useSelector } from "react-redux";
import { Tp } from "../utils/Tp";

const GlobalContactNav = memo(() => {
  const user = useSelector((p: RootState) => p.changeStore.user);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showMessagelModal, setShowMessageModal] = useState(false);
  const handleWhatsappSave = () => {
    // setSettings({ ...settings, whatsappNo: tempWhatsappNo });
    setShowWhatsappModal(false);
  };

  const [tempWhatsappNo, setTempWhatsappNo] = useState("");
  const [tempMessage, setTempMessage] = useState("");

  const handleMessageSave = async () => {
    // setSettings({ ...settings, message: tempMessage });
    if (!tempMessage) return Tp("Please fill all fields");
    await instance.post("/notification/update", {
      message: tempMessage,
      notificationType: "home",
      status: "active",
      id: user._id,
    });
    setShowMessageModal(false);
  };
  return (
    <>
      <div className="table-responsive">
        <table className="table-one table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Whatsapp no.</td>
              <td>
                <button
                  className="wifi-call-btn"
                  onClick={() => {
                    setShowWhatsappModal(true);
                    // setTempWhatsappNo(settings.whatsappNo);
                  }}
                >
                  <img src={wifiCallingIcon} alt="wifi-calling" />
                </button>
              </td>
            </tr>
            <tr>
              <td>Message</td>
              <td>
                <button
                  className="wifi-call-btn"
                  onClick={() => {
                    setShowMessageModal(true);
                    // setTempMessage(settings.message);
                  }}
                >
                  <img src={messageIcon} alt="message-icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {showWhatsappModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Whatsapp Number</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowWhatsappModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={tempWhatsappNo}
                  onChange={(e) => setTempWhatsappNo(e.target.value)}
                  placeholder="Enter Whatsapp Number"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWhatsappModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleWhatsappSave}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMessagelModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Message</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={3}
                  value={tempMessage}
                  onChange={(e) => setTempMessage(e.target.value)}
                  placeholder="Enter Message"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMessageModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleMessageSave}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default GlobalContactNav;
