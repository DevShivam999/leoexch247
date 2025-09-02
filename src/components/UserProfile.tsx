import { useSelector } from "react-redux";
import type { UserData } from "../pages/UserDetails";
import UserProfileSport from "./UserProfileSport";
import type { RootState } from "../helper/store";
import { useParams } from "react-router-dom";
import { useState } from "react";

const UserProfile = ({ userData }: { userData: UserData }) => {
  const socket = useSelector((p: RootState) => p.socket.socket);
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    const text = `https://Leoexch247.com/ReferBy/${userData?.referralCode}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2 sec baad reset
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="pro-tabs-inner-content">
      <div className="container-fluid">
        <div className="page-heading-box">
          <h1 className="heading-one">Profile Detail</h1>
          <div className="refcode-row">
            <div className="ref-code-box">
              {`https://Leoexch247.com/ReferBy/${userData?.referralCode}`}
              <span className="copy" onClick={copyToClipboard}>
                {copied ? "copied!" : "tap-to-copy"}
              </span>
            </div>
            <div className="ref-use text-success">ACTIVE</div>
            <button
              type="button"
              className="red-button"
              onClick={() =>
                socket.emit("logout_user", {
                  numeric_id: id,
                })
              }
            >
              <i className="fas fa-sign-in-alt"></i> LOGOUT
            </button>
          </div>
        </div>
        <div className="profile-card-one">
          <div className="profile-card-body">
            <div className="table-responsive">
              <table className="table table-four ">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>:</td>
                    <td>{userData?.username}</td>
                    <td>Parent User:</td>
                    <td>:</td>
                    <td>{userData?.parent?.username}</td>
                  </tr>
                  <tr>
                    <td>Balance</td>
                    <td>:</td>
                    <td>{userData?.balance}</td>
                    <td>Siteurl</td>
                    <td>:</td>
                    <td>https://Leoexch247.com</td>
                  </tr>

                  <tr>
                    <td>Exposure</td>
                    <td>:</td>
                    <td className="text-red">{userData?.exposerLimitRef}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Limit</td>
                    <td>:</td>
                    <td>{userData?.exposerLimit}</td>
                    <td>Referral code</td>
                    <td>:</td>
                    <td>
                      <div className="refcode-row">
                        <div className="ref-code-box">
                          {userData?.referralCode}
                          <span className="copy">tap-to-copy</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Credit Reference</td>
                    <td>:</td>
                    <td>{userData?.creditRef}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Role</td>
                    <td>:</td>
                    <td>{userData?.roles[0]}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <h1 className="heading-one">Sports</h1>
        <UserProfileSport />
      </div>
    </div>
  );
};

export default UserProfile;
