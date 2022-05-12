import React, { useState, useEffect } from "react";
import postService from "../services/postService";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postService.getAllPublicPosts().then(
      (response) => {
        setPosts(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div>
      <h3>
        {posts.map((post) => (
          <div>{post.content}</div>
        ))}
      </h3>
    </div>
  );
};
