import { useEffect, useState } from "react";
import { useUser } from "./context";
import { isTokenValid } from "../jwtHelper";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isTokenValid(parsedUser.token)) {
          setLoading(false);
        } else {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        setLoading(false);
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
