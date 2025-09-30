"use client";
import React, { use, useContext, useEffect, useState } from "react";
import {
  UserContext,
  UserContextType,
  UseUser,
} from "../../contexts/UserContext";
import { TPost, TUser } from "../../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../Loading";
import axios from "axios";
import { Error } from "../../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../../Nav";
import Post from "../../Post";
import { useRouter } from "next/navigation";

export default function Subject({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { user } = useContext(UserContext) as UserContextType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { subject } = React.use(params);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const fetchPosts = async () => {
    await axios
      .get(`/api/posts/subject/${subject}?page=${page}`, {
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
    <div className="min-h-screen text-[var(--text-primary)] flex items-center justify-center flex-col gap-[1rem]">
      <Nav />
      {user == null ? (
        <Loading className="w-screen h-screen flex items-center justify-center" />
      ) : (
        <>
          <button className="button" onClick={() => router.back()}>
            Go Back
          </button>
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
          {error && <Error error={error} className="text-[2rem] text-center" />}
        </>
      )}
    </div>
  );
}
