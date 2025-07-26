

const CommanOption = () => {
  return (
    <>
      <option defaultValue={1} value={1}>All</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Decline</option>
      <option value="Processing">Processing</option>
    </>
  );
};

export default CommanOption;
