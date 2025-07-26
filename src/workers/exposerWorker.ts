self.onmessage = (e) => {
  const { data, total, bookMakerData } = e.data;

  let updatedTotal = total;
  let updatedBookMakerData = bookMakerData;

  if (total) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const updatedTotalMarkets = total.map((prevMarket: any) => {
        if (element?.marketId !== prevMarket.marketId) return prevMarket;

        const updatedRunners = prevMarket.runners.map((prevRunner: any) => {
          
          const newRunner = element.runners.find(
            (r: any) =>
              r.selectionId === prevRunner.selectionId 
          );

          return {
            ...prevRunner,
            userbet: newRunner?.amount ?? prevRunner.userbet,
          };
        });

        return { ...prevMarket, runners: updatedRunners };
      });

    

      updatedTotal = updatedTotalMarkets;
    }
  }

 if (Array.isArray(bookMakerData) && data.length > 0) {
 updatedBookMakerData=bookMakerData.map((market: any) => {
    const matchingIncomingMarket = data.find(
      (el: any) => el?.marketId == market.marketId
    );

    if (!matchingIncomingMarket) return market; // no update needed

    const updatedRunners = market.runners.map((prevRunner: any) => {
      const newRunner = matchingIncomingMarket.runners.find(
        (r: any) => r.name === prevRunner.runner
      );

      return {
        ...prevRunner,
        userbet: newRunner?.amount ?? prevRunner.userbet,
      };
    });

    return {
      ...market,
      runners: updatedRunners,
    };
  });

  // now `updatedBookMakerData` holds all updated markets
  
}

//  if (fancyData != null) {
//         for (let i = 0; i < data.length; i++) {
//           const element = data[i];
//           //@ts-ignore
//           setFancyData((prevBookMakerData) => {
//             const updatedMarketData = element.find(
//               //@ts-ignore
//               (data) => data.marketId === prevBookMakerData.marketId
//             );

//             if (updatedMarketData) {
//               const updatedRunners = prevBookMakerData.runners.map(
//                 //@ts-ignore
//                 (prevRunner) => {
//                   const newRunnerData = updatedMarketData.runners.find(
//                     //@ts-ignore
//                     (newR) =>
//                       newR.name.toString().toLowerCase().trim() ==
//                       prevRunner.RunnerName.toString().toLowerCase().trim()
//                   );
//                   if (newRunnerData) {
//                     return { ...prevRunner, userbet: newRunnerData.amount };
//                   }
//                   return prevRunner;
//                 }
//               );

//               return { ...prevBookMakerData, runners: updatedRunners };
//             }
//             return prevBookMakerData;
//           });
//         }
//       }
  postMessage({
    total: updatedTotal,
    bookMakerData: updatedBookMakerData,
    
  });
};

export {};


