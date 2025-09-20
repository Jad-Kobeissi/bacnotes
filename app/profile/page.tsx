"use client";
import { use, useEffect, useRef, useState } from "react";
import { UseUser } from "../contexts/UserContext";
import { TPost, TUser } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import axios from "axios";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../Nav";
import Post from "../Post";

export default function Profile() {
  const { user } = UseUser();
  const [mainUser, setMainUser] = useState<TUser | null>();
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const fetchPosts = async () => {
    await axios
      .get(`/api/posts/user/${mainUser?.id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts([...posts, ...res.data]);
        setPage((prev) => {
          return prev + 1;
        });
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    if (user) {
      setMainUser(() => {
        return user;
      });
    }
  }, [user]);
  useEffect(() => {
    if (mainUser) {
      fetchPosts();
    }
  }, [mainUser]);
  return (
    <>
      <Nav />
      <div className="my-[10vh] flex items-center justify-center flex-col">
        <h1 className="text-[2rem] font-bold capitalize">
          {mainUser?.username}
        </h1>
        <div className="text-[#6d6d6d] font-bold flex gap-[1rem]">
          <h1>Rating: {String(mainUser?.rating)}</h1>
          <h1>User Points: {String(mainUser?.points)}</h1>
        </div>
        <div className="flex gap-[1rem] text-[#6d6d6dcc]">
          <h1>Followers: {mainUser?.followers.length}</h1>
          <h1>Following: {mainUser?.following.length}</h1>
        </div>
      </div>
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
            key={post.id as string}
            post={post}
            User={mainUser as TUser}
            profilePage={true}
          />
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[2rem] text-center" />}
    </>
  );
}
