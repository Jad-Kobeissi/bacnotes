"use client";
import { use, useEffect, useState } from "react";
import { UseUser } from "../contexts/UserContext";
import { TPost, TUser } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import axios from "axios";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { Nav } from "../Nav";

export default function Home() {
  const { user } = UseUser();
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
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  return (
    <>
      <Nav />
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
          <div
            className="bg-[#141414] w-fit h-fit rounded-xl p-[2rem]"
            key={post.id as string}
          >
            <h1>Username: {post.author.username}</h1>
            <h1 className="text-[1.5rem] capitalize font-bold">{post.title}</h1>
            <p>{post.description}</p>
            <p className="text-[#6d6d6d]">{post.subject}</p>
            <div className="overflow-x-scroll snap-x snap-mandatory flex landing-md:w-[30rem] w-[17rem]">
              {post.imageUrls.map((url) => (
                <img
                  key={url as string}
                  src={url as string}
                  alt={post.title as string}
                  className="snap-center"
                />
              ))}
            </div>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[2rem] text-center" />}
    </>
  );
}
