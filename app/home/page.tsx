"use client";
import { use, useContext, useEffect, useState } from "react";
import { UserContext, UserContextType, UseUser } from "../contexts/UserContext";
import { TPost, TUser } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import axios from "axios";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../Nav";
import Post from "../Post";

export default function Home() {
  const { user } = useContext(UserContext) as UserContextType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const fetchPosts = async () => {
    await axios
      .get(`/api/posts/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts([...posts, ...res.data]);
        setPage((prev) => {
          return prev + 1;
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <Nav />
      {user == null ? (
        <Loading className="w-screen h-screen flex items-center justify-center" />
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          hasMore={hasMore}
          loader={
            <Loading className="flex items-center justify-center mt-[30vh]" />
          }
          next={fetchPosts}
          className="flex items-center flex-col gap-[5vh] mt-[10vh]"
        >
          {posts.map((post) => (
            <Post
              post={post}
              User={user}
              key={post.id as string}
              profilePage={false}
            />
          ))}
        </InfiniteScroll>
      )}
      {error && <Error error={error} className="text-[2rem] text-center" />}
    </div>
  );
}
