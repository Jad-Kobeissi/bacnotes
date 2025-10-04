"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { motion } from "motion/react";
import { Nav } from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState<TUser | null>(null);
  const router = useRouter();
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts(res.data);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  const fetchUser = () => {
    axios
      .get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err.response.data);
      });
  };
  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);
  return (
    <div>
      <Nav />
      <div className="mt-[20vh]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[1.2rem] font-bold">{user?.username}</h1>
          <div className="flex gap-3 text-[var(--secondary-text)]">
            <motion.h1
              className="capitalize"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/followers/${user?.id}`)}
            >
              followers: {user?.followers.length}
            </motion.h1>
            <motion.h1
              className="capitalize"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              following: {user?.following.length}
            </motion.h1>
          </div>
        </div>
        <InfiniteScroll
          dataLength={posts?.length as number}
          next={fetchPosts}
          hasMore={hasMore}
          loader={
            <Loading className="h-screen flex items-center justify-center" />
          }
          className="flex items-center justify-center flex-col mt-[10vh]"
        >
          {posts?.map((post) => (
            <Post
              post={post}
              User={user as TUser}
              profilePage={false}
              key={post.id as string}
            />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="text-center text-[1.5rem]" />}
      </div>
    </div>
  );
}
