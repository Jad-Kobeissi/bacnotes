"use client";
import { UserContext } from "@/app/contexts/UserContext";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const context = React.use(params);
  const id = context.id;
  const user = useContext(UserContext)?.user;
  const [post, setPost] = useState<TPost | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fetchPost = async () => {
    setLoading(true);
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div>
      <Nav />
      {loading ? (
        <Loading className="h-screen flex items-center justify-center" />
      ) : (
        <div className="flex items-center justify-center h-screen">
          {post && (
            <Post
              User={user as TUser}
              post={post as TPost}
              profilePage={false}
              className="bg-transparent"
            />
          )}
          {error && <Error error={error} />}
        </div>
      )}
    </div>
  );
}
