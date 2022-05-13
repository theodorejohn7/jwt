// import axios from "axios";
// import authHeader from "./authHeader";

// const API_URL = "http://localhost:5000/posts/";

import api from "./api";

const getAllPublicPosts = () => {
  return api.get("/posts/public");
};

const getAllPrivatePosts = () => {
  // return axios.get(API_URL + "/private", { headers: authHeader() });

  return api.get("/posts/private");
};

const postService = {
  getAllPublicPosts,
  getAllPrivatePosts,
};
 

export default postService;
