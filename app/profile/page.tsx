"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType, UseUser } from "../contexts/UserContext";
import { TPost, TUser } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import axios from "axios";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../Nav";
import Post from "../Post";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";

export default function Profile() {
  const { user } = useContext(UserContext) as UserContextType;
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  let [deleteModal, setDeleteModal] = useState(false);
  const fetchPosts = async () => {
    setError("");
    setHasMore(true);
    await axios
      .get(`/api/posts/user/${user?.id}?page=${page}`, {
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
      <Dialog
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        className=" bg-transparent backdrop-blur-2xl text-white w-screen h-screen absolute top-0 left-0"
      >
        <div className="flex flex-col items-center justify-center h-screen gap-[2rem]">
          <div className="bg-[#141414] p-[2rem] rounded flex flex-col gap-[2rem] items-center">
            <h1 className="text-[2rem]">
              Are you sure you want to delete your account?
            </h1>
            <div className="flex items-center gap-[2rem]">
              <button
                onClick={() => {
                  axios
                    .delete(`/api/user/${user.id}`, {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      router.push("/");
                      localStorage.clear();
                    });
                }}
                className="bg-[#ce1a35] text-[1.2rem] font-bold rounded px-3 py-1 text-[#d9d9d9] hover:bg-transparent border border-[#ce1a35] transition-all duration-200"
              >
                Delete
              </button>
              <button
                className="bg-[#121212] text-[1.2rem] font-bold rounded px-3 py-1 text-[#d9d9d9] hover:bg-transparent border border-[#141414] transition-all duration-200"
                onClick={() => setDeleteModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
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
        <div className="text-[#6d6d6d] font-bold flex gap-[1rem]">
          <h1>Rating: {String(user?.rating)}</h1>
          <h1>User Points: {String(user?.points)}</h1>
        </div>
        <div className="flex gap-[1rem] text-[#6d6d6dcc]">
          <h1>Followers: {user.followers ? user.followers.length : 0}</h1>
          <h1>Following: {user.following ? user.following.length : 0}</h1>
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
          <Post
            key={post.id as string}
            post={post}
            User={user as TUser}
            profilePage={true}
          />
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[2rem] text-center" />}
    </>
  ) : (
    <Loading className="flex items-center justify-center h-screen" />
  );
}
