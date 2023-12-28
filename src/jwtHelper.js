import jwtDecode from "jwt-decode";

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("Token expired");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Token decoding error:", error);
    return false;
  }
};

