"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import { TResponse } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ApproveResponses() {
  const [responses, setResponses] = useState<TResponse[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const fetchResponses = () => {
    axios
      .get(`/api/response/nonApproved?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        const unfilteredResponse = [...responses, ...res.data];
        const filteredResponse = unfilteredResponse.filter(
          (response, index, self) =>
            index === self.findIndex((t) => t.id === response.id)
        );
        setResponses(filteredResponse);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <>
      <Nav />
      <h1 className="text-[1.5rem] text-center font-bold mt-[20vh]">
        Approve Responses
      </h1>
      <InfiniteScroll
        next={fetchResponses}
        hasMore={hasMore}
        dataLength={responses.length}
        loader={
          <Loading className="flex items-center justify-center mt-[10vh]" />
        }
        className="flex flex-col mt-[30vh] gap-8 items-center"
      >
        {responses.map((response) => (
          <div
            className="bg-[var(--card-color)] w-fit p-[2rem] rounded-md"
            key={response.id as string}
          >
            <h1 className="text-[1.1rem]">{response.author.username}</h1>
            <h1 className="text-[1.4rem] font-bold">{response.title}</h1>
            <p>{response.description}</p>
            <div className="flex overflow-x-scroll snap-mandatory snap-x w-[20rem]">
              {response.imageUrls.map((url) => (
                <img
                  src={url as string}
                  alt="image"
                  className="w-[15rem] snap-center"
                  key={url as string}
                  onClick={() => window.open(url as string, "_blank")}
                />
              ))}
            </div>
            <div className="flex gap4">
              <button
                className="bg-[var(--green-color)] px-4 py-1 font-bold rounded-md text-[1.3rem] mr-[1rem]"
                onClick={() => {
                  axios
                    .post(
                      `/api/response/approve/${response.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Approved");
                      setResponses((prev) =>
                        prev.filter((p) => p.id !== response.id)
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
                      `/api/response/reject/${response.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then((res) => {
                      alert("Rejected");
                      setResponses((prev) =>
                        prev.filter((p) => p.id !== response.id)
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
