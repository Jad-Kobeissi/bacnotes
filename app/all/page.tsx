"use client";
import { useEffect, useState } from "react";
import { TPost, TUser } from "../types";
import { UseUser } from "../contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Nav } from "../Nav";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import Post from "../Post";
import { Error } from "../Error";

export default function All() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const { user } = UseUser();

  const fetchPosts = () => {
    axios
      .get(`/api/posts/all?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    setPosts([]);
    if (!user) return;

    fetchPosts();
  }, [user]);

  return (
    <>
      <Nav />

      <h1 className="text-[2rem] font-bold text-center my-[20vh]">All Posts</h1>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchPosts}
        loader={
          <Loading className="flex items-center justify-center mt-[20vh]" />
        }
        dataLength={posts.length}
        className="flex flex-col gap-4 items-center "
      >
        {posts.map((post) => (
          <Post
            post={post}
            User={user as TUser}
            profilePage={false}
            key={post.id as string}
          />
        ))}
      </InfiniteScroll>
      {error && (
        <Error error={error} className="text-[2rem] text-center mt-[10vh]" />
      )}
    </>
  );
}
