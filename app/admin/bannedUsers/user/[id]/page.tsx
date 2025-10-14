"use client";
import { UseUser } from "@/app/contexts/UserContext";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [sUser, setSUser] = useState<TUser>();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = UseUser();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const fetchUser = async () => {
    setLoading(true);
    axios
      .get(`/api/user/banned/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setSUser(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchPosts = async () => {
    setLoading(true);
    axios
      .get(`/api/user/banned/posts/${id}?page=${page}`, {
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
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!user) return;
    fetchUser();
    fetchPosts();
  }, [user]);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="h-screen flex items-center justify-center" />
      ) : (
        <div>
          <div className="flex items-center justify-center mt-[20vh] flex-col">
            <div className="flex gap-4">
              <h1 className="text-[1.5rem] font-bold">{sUser?.username}</h1>
              <button
                className="bg-[#121212] px-4 py-1 font-bold rounded-md"
                onClick={() => {
                  axios
                    .post(
                      `/api/user/unban/${sUser?.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Unbanned");
                      router.back();
                    });
                }}
              >
                Unban
              </button>
            </div>
            <div className="flex gap-4 text-[#6d6d6dcc]">
              <h1>Followers: {sUser?.followers.length}</h1>
              <h1>Following: {sUser?.following.length}</h1>
            </div>
          </div>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchPosts}
            hasMore={hasMore}
            loader={
              <Loading className="flex items-center justify-center mt-[30vh]" />
            }
            className="flex flex-col items-center mt-[20vh]"
          >
            {posts.map((post) => (
              <div className="bg-[#141414] p-[2rem] rounded-md">
                <h1 className="text-[1.2rem] font-semibold">
                  {post.author.username}
                </h1>
                <h1 className="text-[1.4rem] font-bold">{post.title}</h1>
                <p>{post.description}</p>
                <div className="overflow-x-scroll snap-x snap-mandatory flex landing-md:w-[30rem] w-[17rem]">
                  {post.imageUrls.map((url) => (
                    <img
                      src={url as string}
                      alt="post image"
                      className="snap-center"
                    />
                  ))}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
      {error && (
        <Error
          error={error}
          className="text-[1.5rem] font-bold text-center my-[10vh]"
        />
      )}
    </>
  );
}
