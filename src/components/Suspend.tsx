const Suspend = () => {
  return (
    <div
      className="col-5 row p-0 m-0 suspended"
      style={{ position: "absolute" }}
    >
      <div className="col-6 back odds-box-1">
        <span className="odds-value"></span>
        <span className="truncate-valus"></span>
      </div>

      <div className="col-6 lay odds-box-1">
        <span className="odds-value"></span>
        <span className="truncate-valus"></span>
      </div>
    </div>
  );
};

export default Suspend;
