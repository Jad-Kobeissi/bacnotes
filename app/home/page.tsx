"use client";
import { use, useContext, useEffect, useState } from "react";
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

export default function Home() {
  const { user } = useContext(UserContext) as UserContextType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("");
  const router = useRouter();
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
    <>
      <Nav />
      <div className="flex h-screen items-center justify-center flex-col gap-[2rem]">
        {user == null ? (
          <Loading className="w-screen h-screen flex items-center justify-center" />
        ) : (
          <div className="flex flex-col gap-4 my-[10vh]">
            <div className="flex items-center justify-center mt-[30vh] gap-4">
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-[#6d6d66d]">
                  Subject
                </label>
                <select
                  className="bg-[var(--card-color)] px-4 py-2 rounded-lg"
                  id="subject"
                  value={selected}
                  onChange={(e) => {
                    setSelected(e.target.value);
                  }}
                >
                  <option value="">Select Value</option>
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                  <option value="french">French</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="Math">Math</option>
                  <option value="geography">Geography</option>
                  <option value="civics">Civics</option>
                  <option value="history">History</option>
                </select>
                <button
                  onClick={() => router.push(`/subject/${selected}`)}
                  className="button"
                >
                  Filter
                </button>
              </div>
            </div>
            <InfiniteScroll
              dataLength={posts.length}
              hasMore={hasMore}
              loader={<Loading className="flex items-center justify-center" />}
              next={fetchPosts}
              className="flex items-center flex-col gap-[5vh]"
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
          </div>
        )}
        {error && <Error error={error} className="text-[2rem] text-center" />}
      </div>
    </>
  );
}
