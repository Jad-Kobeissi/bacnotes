"use client";
import { useEffect, useState } from "react";
import { TRequest } from "../types";
import axios from "axios";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import { Nav } from "../Nav";
import { UseUser } from "../contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
export default function Requests() {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const { user } = UseUser();
  const fetchRequests = async () => {
    axios
      .get(`/api/requests?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequests(res.data);
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
    fetchRequests();
  }, []);

  return (
    <>
      <Nav />
      <div className="my-[10vh] flex flex-col gap-4">
        <h1 className="text-[2rem] font-bold text-center">
          Welcome {user?.username}
        </h1>
        <div className="flex gap-7 items-center justify-center text-[1.5rem] font-bold">
          <Link href={"/home"} className="text-[var(--secondary-text)]">
            Posts
          </Link>
          <Link href={"/requests"}>Requests</Link>
        </div>
      </div>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchRequests}
        dataLength={requests.length}
        loader={
          <Loading className="flex items-center justify-center mt-[20vh]" />
        }
        className="flex flex-col items-center mt-[20vh]"
      >
        {requests.map((request) => (
          <div
            className="bg-[var(--card-color)] w-fit h-fit p-[2rem] rounded-md"
            onClick={() => {
              router.push(`/requests/${request.id}`);
            }}
          >
            <h1>{request.author.username}</h1>
            <h1 className="text-[1.3rem] font-bold">{request.title}</h1>
            <p className="text-[var(--secondary-text)]">
              {request.description}
            </p>
            <p className="text-[var(--secondary-text)]">
              {request.responses.length} responses
            </p>
            <button
              className="bg-[var(--brand)] px-6 py-1 font-bold rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/reply/${request.id}`);
              }}
            >
              Reply
            </button>
            <p className="text-[var(--secondary-text)]">
              {dayjs(request.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </InfiniteScroll>
      {error && (
        <Error error={error} className="text-center text-[1.4rem] mt-[5vh]" />
      )}
    </>
  );
}
