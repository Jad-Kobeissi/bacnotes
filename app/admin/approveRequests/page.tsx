"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import { TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ApproveRequests() {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const fetchRequests = () => {
    axios
      .get(`/api/requests/nonApproved?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        const unfilteredRequest = [...requests, ...res.data];
        const filteredRequest = unfilteredRequest.filter(
          (request, index, self) =>
            index === self.findIndex((t) => t.id === request.id)
        );
        setRequests(filteredRequest);
        setPage((prev) => prev + 1);
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
      <h1 className="text-[1.5rem] text-center font-bold mt-[20vh]">
        Approve Requests
      </h1>
      <InfiniteScroll
        next={fetchRequests}
        hasMore={hasMore}
        dataLength={requests.length}
        loader={
          <Loading className="flex items-center justify-center mt-[10vh]" />
        }
        className="flex flex-col mt-[30vh] items-center"
      >
        {requests.map((request) => (
          <div
            className="bg-[var(--card-color)] w-fit p-[2rem] rounded-md"
            key={request.id as string}
          >
            <h1 className="text-[1.1rem]">{request.author.username}</h1>
            <h1 className="text-[1.4rem] font-bold">{request.title}</h1>
            <p>{request.description}</p>
            <div className="flex gap4">
              <button
                className="bg-[var(--green-color)] px-4 py-1 font-bold rounded-md text-[1.3rem] mr-[1rem]"
                onClick={() => {
                  axios
                    .post(
                      `/api/requests/approve/${request.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Approved");
                      setRequests((prev) =>
                        prev.filter((p) => p.id !== request.id)
                      );
                    });
                }}
              >
                Approve
              </button>
              <button
                className="bg-[var(--danger-red)] px-4 py-1 font-bold rounded-md text-[1.3rem]"
                onClick={() => {
                  axios
                    .post(
                      `/api/requests/reject/${request.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Rejected");
                      setRequests((prev) =>
                        prev.filter((p) => p.id !== request.id)
                      );
                    });
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="text-[1.5rem] text-center" />}
    </>
  );
}
