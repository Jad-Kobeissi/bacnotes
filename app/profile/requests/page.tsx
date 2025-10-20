"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import { TRequest } from "../../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../Loading";
import axios from "axios";
import { Error } from "../../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../../Nav";
import Post from "../../Post";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import Link from "next/link";

export default function Requests() {
  const { user } = useContext(UserContext) as UserContextType;
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TRequest[]>([]);
  const [page, setPage] = useState(1);
  let [deleteModal, setDeleteModal] = useState(false);
  const fetchPosts = async () => {
    setError("");
    setHasMore(true);
    await axios
      .get(`/api/requests/user/${user?.id}?page=${page}`, {
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
    if (!user) return;
    fetchPosts();
  }, [user]);
  const router = useRouter();
  return user ? (
    <>
      <Nav />
      <div className="my-[10vh] flex items-center justify-center flex-col">
        <div className="flex items-center gap-[2rem]">
          <h1 className="text-[2rem] font-bold capitalize flex items-center gap-4">
            {user?.username}{" "}
            {user.admin ? (
              <p className="text-[1rem] text-[var(--secondary-text)]">admin</p>
            ) : null}
          </h1>
          <button
            onClick={() => {
              setDeleteModal(true);
            }}
            className="bg-[#ce1a35] text-[1.2rem] font-bold rounded px-3 py-1 text-[#d9d9d9] hover:bg-transparent border border-[#ce1a35] transition-all duration-200"
          >
            Delete
          </button>
        </div>
        <h1 className="text-[#6d6d6d] font-bold text-[1.2rem] block">
          Grade: {user.grade as number}
        </h1>
        <div className="text-[#6d6d6dcc] font-bold flex gap-[1rem]">
          <h1>Rating: {String(user?.rating)}</h1>
          <h1>User Points: {String(user?.points)}</h1>
        </div>
        <div className="flex gap-[1rem] text-[#6d6d6dcc]">
          <h1>Followers: {user.followers ? user.followers.length : 0}</h1>
          <h1>Following: {user.following ? user.following.length : 0}</h1>
        </div>
        <div className="text-[2rem] font-bold flex gap-6">
          <Link href={"/profile"} className="text-[var(--secondary-text)]">
            Posts
          </Link>
          <Link href={"/profile/requests"}>Requests</Link>
        </div>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        loader={
          <Loading className="flex items-center justify-center mt-[30vh] h-screen" />
        }
        next={fetchPosts}
        className="flex items-center flex-col gap-[5vh] mt-[10vh]"
      >
        {posts.map((post) => (
          <div
            className="bg-[var(--card-color)] p-[2rem] max-w-[20rem]"
            onClick={() => {
              router.push(`/requests/${post.id}`);
            }}
          >
            <h1 className="text-[1.1rem]">{post.author.username}</h1>
            <h1 className="text-[1.4rem] font-bold">{post.title}</h1>
            <p className="truncate">{post.description}</p>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[2rem] text-center" />}
    </>
  ) : (
    <Loading className="flex items-center justify-center h-screen" />
  );
}
