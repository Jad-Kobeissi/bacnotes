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
import { UseUser } from "@/app/contexts/UserContext";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [sUser, setSuser] = useState<TUser | null>(null);
  const [following, setFollowing] = useState(false);
  const { user, setUser } = UseUser();
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
        setSuser(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err.response.data);
      });
  };
  useEffect(() => {
    if (!user) return;

    fetchPosts();
    fetchUser();
  }, [user]);
  useEffect(() => {
    if (!user || !sUser) return;

    if (sUser?.followers.some((u) => u.id == user.id)) {
      setFollowing(true);
    }
  }, [sUser, user]);
  return (
    <div>
      <Nav />
      <div className="mt-[20vh]">
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-4">
            <h1 className="text-[1.5rem] capitalize font-bold">
              {sUser?.username}
            </h1>
            {following ? (
              <button
                className="bg-[var(--brand)] px-4 py-1 font-bold rounded-md border border-[var(--brand)] hover:bg-transparent transition-all duration-200"
                onClick={() => {
                  axios
                    .post(
                      `/api/user/unfollow/${sUser?.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      console.log(res.data);

                      setUser(res.data);
                      setSuser((prev: TUser | null) => {
                        return {
                          followers: prev?.followers.filter(
                            (u) => u.id !== user?.id
                          ),
                          ...prev,
                        } as TUser;
                      });
                    });
                }}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="bg-[var(--brand)] px-4 py-1 font-bold rounded-md border border-[var(--brand)] hover:bg-transparent transition-all duration-200"
                onClick={() => {
                  axios
                    .post(
                      `/api/user/follow/${sUser?.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      setUser(res.data);
                    });
                }}
              >
                Follow
              </button>
            )}
            {user?.admin && (
              <button
                className="bg-[#d60e0e] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#d60e0e] active:bg-transparent border transition-all duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  axios
                    .post(
                      `/api/ban/${sUser?.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((ref) => {
                      alert("User banned");
                      router.push("/home");
                    })
                    .catch((err) => {
                      setError(err.response.data);
                    });
                }}
              >
                Ban
              </button>
            )}
          </div>
          <div className="flex gap-3 text-[var(--secondary-text)]">
            <motion.h1
              className="capitalize"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/followers/${sUser?.id}`)}
            >
              followers: {sUser?.followers.length}
            </motion.h1>
            <motion.h1
              className="capitalize"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              following: {sUser?.following.length}
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
