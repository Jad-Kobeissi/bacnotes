"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Searched({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<TUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const fetchUsers = () => {
    axios
      .get(`/api/user/search/banned/${username}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const router = useRouter();
  return (
    <div>
      <Nav />
      <h1 className="text-center text-[2rem] my-[20vh]">
        Searched For <span className="font-bold">{username}</span>
      </h1>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchUsers}
        dataLength={users?.length as number}
        loader={
          <Loading className="mt-[20vh] flex items-center jsutify-center" />
        }
        className="flex flex-col items-center my-[20vh] gap-4"
      >
        {users.map((user) => (
          <div
            key={user.id as string}
            className="bg-[var(--card-color)] font-bold p-[1rem] px-[2rem] rounded-md"
            onClick={() => {
              router.push(`/user/${user.id}`);
            }}
          >
            <h1>{user.username}</h1>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[1.5rem] text-center" />}
    </div>
  );
}
