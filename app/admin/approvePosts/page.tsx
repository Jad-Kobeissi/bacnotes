"use client";
import { useEffect, useState } from "react";
import { UseUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";
import { TPost, TUser } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "../Loading";
import Post from "../Post";
import { Nav } from "../Nav";
import { Error } from "../Error";
import Image from "next/image";

export default function Admin() {
  const { user } = UseUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const fetchPosts = () => {
    axios
      .get(`/api/posts/admin/nonApproved?page=${page}`, {
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
    if (!user) return;
    if (!user.admin) {
      alert("Forbidden");
      router.push("/home");
    }

    fetchPosts();
  }, [user]);
  return (
    <>
      <Nav />
      <h1 className="text-[2rem] font-bold text-center my-[10vh]">
        Admin Dashboard
      </h1>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchPosts}
        loader={
          <Loading className="flex items-center justify-center mt-[30vh]" />
        }
        dataLength={posts.length}
        className="flex justify-center w-screen "
      >
        {posts.map((post) => (
          <div
            className="bg-[#141414] w-fit h-fit p-[2rem] flex flex-col items-center justify-center gap-4"
            key={post.id as string}
          >
            <h1 className="text-[1.2rem] font-bold">{post.author.username}</h1>
            <h1 className="text-[1.5rem] font-bold">Title: {post.title}</h1>
            <p>{post.description}</p>
            <div className="overflow-x-scroll snap-x snap-mandatory flex w-[17rem] landing-md:w-[32rem]">
              {post.imageUrls.map((url) => (
                <img
                  src={url as string}
                  alt="Post image"
                  className="snap-center"
                  key={url as string}
                ></img>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                className="bg-[#0ec73c] py-2 px-6 font-bold rounded-md"
                onClick={() => {
                  axios
                    .post(
                      `/api/posts/admin/approve/${post.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Approved!");
                      setPosts((prev) => prev.filter((p) => p.id !== post.id));
                    })
                    .catch((err) => {
                      setError(err.response.data);
                    });
                }}
              >
                Approve
              </button>
              <h1 className="text-[1.2rem] font-bold">OR</h1>
              <button
                className="bg-[#d60e0e] py-2 px-6 font-bold rounded-md"
                onClick={() => {
                  axios
                    .post(
                      `/api/posts/admin/reject/${post.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Rejected");
                      setPosts((prev) => prev.filter((p) => p.id !== post.id));
                    })
                    .catch((err) => {
                      setError(err.response.data);
                    });
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </InfiniteScroll>
      {error && (
        <Error error={error} className="text-center mt-[20vh] text-[1.6rem]" />
      )}
    </>
  );
}
