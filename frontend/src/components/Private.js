import React, { useState, useEffect } from "react";

import postService from "../services/postService";
// import authService from "../services/authService";

// import { useNavigate } from "react-router-dom";

const Home = () => {
  const [privatePosts, setPrivatePosts] = useState([]);
  // const navigate = useNavigate();


  useEffect(() => {

    postService.getAllPrivatePosts().then(
      (response) => {
        setPrivatePosts(response.data);
      },
      (error) => {
        console.log("Private page", error.response);

        // if (error.response && error.response.status === 403) {

        //   authService.logout();
        //   navigate("/login");
        //   window.location.reload();
        // }
      }
    );
  }, []);

  return (
    <div>
      <h3>{privatePosts.map((post) => post.content)}</h3>
    </div>
  );
};
export default Home;
