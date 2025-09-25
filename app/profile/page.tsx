"use client";
import { useEffect, useState } from "react";
import { UseUser } from "../contexts/UserContext";
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
  const { user } = UseUser();
  const [mainUser, setMainUser] = useState<TUser | null>(null);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
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
    console.log(user?.followers);
  }, [user]);
  useEffect(() => {
    if (mainUser) {
      fetchPosts();
    }
  }, [mainUser]);
  const router = useRouter();
  return mainUser ? (
    <>
      <Nav />
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)}>
        <h1>hi</h1>
      </Dialog>
      <div className="my-[10vh] flex items-center justify-center flex-col">
        <div className="flex items-center gap-[2rem]">
          <h1 className="text-[2rem] font-bold capitalize">
            {mainUser.username}
          </h1>
          <button
            onClick={() => {
              axios
                .delete(`/api/user/${mainUser.id}`, {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                })
                .then((res) => {
                  router.push("/");
                });
            }}
            className="bg-[#ce1a35] text-[1.2rem] font-bold rounded px-3 py-1 text-[#d9d9d9] hover:bg-transparent border border-[#ce1a35] transition-all duration-200"
          >
            Delete
          </button>
        </div>
        <div className="text-[#6d6d6d] font-bold flex gap-[1rem]">
          <h1>Rating: {String(mainUser?.rating)}</h1>
          <h1>User Points: {String(mainUser?.points)}</h1>
        </div>
        <div className="flex gap-[1rem] text-[#6d6d6dcc]">
          <h1>Followers: {mainUser?.followers.length || 0}</h1>
          <h1>Following: {mainUser?.following.length || 0}</h1>
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
  ) : (
    <Loading />
  );
}
