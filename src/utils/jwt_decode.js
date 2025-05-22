import {jwtDecode} from "jwt-decode"

export const checkTokenExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 3600; // in seconds
  
      if (decoded.exp && decoded.exp < currentTime) {
        return [true, {}]
      } else {
        return [false, decoded.sub]; // valid
      }
    } catch (error) {
      console.error("Invalid token", error);
      return [true, {}]; // treat invalid token as expired
    }
  };