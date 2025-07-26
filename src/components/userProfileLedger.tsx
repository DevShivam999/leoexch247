const UserProfileLedger = ({ LEDGER,name }: { LEDGER: {NAME:string,LEDGER:any[]},name:string }) => {
  return (
    <tbody>
      {LEDGER &&
        LEDGER.LEDGER.length > 0 &&
        LEDGER.LEDGER.map((transaction: any, index: number) => (
          <tr key={transaction._id}>
            <td>{index + 1}</td>
            <td className={transaction.txType === "CR" ? "text-green" : ""}>
              {transaction.txType === "CR"
                ? transaction.amount.toLocaleString()
                : "0"}
            </td>
            <td className={transaction.txType === "DR" ? "text-red" : ""}>
              {transaction.txType === "DR"
                ? Math.abs(transaction.amount).toLocaleString()
                : "0"}
            </td>
            <td>{new Date(transaction.created).toLocaleString()}</td>
          
            <td>{transaction.remarks}</td> 
           
            
            <td>{LEDGER.NAME}/{name}</td>
          </tr>
        ))}
    </tbody>
  );
};

export default UserProfileLedger;
