import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigation = useNavigate();
  useEffect(() => {
    navigation("/market-analysis");
  }, []);
  return <div></div>;
};

export default NotFound;
