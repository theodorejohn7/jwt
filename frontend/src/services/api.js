import axios from "axios";
import TokenService from "./tokenService";
import authService from "./authService";

import { useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    console.log("eror @line 23");
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const res = await instance.post("/auth/token", {
            refreshToken: TokenService.getLocalRefreshToken(),
          });
          console.log("response", res);
          const { accessToken } = res.data;
          console.log("updatedNewAccessToken", accessToken);
          TokenService.updateNewAccessToken(accessToken);

          return instance(originalConfig);
        } catch (error1) {
          return Promise.reject(error1);
        }
      }

      //refresh token expired

      // if (error.response.status === 403 && error.response.data) {
      if (error.response.status === 403) {
        console.log("inside error of token expired");
        return Promise.reject(error.response.data);
      }

      /////////////////////
    }
    // console.log("above reject")
    return Promise.reject(error);
  }
);
export default instance;
