const ColorTd = ({ amount }: { amount: number|string }) => {
  return <td style={{ color: typeof amount!="string"? amount> 0 ? "green" : "red":"black" }}>{typeof amount=="string"?amount:amount.toFixed(2)}</td>;
};

export default ColorTd;
