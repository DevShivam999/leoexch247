const formatNumberShort = (num: number): string => {
  if (num >= 10_00_00_000) return (num / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + "Cr"; // 10 Cr+
  if (num >= 1_00_00_000)  return (num / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + "Cr"; // 1 Cr+
  if (num >= 10_00_000)    return (num / 1_00_000).toFixed(1).replace(/\.0$/, '') + "L";  // 10 L+
  if (num >= 1_00_000)     return (num / 1_00_000).toFixed(1).replace(/\.0$/, '') + "L";  // 1 L+
  if (num >= 10_000)       return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";     // 10 K+
  if (num >= 1_000)        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";     // 1 K+

  return num?.toString();
};
export default formatNumberShort;
