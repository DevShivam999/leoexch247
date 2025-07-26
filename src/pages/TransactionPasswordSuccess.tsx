import { useNavigate, useParams } from "react-router-dom";

const TransactionPasswordSuccess = () => {
  const { id } = useParams();
  const navigation = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-white">
      <div
        className="text-center border p-4 rounded shadow-lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h5 className="text-success fw-semibold">
          Success! your password has been update successfully.
        </h5>

        <p className="mt-3">
          <strong>Your transaction password is </strong>
          <span className="text-primary fw-semibold">{id}</span>.
        </p>

        <p className="text-muted small">
          Please remember this transaction password. From now on, all
          transactions on the website can be done only with this password. Keep
          one thing in mind, do not share this password with anyone.
        </p>

        <p className="text-secondary small">
          Thank you, Team <strong>D247</strong>
        </p>

        <hr className="my-4" />

        <h5 className="text-success fw-semibold">
          Success! आपका पासवर्ड बदल जा चूका है
        </h5>

        <p className="mt-2">
          आपका लेनदेन पासवर्ड{" "}
          <span className="text-primary fw-semibold">{id}</span> है।
        </p>

        <p className="text-muted small">
          कृपया इस लेन-देन पासवर्ड को याद रखें, अब सभी वेबसाइट पर केवल इसी
          पासवर्ड से ट्रांसेक्शन किया जा सकता है और एक बात का ध्यान रखें कि इस
          पासवर्ड को किसी के साथ साझा न करें।
        </p>

        <p className="text-secondary small">
          धन्यवाद, टीम <strong>D247</strong>
        </p>

        <button
          className="btn btn-dark mt-4 px-5"
          onClick={() => navigation("/login")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TransactionPasswordSuccess;
